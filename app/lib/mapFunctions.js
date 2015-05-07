var trailsCollection = getTrailsCollection();
trailsCollection.fetch();
var trailJson = trailsCollection.toJSON();

var hotspotCollection = getHotspotCollection();
var letterCollection = getLetterCollection();
letterCollection.fetch();
var jsonCollection = letterCollection.toJSON();
Alloy.Globals.jsonCollection = jsonCollection;

var hotspotsNotVisible = true;
var radius = 20;
var nextId = 1;
var infospotArray = [];
var markerHotspotArray = [];
var menuVisible = false;
var mapMenuVisible = false;

//-----------------------------------------------------------
// Läser in kartvyn
//-----------------------------------------------------------
function showMap(maptype) {
	try {
		setRoutes(maptype);
		setRegion(maptype);
		displayTrailMarkers(maptype);
		return map;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - showMap");
	}
}

//-----------------------------------------
// Zoomar in kartan på en Detaljkarta
//-----------------------------------------
function showDetailMap(maptype, id, name, color) {
	try {
		setSpecificRoute(maptype, id, name, color);
		return maptype;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - showMap");
	}
}

//-----------------------------------------------------------
// sätter en vald vandingsled
//-----------------------------------------------------------
function setSpecificRoute(maptype, id, name, color) {
	try {
		if (id != 8) {
			var file = getFile(id);

			for (var u = 0; u < file.length; u++) {
				createMapRoutes(maptype, file[u].filename, name, color);
			}
		} else {
			maptype.region = {
				latitude : 58.907482,
				longitude : 11.104129,
				latitudeDelta : 0.1,
				longitudeDelta : 0.1
			};
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - setRoute");
	}
}

//-----------------------------------------------------------
// Beräknar nivån av inzoomning på en vald led
//-----------------------------------------------------------
function calculateMapRegion(trailCoordinates) {
	try {
		if (trailCoordinates.length != 0) {
			var poiCenter = {};
			var delta = 0.02;
			var minLat = trailCoordinates[0].latitude,
			    maxLat = trailCoordinates[0].latitude,
			    minLon = trailCoordinates[0].longitude,
			    maxLon = trailCoordinates[0].longitude;
			for (var i = 0; i < trailCoordinates.length - 1; i++) {
				minLat = Math.min(trailCoordinates[i + 1].latitude, minLat);
				maxLat = Math.max(trailCoordinates[i + 1].latitude, maxLat);
				minLon = Math.min(trailCoordinates[i + 1].longitude, minLon);
				maxLon = Math.max(trailCoordinates[i + 1].longitude, maxLon);
			}

			var deltaLat = maxLat - minLat;
			var deltaLon = maxLon - minLon;

			delta = Math.max(deltaLat, deltaLon);
			// Ändra om det ska vara mer zoomat
			delta = delta * 1.2;

			poiCenter.lat = maxLat - parseFloat((maxLat - minLat) / 2);
			poiCenter.lon = maxLon - parseFloat((maxLon - minLon) / 2);

			region = {
				latitude : poiCenter.lat,
				longitude : poiCenter.lon,
				latitudeDelta : delta,
				longitudeDelta : delta
			};
		}
		return region;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - calculateMapRegion");
	}
}

//-----------------------------------------------------------
// skapar vandringsleden och sätter den på kartan
//-----------------------------------------------------------
function createMapRoutes(maptype, file, name, color) {
	// try {
	var zoomedRoute = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "/routes/" + file).read().text;
	var parsedRoute = JSON.parse(zoomedRoute);

	var geoArray = [];
	geoArray.push(parsedRoute);

	var coordArray = [];

	for (var u = 0; u < geoArray.length; u++) {
		var coords = geoArray[0].features[0].geometry.paths[u];

		for (var i = 0; i < coords.length; i++) {

			var point = {
				latitude : coords[i][1],
				longitude : coords[i][0]
			};
			coordArray.push(point);
		}
		var route = {
			name : name,
			points : coordArray,
			width : 2.0,
			color : color
		};
		maptype.addRoute(MapModule.createRoute(route));
	}
	maptype.region = calculateMapRegion(coordArray);
	// } catch(e) {
	// newError("Något gick fel när sidan skulle laddas, prova igen!", "Map - createMapRoute");
	// }
}
//-----------------------------------------------------------
// Sätter ut alla vandringsleder på kartan
//-----------------------------------------------------------
function setRoutes(maptype) {
	try{	
		for(i = 0; i<trailJson.length; i++){
			setSpecificRoute(maptype, trailJson[i].id, trailJson[i].name, trailJson[i].color);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "infoList - getInfoDetails");
	}
}

