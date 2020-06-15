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

	  // Toggle the LGA control depending on the value of Mode
	  $("#cboMode").on('change', function(evt){
	  	if (this.value === 'l') {
	  		$('.lgaControls').show();
	  	} else {
	  		$('.lgaControls').hide();
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
		console.log("add ability to specify a polygon")
	}

  var timePeriod = $("#cboTime").val();
  if (timePeriod === ""){
    $("#errorText").text("Please choose the time period");
    resetSubmitButton();
    return;
  }

  try{
    var url = config.pythonUrl + "hazard=" + hazard + "&time=" + timePeriod + "&mode=" + mode;
    if (mode === 'l') {
    	url += "&name=" + lga;
    } else if (mode === 'd'){
    	url += "&loc=[[-26.9163029504216,-26.5197353567963,-25.2272174730742,-25.5275009631243,-26.9163029504216],[151.047109016969,152.153879031906,151.80195746,150.559486256706,151.047109016969]]";
    }

    $.ajax({
      url: url,
      type: 'GET'
    }).done(function(response) {
      if (response['output probabilities'] !== undefined){
        $("#tblProbabilities > thead").append("<th>Year</th><th>Probability</th>");
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
