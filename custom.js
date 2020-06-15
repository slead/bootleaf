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

function configureClimateRiskAnalysis() {

	var climateSource = $("#climate-template").html();
	bootleaf.climateTemplate = Handlebars.compile(climateSource);
	var html = bootleaf.climateTemplate();
	resetSidebar("Climate Risk Analysis", html);

	$("#sidebar").show("slow");
	switchOffTools();
	bootleaf.activeTool = "climate";
}

function afterMapLoads(){
	// This function is run after the map has loaded. It gives access to bootleaf.map, bootleaf.TOCcontrol, etc

	console.log("After map loads function");

	configureClimateRiskAnalysis();
}
