// Enter your custom JavaScript code here

function beforeMapLoads(){
	console.log("Before map loads function");

	$("#climate-btn").click(function() {
	  if ($(this).parent().hasClass('disabled')) { return null;}
	  console.log("configuring climate tool");
	  configureClimateRiskAnalysis();

	});

  // Check for any valid "Client_" layers which this ArcGIS Online
  // user has access to
  let url = config.baseURL + "&token=" + config.token;
  $.ajax({
    url: url,
    type: 'GET',
    dataType: "json"
  }).done(function(response) {

    for (var i = 0; i < response.services.length; i++){
      var service = response.services[i];
      if (service.name.toUpperCase().includes("CLIENT_")) {
        // Add the Client Data TOC category unless it's already found
        var tocCategory = config.tocCategories.find(o => o.name === "Client data");
        if (tocCategory === undefined){
          config.tocCategories.push({name: "Client data", layers:[]});
          tocCategory = config.tocCategories.find(o => o.name === "Client data");
        }

        // Add this layer to the config file
        tocCategory.layers.push(service.name);

        // var iconUrl = 'http://crdb.ewn.com.au/images/layer_markers/';
        // iconUrl += service.name.toLowerCase().replace("client_", "") + ".png"
        var clientIcon = L.icon({
          iconUrl:  'http://crdb.ewn.com.au/images/layer_markers/' + service.name.toLowerCase().replace("client_", "") + ".png",
          iconSize:     [38, 95], // size of the icon
          shadowSize:   [50, 64], // size of the shadow
          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          shadowAnchor: [4, 62],  // the same for the shadow
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var clientLayer = {
          "id": service.name,
          "name": "Client data - " & service.name,
          legendClass: "client",
          "type": "agsFeatureLayer",
          "tokenRequired": true,
          "opacity": 1,
          "visible": false,
          "url": service.url + "/0",
          "useCors": true,
          "popup": true,
          "fields": ["*"]
        }

        config.layers.push(clientLayer);

        console.log("found layer", service.name, "at", service.url)
      }
    }

    // Continue to load the map
    loadMap();

  }).catch(function(error) {
    console.error("There was a problem fetching the client layers")
    loadMap();
  });


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

  // Configure a custom popup which shows the TextForWeb content as this is already nicely formatted,
  // with the other information separated by a table row
  bootleaf.layers.forEach(layer => {
    layer.on("click", function(evt){
      var output = '<table>';
      var layerConfig = this.layerConfig;
      for (key in evt.layer.feature.properties){
        // Ignore ID fields
        if (["FID", "OBJECTID", "OID", "id", "ID", "ObjectID"].indexOf(key) < 0){
          var val = evt.layer.feature.properties[key];
          if (key === 'TextForWeb') {
            output += "<tr><td>" + val + "</td></tr>";
            output += "<tr></tr>";
          } else {
            output += "<tr><td>" + key + ": " + val + "</td></tr>";
          }

        }
      }
      output += "</table>"
      bootleaf.map.openPopup(output, evt.latlng)
    });
  });

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
	  })

	  // Display the Draw control on the Query Widget panel
		bootleaf.climateDrawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
          polygon: true,
          polyline: false,
          circle: false,
          marker: false,
          rectangle: false
      }
    });

    // Load the hazards from the config file
    var hazards = [];
    $.each(hazardLookup, function(key, hazard){
      hazards.push('<option value="'+ hazard.value +'">'+ hazard.alias +'</option>');}
    );
    $('#cboHazard').html(hazards.join(''));

	  // Toggle the LGA control depending on the value of Mode
	  $("#cboMode").on('change', function(evt){
	  	// clear any existing bounding boxes
  		if (bootleaf.climatePolygon !== undefined){
		    bootleaf.climatePolygon.clearLayers();
		  }
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

  $("#cboTest").on("change", function(evt){
    var test = evt.target.value;
    if (test === 'poi') {
      $(".poiControls").show();
      $("#cboHazard").prop("multiple", true);
      $("#lblHazard").text("Select Hazard(s)");
    } else if (test === "alert"){
      $(".poiControls").hide();
      $("#cboHazard").prop("multiple", false);
      $("#lblHazard").text("Select Hazard")
      $(".alertControls").show();
    } else {
      $(".poiControls").hide();
      $(".listControls").show();
    }
    console.log("change method", evt.target.value)
  });



}

function runClimateAnalysis(){
  console.log("click");
  resetSubmitButton("enable");

  try{

    var test = $("#cboTest").val();
    if (test === ""){
      $("#errorText").text("Please choose the test");
      resetSubmitButton();
      return;
    }

	  var hazard = $("#cboHazard").val();
	  if (test === 'poi' || test === 'alert') {
      if (hazard.length === 0){
  	    $("#errorText").text("Please choose the hazard type");
  	    resetSubmitButton();
  	    return;
      }
	  } else {
      // use a dummy value for List or Alert test
      hazard = "null";
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
				var loc = JSON.stringify(bootleaf.climatePolygon.toGeoJSON().features[0].geometry.coordinates[0]);
			} catch(err){
				$("#errorText").text("Please draw a polygon to represent the area of interest");
		    resetSubmitButton();
		    return;
			}
		}

	  var timePeriod = $("#cboTime").val();
	  if (test === 'poi'){
      if (timePeriod === ""){
        $("#errorText").text("Please choose the time period");
        resetSubmitButton();
        return;
      }
	  } else {
      // use a dummy value for List or Alert test
      timePeriod = "null";
    }

    var url = config.pythonUrl + "?test=" + test + "&hazard=" + hazard + "&time=" + timePeriod + "&mode=" + mode;

    if (mode === 'l') {
    	url += "&name=" + lga;
    } else if (mode === 'd'){
    	url += "&loc=" + loc;
    }

    $.ajax({
      url: url,
      type: 'GET'
    }).done(function(response) {
      if (response['output'] !== undefined && response.errorText === ''){
        var test = $("#cboTest").val();
        var output = response['output'];
        var climateResults;

        if (output === undefined){
          $("#errorText").text('There was a problem');
          return;
        };

        if (test === 'poi') {
          var results = {
            prob100: output[100],
            numYears: $("#cboTime").val()
          }
          climateResults = $("#climate-results-poi").html();
          resultsTemplate = Handlebars.compile(climateResults);
          var html = resultsTemplate(results);
          $("#results").html(html);

          $("#tblProbabilities > thead").append("<th>Num. of Events</th><th>Probability</th>");
          for (var year in output) {
            var value = output[year];
            $("#tblProbabilities > tbody").append("<tr><td>" + year + "</td><td>" + value + "</td></tr>");
          }

          $("#btnShowAllResults").on("click", function(){
            $("#tblProbabilities").toggle();
          });
        } else if (test === 'list') {
          climateResults = $("#climate-results-list").html();
          resultsTemplate = Handlebars.compile(climateResults);

          // Convert the output codes to text-friendly values
          var listResults = {}
          for (var key in output) {
            var prefix = key.substr(0, key.indexOf("_"));
            var origValue = key.substr(key.indexOf("_") + 1, key.length);
            var alias = hazardLookup.find(o => o.value === origValue).alias;
            var value = output[key];
            var str;
            if (prefix === '1') {
              str = prefix + " year: " + alias;
            } else {
              str = prefix + " years: " + alias;
            }

            listResults[str] = value;
          }

          var html = resultsTemplate(output);
          $("#results").html(html);

          $("#tblList > thead").append("<th>Hazard</th><th>Probability</th>");
          for (const [key, value] of Object.entries(listResults)) {
            $("#tblList > tbody").append("<tr><td>" + key + "</td><td>" + value + "</td></tr>");
          }

        } else if (test === 'alert') {
          climateResults = $("#climate-results-alert").html();
          resultsTemplate = Handlebars.compile(climateResults);
          var hazard = $("#cboHazard").val();
          output.hazard = hazardLookup.find(o => o.value === hazard).alias;
          var html = resultsTemplate(output);
          $("#results").html(html);

        } else {
          $("#errorText").text('There was a problem');

        }

        // Add the Poisson component to the table
        // var poisson = probabilities['poisson'];
        // if (poisson !== undefined && poisson['result'] !== undefined && poisson.result.length !== undefined){
        //   var result = poisson['result'][0];
        //   $("#tblProbabilities > thead").append("<th>Num. of Events</th><th>Probability</th>");
        //   for (var year in result) {
        //     var value = result[year];
        //     $("#tblProbabilities > tbody").append("<tr><td>" + year + "</td><td>" + value + "</td></tr>");
        //   }
        // } else {
        //   $("#errorText").text('There was a problem calculating the Poisson results');
        // }

        // Add the Mann-Kendall component below the table
        // var mannKendall = probabilities['mannKendall'];
        // if (mannKendall['result'] !== undefined && mannKendall['result'].length !== undefined) {
        //   if (mannKendall["result"][0].trend !== undefined) {
        //     $("#mannKendall").text(mannKendall['result'][0]['trend']);
        //   } else {
        //     $("#mannKendall").text(mannKendall['result'][0]);
        //   }
        // } else {
        //   $("#errorText").text('There was a problem calculating the Mann-Kendall results');
        // }

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

      // Clear the bounding box
		  if (bootleaf.climatePolygon !== undefined){
		    bootleaf.climatePolygon.clearLayers();
		  }
    }).catch(function(error) {
      $("#errorText").text("There was a problem");
      console.error("There was a problem", error);
      resetSubmitButton();
      // Clear the bounding box
		  if (bootleaf.climatePolygon !== undefined){
		    bootleaf.climatePolygon.clearLayers();
		  }
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