//-----------------------------------------------------------
// Visar markers för vandringslederna
//-----------------------------------------------------------
function displayTrailMarkers(maptype) {
	try {
		for (var i = 0; i < trailJson.length; i++) {
			var markerAnnotation = MapModule.createAnnotation({
				id : trailJson[i].name,
				latitude : trailJson[i].pinLat,
				longitude : trailJson[i].pinLon,
				title : trailJson[i].name,
				subtitle : trailJson[i].area + ', ' + trailJson[i].length + ' km',
				rightButton : '/pins/arrow.png',
				image : '/images/pin-' + trailJson[i].pincolor + '.png',
				centerOffset : {
					x : 0,
					y : -25
				},
				name : 'trail',
				font : {
					fontStyle : 'Raleway-Light'
				}
			});

			maptype.addAnnotation(markerAnnotation);
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayTrailMarkers");
	}
}

//-----------------------------------------------------------
// Hämtar JSON-filen för den valda vandringsleden
//-----------------------------------------------------------
function getFile(id) {
	try {
		var jsonFileCollection = Alloy.Collections.jsonFilesModel;
		jsonFileCollection.fetch({
			query : 'SELECT filename FROM jsonFilesModel WHERE trailID ="' + id + '"'
		});

		var filename = jsonFileCollection.toJSON();
		return filename;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "MapDetail - getFile");
	}
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspot(myId) {
	try {
		hotspotCollection.fetch({
			query : 'SELECT id, infoTxt FROM hotspotModel where name = "' + myId + '"'
		});

		var jsonObjHot = hotspotCollection.toJSON();

		var hotspotTxt = {
			title : myId,
			infoTxt : jsonObjHot[0].infoTxt,
			id : jsonObjHot[0].id
		};

		var hotspotDetail = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		Alloy.CFG.tabs.activeTab.open(hotspotDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - showHotspot");
	}
}

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displayAllMarkers() {
	try {
		hotspotCollection.fetch();

		var markersJSON = hotspotCollection.toJSON();
		for (var u = 0; u < markersJSON.length; u++) {

			var markerHotspot = MapModule.createAnnotation({
				id : markersJSON[u].name,
				latitude : markersJSON[u].xkoord,
				longitude : markersJSON[u].ykoord,
				title : markersJSON[u].name,
				subtitle : 'Läs mer om ' + markersJSON[u].name + ' här!',
				image : '/images/hot-icon-azure.png',
				centerOffset : {
					x : -3,
					y : -16
				},
				rightButton : '/images/arrow.png',
				name : 'hotspot'
			});

			markerHotspotArray.push(markerHotspot);
		}

		map.addAnnotations(markerHotspotArray);
		return markerHotspotArray;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayMarkers");
	}
}

function setRegion(maptype){
	maptype.region = {
		latitude : 58.887396,
		longitude : 11.024908,
		latitudeDelta : 0.08,
		longitudeDelta : 0.08
	}; 
	maptype.animate = true;
	maptype.userLocation = false;
}

//-----------------------------------------------------------
// Visar ikoner för alla informationsobjekt
//-----------------------------------------------------------
function displayInfoSpots(type) {

	try {
		var markerArray = [];
		var infospotCollection = getInfoSpotCoordinatesCollection();
		infospotCollection.fetch({
			query : 'SELECT name, latitude, longitude FROM infospotCoordinatesModel WHERE name ="' + type + '"'
		});

		var infospotJSON = infospotCollection.toJSON();

		for (var i = 0; i < infospotJSON.length; i++) {
			var infoMarker = MapModule.createAnnotation({
				latitude : infospotJSON[i].latitude,
				longitude : infospotJSON[i].longitude,
				image : '/images/map_' + infospotJSON[i].name + '.png',
				name : infospotJSON[i].name
			});

			markerArray.push(infoMarker);
			infospotArray.push(infoMarker);
		}

		return markerArray;

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayInfoSpots");
	}
}

//-----------------------------------------------------------
// Visar markers för hotspots
//-----------------------------------------------------------
function displaySpecificMarkers(id, maptype) {
	try {
		var hotspotTrailCollection = Alloy.Collections.hotspotModel;
		hotspotTrailCollection.fetch({
			query : 'SELECT hotspotModel.name, hotspotModel.xkoord, hotspotModel.ykoord from hotspotModel join hotspot_trailsModel on hotspotModel.id = hotspot_trailsModel.hotspotID where trailsID ="' + id + '"'
		});

		var specificHotspots = hotspotTrailCollection.toJSON();
		var markerHotspotArray = [];

		for (var u = 0; u < specificHotspots.length; u++) {

			var markerSpecificHotspot = MapModule.createAnnotation({
				id : specificHotspots[u].name,
				latitude : specificHotspots[u].xkoord,
				longitude : specificHotspots[u].ykoord,
				title : specificHotspots[u].name,
				subtitle : 'Läs mer om ' + specificHotspots[u].name + ' här!',
				image : '/images/hot-icon-azure.png',
				rightButton : '/images/arrow.png',
				name : 'hotspot'
			});

			markerHotspotArray.push(markerSpecificHotspot);
		}

		maptype.addAnnotations(markerHotspotArray);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "map - displayMarkers");
	}
}

//-----------------------------------------------------------
// Hämtar ikoner till vald vandringsled
//-----------------------------------------------------------
function getSpecificIconsForTrail(id) {
	// try {
		var specificMarkerArray = [];

		var specificinfotrailCollection = Alloy.Collections.infospotCoordinatesModel;
		specificinfotrailCollection.fetch({
			query : 'SELECT name, latitude, longitude from infospotCoordinatesModel join infospot_trailsModel on infospot_trailsModel.infospotID = infospotCoordinatesModel.infospotID where trailsID ="' + id + '"'
		});

		var infospotsTrails = specificinfotrailCollection.toJSON();
		for (var i = 0; i < infospotsTrails.length; i++) {
			var specificinfoMarker = MapModule.createAnnotation({
				latitude : infospotsTrails[i].latitude,
				longitude : infospotsTrails[i].longitude,
				image : '/images/map_' + infospotsTrails[i].name + '.png',
				name : 'infospot'
			});

			specificMarkerArray.push(specificinfoMarker);
		}

		detailMap.addAnnotations(specificMarkerArray);

	// } catch(e) {
		// newError("Något gick fel när sidan skulle laddas, prova igen!", "mapDetail - getIcons");
	// }
}

function removeAnnoSpot(anno, infotype) {
	for (var o = 0; o < infospotArray.length; o++) {
		var type = infospotArray[o].name;
		if (anno == 'info' && infotype == type) {
			map.removeAnnotation(infospotArray[o]);
		}
	}
}

function removeAnnoHotspot() {
	for (var o = 0; o < markerHotspotArray.length; o++) {
		map.removeAnnotation(markerHotspotArray[o]);
	}
}

function addClueZone() {

	for (var c = 0; c < Alloy.Globals.jsonCollection.length; c++) {
		var markerAnnotation = MapModule.createAnnotation({
			latitude : Alloy.Globals.jsonCollection[c].latitude,
			longitude : Alloy.Globals.jsonCollection[c].longitude,
			title : Alloy.Globals.jsonCollection[c].id,
			subtitle : Alloy.Globals.jsonCollection[c].letter
		});

		if (Alloy.Globals.jsonCollection[c].found == 0) {
			markerAnnotation.image = '/images/red.png';
		} else {
			markerAnnotation.image = '/images/green.png';
		}

		interactiveMap.addAnnotation(markerAnnotation);
	}
}