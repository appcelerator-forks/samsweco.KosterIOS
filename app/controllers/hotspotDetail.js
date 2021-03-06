Ti.include("SQL.js");
Ti.include("collectionData.js");

var args = arguments[0] || {};

if(language == 'svenska'){
	$.lblHotspotName.text = args.title || "Name";
	$.lblHotspotInfoTxt.text = args.infoTxt || "Info";
} else {
	$.lblHotspotName.text = args.titleEng || "Name";
	$.lblHotspotInfoTxt.text = args.infoTxtEng || "Info";
}

var hotspotId = args.id || "Id";
var picId = args.filename || "filename";
var latitude = args.x;
var longitude = args.y;

selectHotspotPics();
showHotspotDetailMap();

var mapShowing = false;

//-----------------------------------------------------------
// Visar karta med sevärdheten och lederna den är kopplad till
//-----------------------------------------------------------
function showHotspotDetailMap(){	
	var detmap = showHotspotOnMap(latitude, longitude, hotspotId);
	$.showHotspotMap.add(detmap);
}

//-----------------------------------------------------------
// Hämtar bilder för bildspelet
//-----------------------------------------------------------
function selectHotspotPics() {
	try {
		var picMediaJSON = returnSpecificPics(hotspotId);

		for (var i = 0; i < picMediaJSON.length; i++) {
			var img_view = Ti.UI.createImageView({
				image : "/images/" + picMediaJSON[i].filename + ".png",
				height : '200dp',
				width : '300dp',
				top : '0dp'
				});

			var lblImgTxt = Ti.UI.createLabel({
				left : '3dp',
				top : '0dp',
				color : 'white',
				font : {
					fontSize : '12dp',
					fontStyle : 'italic',
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					fontFamily: 'Raleway-Medium'
				}
			});
			
			if(language == 'svenska'){
				lblImgTxt.text = picMediaJSON[i].img_txt;
			} else {
				lblImgTxt.text = picMediaJSON[i].img_txt_eng;
			}

			var backgroundView = Ti.UI.createView({
				layout : 'vertical',
				backgroundColor : 'black',
				height : Ti.UI.SIZE,
				width : Ti.UI.SIZE
			});

			backgroundView.add(img_view);
			backgroundView.add(lblImgTxt);
			
			$.slideShowHotspotDetail.addView(backgroundView);
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Sevärdheter");
	}
}

//-----------------------------------------------------------
// Funktioner för att stänga sidan helt när man öppnar en annan
//-----------------------------------------------------------
function closeHotspot(){
	$.hotspotDetailNav.close();
}

