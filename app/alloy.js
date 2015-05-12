// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

//-----------------------------------------------------------
// Globala variabler för geofencing.
//-----------------------------------------------------------
var gLat = 0;
var gLon = 0;
var foundId = 1;
var nextId = 1;
var notify = true;
var myPosition = false;

//-----------------------------------------------------------
// Array som håller bokstäverna från bokstavsjakten.
//-----------------------------------------------------------
var lettersArray = [];
var globalTrailID = 0;
var word = 'SAM';

var interactiveVisible = false;

var farjelage = false;
var snorkel = false;
var torrdass = false;
var utsiktsplats = false;
var rastplats = false;
var taltplats = false;
var badplats = false;
var information = false;
var eldplats = false;

//-----------------------------------------------------------
// Variabel för kartvyn
//-----------------------------------------------------------

var MapModule = require('ti.map');
map = MapModule.createView({
	mapType : MapModule.HYBRID_TYPE,
	animate : true,
	height : '100%',
	width : Ti.UI.FILL
});
detailMap = MapModule.createView({
	mapType : MapModule.HYBRID_TYPE,
	animate : true,
	height : '100%',
	width : Ti.UI.FILL
});
interactiveMap = MapModule.createView({
	mapType : MapModule.HYBRID_TYPE,
	animate : true,
	height : '100%',
	width : Ti.UI.FILL,
	userLocation : true
});

//-----------------------------------------------------------
// Metoder för alla collections
//-----------------------------------------------------------

function getHotspotCollection() {
	var hotspotCollection = Alloy.Collections.hotspotModel;
	return hotspotCollection;
}

function getMediaCollection() {
	var mediaCollection = Alloy.Collections.mediaModel;
	return mediaCollection;
}

function getTrailsCollection() {
	var trailCollection = Alloy.Collections.trailsModel;
	return trailCollection;
}

function getInfoCollection() {
	var infoCollection = Alloy.Collections.infoModel;
	return infoCollection;
}

function getJSONfiles() {
	var jsonFileCollection = Alloy.Collections.jsonFilesModel;
	return jsonFileCollection;
}

function getLetterCollection() {
	var letterCollection = Alloy.Collections.letterModel;
	return letterCollection;
}

function getInfoSpotCoordinatesCollection() {
	var infospotCollection = Alloy.Collections.infospotCoordinatesModel;
	return infospotCollection;
}

//-----------------------------------------------------------
// Felhantering
//-----------------------------------------------------------
function newError(errorMsg, pageName) {
	try {
		var er = new Error(errorMsg);
		er.myObject = pageName;
		throw er;
	} catch (e) {

		alert("Error:[" + e.message + "] has occured on " + e.myObject + " page.");
	}
}
