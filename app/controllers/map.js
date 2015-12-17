Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};
var zoomedName = args.name;
var zoomColor = args.color;
var zoomLat = args.zoomlat;

var menuVisible = false;

//-----------------------------------------------------------
// Onload-funktioner för kartan
//-----------------------------------------------------------
displayBigMap();

//-----------------------------------------------------------
// Visar kartan
//-----------------------------------------------------------
function displayBigMap() {
	try {
		$.mapView.add(showMap(map));
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	}
}

//-----------------------------------------------------------
// Öppnar trailDetail med info om vald vandringsled
//-----------------------------------------------------------
function showTrail(myId) {
	try {
		var jsonObjTrail = returnSpecificTrail(myId);

		var args = {
			id : jsonObjTrail[0].id,
			title : myId,
			length : jsonObjTrail[0].length,
			infoTxt : jsonObjTrail[0].infoTxt,
			area : jsonObjTrail[0].area,
			color : jsonObjTrail[0].color,
			zoomlat : jsonObjTrail[0].zoomLat,
			zoomlon : jsonObjTrail[0].zoomLon
		};

		var trailDetail = Alloy.createController("trailDetail", args).getView();
		Alloy.CFG.tabs.activeTab.open(trailDetail);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Kartan");
	}
}

//-----------------------------------------------------------
// Öppnar hotspotDetail med info om vald hotspot
//-----------------------------------------------------------
function showHotspotDet(hotId) {		
	try {
		var jsonObjHot = returnSpecificHotspotsByName(hotId);

		var hotspotTxt = {
			title : jsonObjHot[0].name,
			infoTxt : jsonObjHot[0].infoTxt,
			id : jsonObjHot[0].id
		};

		var hotDet = Alloy.createController("hotspotDetail", hotspotTxt).getView();
		$.infoNav.openWindow(hotDet);
		
		hotspotDetail = null;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!");
	}
}

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
map.addEventListener('click', function(evt){
	if (evt.clicksource == 'rightButton') {
		if (evt.annotation.name == 'hotspot') {
			showHotspotDet(evt.annotation.id);
		} else if (evt.annotation.name == 'trail') {
			showTrail(evt.annotation.id);
		}
	}
});

//-----------------------------------------------------------
// Eventlistener för att stänga menyn vid klick på kartan
//-----------------------------------------------------------
map.addEventListener('singletap', function() {
	if(menuMapVisible){
		closeMenu();
		menuMapVisible = false; 
	}
});

// //-----------------------------------------------------------
// // Funktioner för att visa och stänga kartmenyn 
// //-----------------------------------------------------------
function openMenu(){
	$.widgetView.height = '190dp';
}
Alloy.Globals.openMenu = openMenu;

function closeMenu(){
	$.widgetView.height = '0dp';
}
Alloy.Globals.closeMenu = closeMenu;

//-----------------------------------------------------------
// Öppnar och stänger menyn på "stora kartan"
//-----------------------------------------------------------
function showMapMenu() {
	if(!menuMapVisible){
		openMenu();
		menuMapVisible = true;
	}else{
		closeMenu();
		menuMapVisible = false;
	}
}


