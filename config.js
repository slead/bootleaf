var config = {
	// Climate Risk Analysis parameters
  lgaSourceUrl: "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/LGA_2019_AUST_wgs84/FeatureServer/0/",
  lgaNameField: "LGA_NAME19",
  pythonUrl: "http://climaterisk.ewn.com.au:5000/risk?",

	"requireArcGISLogin": false, // Does the user need to log in to ArcGIS Online or ArcGIS Server?
	"tokenUrl": 'https://www.arcgis.com/sharing/generateToken', // ArcGIS token generation URL

	"title": "EWN Climate Risk Analyser",
	"start": {
		// "maxZoom": 16,
		"center": [ -28.69, 133.22],
		"zoom": 5,
		"attributionControl": true,
		"zoomControl": false
	},
	"about": {
		"title": "Bootleaf application template",
		"contents": "<p>This is an open-source version of the excellent <a href='https://github.com/bmcbride/bootleaf'>Bootleaf map </a>started by Bryan McBride.</p><p>It's designed for rapid web map development. See <a href='https://github.com/iag-geo/bootleaf'>https://github.com/iag-geo/bootleaf</a> for more information.</p><p>Chage this message in the config file</p>"
	},
	"controls": {
		"zoom": {
			"position": "topleft"
		},
		"leafletGeocoder": {
			//https://github.com/perliedman/leaflet-control-geocoder
			"collapsed": false,
			"position": "topleft",
			"placeholder": "Search for a location",
			"type": "OpenStreetMap", // OpenStreetMap, Google, ArcGIS
			//"suffix": "Australia", // optional keyword to append to every search
			//"key": "AIzaS....sbW_E", // when using the Google geocoder, include your Google Maps API key (https://developers.google.com/maps/documentation/geocoding/start#get-a-key)
		},
		"TOC": {
			//https://leafletjs.com/reference-1.0.2.html#control-layers-option
			"collapsed": false,
			"uncategorisedLabel": "Layers",
			"position": "topright",
			"toggleAll": true
		},
		"history": {
			"position": "bottomleft"
		},
		"bookmarks": {
			"position": "bottomright",
			"places": [
				{
				"latlng": [
					40.7916, -73.9924
				],
				"zoom": 12,
				"name": "Manhattan",
				"id": "a148fa354ba3",
				"editable": true,
				"removable": true
				}
			]
		}
	},

	// "activeTool": "identify", // options are identify/coordinates/queryWidget
	"basemaps": ['esriGray', 'esriDarkGray', 'esriStreets', 'OpenStreetMap', "Aerial"],

	// "defaultIcon": {
	// 	"imagePath": "https://leafletjs.com/examples/custom-icons/",
	// 	"iconUrl": "leaf-green.png",
	// 	"shadowUrl": "leaf-shadow.png",
	// 	"iconSize":     [38, 95],
	// 		"shadowSize":   [50, 64],
	// 		"iconAnchor":   [22, 94],
	// 		"shadowAnchor": [4, 62],
	// 		"popupAnchor":  [-3, -76]
	// },
	"tocCategories": [
		{
			"name": "ArcGIS Layers",
			"layers" : ["historic"]
		}
	],
	"projections": [
		{4269: '+proj=longlat +ellps=GRS80 +datum=NAD83 +no_defs '}
	],
	"highlightStyle": {
		"weight": 2,
		"opacity": 1,
		"color": 'white',
		"dashArray": '3',
		"fillOpacity": 0.5,
		"fillColor": '#E31A1C',
		"stroke": true
	},
	"layers": [
		{
			"id": "Historic",
			"name": "Historic weather events",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": true,
			// "minZoom": 12,
			"useCors": false,
			"popup": true,
			"fields": ["objectid","phenomenon","alertkey", "alertgroup", "alerttype"],
			"queryWidget": {
				"queries" : [
					{"name": "phenomenon"}
				],
				"outFields": [
					{"name": "phenomenon", "alias": "Phenomenon"},
					{"name": "alerttype", "alias": "Alert type"}
				],
				"maxAllowableOffset": 10
			}
		}
	]
}
