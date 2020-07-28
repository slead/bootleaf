var config = {
	// Climate Risk Analysis parameters
  lgaSourceUrl: "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/LGA_2019_AUST_wgs84/FeatureServer/0/",
  lgaNameField: "LGA_NAME19",
  pythonUrl: "http://climaterisk.ewn.com.au:5000/risk?",

	"requireArcGISLogin": true, // Does the user need to log in to ArcGIS Online or ArcGIS Server?
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
	"basemaps": ['esriGray', 'esriImagery', 'OpenStreetMap', 'esriDarkGray', 'esriStreets'],

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
			"name": "EWN Historic Alerts",
			"layers" : [
				"historic_bushfireEmergency", "historic_bushfireWarning", "historic_bushfireWatchAct", "historic_fireWeatherWarning",
				"historic_floodWatch", "historic_severeThunderstorm", "historic_severeWeather", "historic_totalFireBan", "historic_tropicalCyclone", "historic_tsunami"
			]
		},
		{
			"name": "Actual Event Post Data",
			"layers" : [
				"events_bushfire", "events_drought", "events_earthquake", "events_flood", "events_general", "events_severeThunderstorm", "events_severeWeather",
				"events_tornado", "events_tropicalCyclone"
			]
		},
		{
			"name": "EWN Alerts",
			"layers" : [
				"alerts_bushfire", "alerts_fireWeatherWarning", "alerts_flood", "alerts_general", "alerts_severeThunderstorm", "alerts_severeWeather",
				"alerts_tropicalCyclone"
			]
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
		// Historic layers
		{
			"id": "historic_bushfireEmergency",
			"name": "Historic Alerts - Bushfire emergency",
			"where": "phenomenon = 'Bushfire Emergency'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},
		{
			"id": "historic_bushfireWarning",
			"name": "Historic Alerts - Bushfire warning",
			"where": "phenomenon = 'Bushfire Warning'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},
		{
			"id": "historic_bushfireWatchAct",
			"name": "Historic Alerts - Bushfire watch and act",
			"where": "phenomenon = 'Bushfire Watch & Act'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},
		{
			"id": "historic_fireWeatherWarning",
			"name": "Historic Alerts - Fire weather warning",
			"where": "phenomenon = 'Fire Weather Warning'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},
		{
			"id": "historic_floodWatch",
			"name": "Historic Alerts - Flood watch",
			"where": "phenomenon = 'Flood Watch'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},
		{
			"id": "historic_severeThunderstorm",
			"name": "Historic Alerts - Severe thunderstorm",
			"where": "phenomenon = 'Severe Thunderstorm'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},
		{
			"id": "historic_severeWeather",
			"name": "Historic Alerts - Severe weather",
			"where": "phenomenon = 'Severe Weather'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},
		{
			"id": "historic_totalFireBan",
			"name": "Historic Alerts - Total fire ban",
			"where": "phenomenon = 'Total Fire Ban'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},
		{
			"id": "historic_tropicalCyclone",
			"name": "Historic Alerts - Tropical cyclone",
			"where": "phenomenon = 'Tropical Cyclone'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},
		{
			"id": "historic_tsunami",
			"name": "Historic Alerts - Tsunami",
			"where": "phenomenon = 'Tsunami'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/historic/FeatureServer/1",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid","phenomenon","textforweb"],
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
		},

		// Alerts layers
		{
			"id": "alerts_bushfire",
			"name": "EWN Alerts - Bushfire",
			where: "phenomenon = 'Bushfire'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 1,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/ArcGIS/rest/services/Alerts/FeatureServer/3",
			"visible": false,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "alerts_fireWeatherWarning",
			"name": "EWN Alerts - Fire Weather Warning",
			where: "phenomenon = 'Fire Weather Warning'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/ArcGIS/rest/services/Alerts/FeatureServer/3",
			"visible": false,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "alerts_flood",
			"name": "EWN Alerts - Flood",
			where: "phenomenon = 'Flood'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/ArcGIS/rest/services/Alerts/FeatureServer/3",
			"visible": false,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "alerts_general",
			"name": "EWN Alerts - General",
			where: "phenomenon = 'General'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/ArcGIS/rest/services/Alerts/FeatureServer/3",
			"visible": false,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "alerts_severeThunderstorm",
			"name": "EWN Alerts - Severe thunderstorm",
			where: "phenomenon = 'Severe Thunderstorm'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/ArcGIS/rest/services/Alerts/FeatureServer/3",
			"visible": false,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "alerts_severeWeather",
			"name": "EWN Alerts - Severe Weather",
			where: "phenomenon = 'Severe weather'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/ArcGIS/rest/services/Alerts/FeatureServer/3",
			"visible": false,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "alerts_tropicalCyclone",
			"name": "EWN Alerts - Tropical cyclone",
			where: "phenomenon = 'Tropical Cyclone'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/ArcGIS/rest/services/Alerts/FeatureServer/3",
			"visible": false,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},

		// Events layers
		{
			"id": "events_bushfire",
			"name": "Events - Bushfire",
			"where": "phenomenon = 'Bushfire'",
			"type": "agsFeatureLayer",
			"tokenRequired": false,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/Events/FeatureServer/2",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "events_drought",
			"name": "Events - Drought",
			"where": "phenomenon = 'Drought'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/Events/FeatureServer/2",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "events_earthquake",
			"name": "Events - Earthquake",
			"where": "phenomenon = 'Earthquake'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/Events/FeatureServer/2",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "events_flood",
			"name": "Events - Flood",
			"where": "phenomenon = 'Flood'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/Events/FeatureServer/2",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "events_general",
			"name": "Events - General",
			"where": "phenomenon = 'General'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/Events/FeatureServer/2",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "events_severeThunderstorm",
			"name": "Events - Severe thunderstorm",
			"where": "phenomenon = 'Severe Thunderstorm'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/Events/FeatureServer/2",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "events_severeWeather",
			"name": "Events - Severe weather",
			"where": "phenomenon = 'Severe weather'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/Events/FeatureServer/2",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "events_tornado",
			"name": "Events - Tornado",
			"where": "phenomenon = 'Tornado'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/Events/FeatureServer/2",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
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
		},
		{
			"id": "events_tropicalCyclone",
			"name": "Events - Tropical cyclone",
			"where": "phenomenon = 'Tropical Cyclone'",
			"type": "agsFeatureLayer",
			"tokenRequired": true,
			"opacity": 0.5,
			"url": "https://services3.arcgis.com/DAOFSCQzZUm0ZtWu/arcgis/rest/services/Events/FeatureServer/2",
			"visible": false,
			// "minZoom": 12,
			"useCors": true,
			"popup": true,
			"fields": ["objectid", "phenomenon", "textforweb"],
			"queryWidget": {
				"queries" : [
					{"name": "name", "alias": "Cyclone name"},
					{"name": "category", "alias": "Category", "type": "numeric"},
					{"name": "date", "alias": "Date", "type": "date"}
				],
				"outFields": [
					{"name": "name", "alias": "Name"},
					{"name": "category", "alias": "Category"},
					{"name": "wind_gusts", "alias": "Wind gusts"},
					{"name": "date", "alias": "Date"}
				],
				"maxAllowableOffset": 10
			}
		}
	]
}



