// Enter your custom JavaScript code here

function beforeMapLoads(){
	console.log("Before map loads function");

	$("#climate-btn").click(function() {
	  if ($(this).parent().hasClass('disabled')) { return null;}
	  console.log("configuring climate tool");
	  configureClimateRiskAnalysis();

	});

	// Continue to load the map
	loadMap();

}

function afterMapLoads(){
	// This function is run after the map has loaded. It gives access to bootleaf.map, bootleaf.TOCcontrol, etc

	console.log("After map loads function");

	configureClimateRiskAnalysis();

  // Configure the typeahead for the LGA name
  bootleaf.bloodhoundEngine = new Bloodhound({
    datumTokenizer: function(datum) {
      return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 150,
    remote: {
      url: config.lgaSourceUrl,
      wildcard: '%QUERY',
      prepare: function(query, settings) {
        // Format the query for ArcGIS Server

        // Calculate the outfields
        settings.url += "query?f=json&outFields=" + config.lgaNameField;
        settings.url += "&returnGeometry=false&where=upper(" + config.lgaNameField + ")+like+upper(%27%25" + query + "%25%27)";
        return settings;
      },
      transform: function(response) {
        console.log(response)
        return $.map(response.features, function(feature) {
          // Return the section before the brackets
          var name = feature.attributes[config.lgaNameField];
          if (name.includes("(")){
            name = name.substr(0, name.indexOf("(") - 1);
          }
          return name;
        });
      }
    }
  });
  bootleaf.bloodhoundEngine.initialize();

}

function configureClimateRiskAnalysis() {

	var climateSource = $("#climate-template").html();
	bootleaf.climateTemplate = Handlebars.compile(climateSource);
	var html = bootleaf.climateTemplate();
	resetSidebar("Climate Risk Analysis", html);
	$("#sidebar").show("slow", null, function(evt){
		// Hook up the Bloodhound to the LGA search box
	  $('#txtLGA').typeahead({
	    hint: true,
	    highlight: true,
	    minLength: 1
	  },
	  {
	    name: 'lga',
	    source: bootleaf.bloodhoundEngine
	  });

	  // Reset the results if any inputs change, so the top portion of the control
	  // always reflects the results
	  $(".climateInput").on("change", function(){
	  	$("#results").hide();
	    $("#error").hide();
	    $("#errorText").text("");
	    if (bootleaf.climatePolygon !== undefined){
		    bootleaf.climatePolygon.clearLayers();
		  }
	  })

	  // Display the Draw control on the Query Widget panel
		bootleaf.climateDrawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
          polygon: false,
          polyline: false,
          circle: false,
          marker: false,
          rectangle: true
      }
    });

	  // Toggle the LGA control depending on the value of Mode
	  $("#cboMode").on('change', function(evt){
	  	if (this.value === 'l') {
	  		$('.climateLgaControls').show();
	  		$('.climateDrawControls').hide();
	  	} else if (this.value === 'd') {
	  		$('.climateLgaControls').hide();
	  		$("#climateDrawControlHelp").show();
	  		$('.climateDrawControls').show();

			  if (bootleaf.climateDrawControl._map === null || bootleaf.climateDrawControl._map === undefined){
			    bootleaf.map.addControl(bootleaf.climateDrawControl);
			    var htmlObject = bootleaf.climateDrawControl.getContainer();
			    var a = document.getElementById('climateDrawControl');
			    setParent(htmlObject, a);
			  }

			  // Add a graphics layer to hold polygons drawn in the Bounding Box draw tool
		    bootleaf.climatePolygon = new L.FeatureGroup();
		    bootleaf.map.addLayer(bootleaf.climatePolygon);
		    bootleaf.map.on(L.Draw.Event.CREATED, function (e) {
		      var layer = e.layer;
		      bootleaf.climatePolygon.addLayer(layer);
		    });

		    bootleaf.map.on('draw:drawstart', function (e) {
		      bootleaf.climatePolygon.clearLayers();
		      $("#climateDrawControlHelp").hide();
		    });

	  	} else {
	  		$('.climateLgaControls').hide();
	  		$('.climateDrawControls').hide();
	  	}
	  })
	});
	switchOffTools();
	bootleaf.activeTool = "climate";

	$("#btnRunClimateRiskAnalysis").on("click", function(evt){
    runClimateAnalysis();
  });

}

function runClimateAnalysis(){
  console.log("click");
  resetSubmitButton("enable");

  try{
	  var hazard = $("#cboHazard").val();
	  if (hazard === ""){
	    $("#errorText").text("Please choose the hazard type");
	    resetSubmitButton();
	    return;
	  }

	  var mode = $("#cboMode").val();
	  if (mode === ""){
	    $("#errorText").text("Please choose the mode");
	    resetSubmitButton();
	    return;
	  } else if (mode === 'l') {
			var lga = $("#txtLGA").val();
		  if (lga === ""){
		    $("#errorText").text("Please choose the starting LGA");
		    resetSubmitButton();
		    return;
		  }
		} else if (mode === 'd') {
			try{
				var loc = JSON.stringify(bootleaf.climatePolygon.toGeoJSON().features[0].geometry.coordinates);
			} catch(err){
				$("#errorText").text("Please draw a polygon to represent the area of interest");
		    resetSubmitButton();
		    return;
			}
		}

	  var timePeriod = $("#cboTime").val();
	  if (timePeriod === ""){
	    $("#errorText").text("Please choose the time period");
	    resetSubmitButton();
	    return;
	  }


    var url = config.pythonUrl + "hazard=" + hazard + "&time=" + timePeriod + "&mode=" + mode;
    if (mode === 'l') {
    	url += "&name=" + lga;
    } else if (mode === 'd'){
    	url += "&loc=" + loc;
    }

    $.ajax({
      url: url,
      type: 'GET'
    }).done(function(response) {
      if (response['output probabilities'] !== undefined){
        $("#tblProbabilities > thead").append("<th>Num. of Events</th><th>Probability</th>");
        var probabilities = response['output probabilities'];
        for (var year in probabilities) {
          var value = probabilities[year];
          $("#tblProbabilities > tbody").append("<tr><td>" + year + "</td><td>" + value + "</td></tr>");
        }

        // Reset
        $("#results").show();
        $("#btnRunClimateRiskAnalysis").text("Run");
        $("#btnRunClimateRiskAnalysis").prop("disabled", false);

      } else {
        if (response['errorText'] !== undefined){
          $("#errorText").text(response['errorText']);
        }
        console.error("no probabilities reported")
        resetSubmitButton();
      }
    }).catch(function(error) {
      $("#errorText").text("There was a problem");
      console.error("There was a problem", error);
      resetSubmitButton();
    });
  }catch(error){
    console.error("There was a problem", error);
    $("#errorText").text("There was a problem");
    resetSubmitButton();
  }
}

function resetSubmitButton(mode){
  if (mode === "enable") {
    $("#btnRunClimateRiskAnalysis").text("please wait");
    $("#btnRunClimateRiskAnalysis").prop("disabled", true);
    $("#tblProbabilities tbody").empty()
    $("#tblProbabilities thead").empty()
    $("#results").hide();
    $("#error").hide();
    $("#errorText").text("");
  } else {
    $("#results").hide();
    $("#error").show();
    $("#btnRunClimateRiskAnalysis").text("Run");
    $("#btnRunClimateRiskAnalysis").prop("disabled", false);
  }

}
