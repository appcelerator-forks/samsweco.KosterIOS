Ti.include('SQL.js');
Ti.include("collectionData.js");

var args = arguments[0] || {};

try {
	if(language == 'svenska'){
		$.lblInfoTitle1.text = args.name || "Title";
		$.lblInfoText.text = args.infoTxt;
	} else {
		$.lblInfoTitle1.text = args.nameEng || "Title";
		$.lblInfoText.text = args.infoTxtEng;
	}
	
	$.infoImg.image = "/images/" + args.img;
	var id = args.id;

} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
}

setRowData();

//-----------------------------------------------------------
// Sätter alla items i länklistan
//-----------------------------------------------------------
function setRowData() {
	try {
		var tableViewData = [];
		var urlList = returnUrlByInfoId(id);

		for (var i = 0; i < urlList.length; i++) {
			var row = Ti.UI.createTableViewRow({
				id : urlList[i].id,
				height : '60dp',
				top : '0dp',
				hasChild : true
			});

			var linkName = Ti.UI.createLabel({
				width : Ti.UI.FILL,
				left : '15dp',
				right : '15dp',
				font : {
					fontSize : '13dp',
				},
				color : '#0098C3'
			});
			
			if(language == 'svenska'){
				linkName.text = urlList[i].linkname;
			} else {
				linkName.text = urlList[i].linkname_eng;
			}

			row.add(linkName);
			tableViewData.push(row);
		}

		if (tableViewData.length > 0) {
			$.tableView.data = tableViewData;
			$.lblLink.show();
		}
		else {
			$.lblLink.hide();
			$.tableView.height = 0;
		}

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

//-----------------------------------------------------------
// Hämtar all info som ska läsas in i listan
//-----------------------------------------------------------
function getLink(e) {
	try {
		var rowId = e.rowData.id;
		
		var urlById = returnUrlById(rowId);
		
		var txt;
		var titl; 
		
		if(language == 'svenska'){
			txt = urlById[0].url;
			titl = urlById[0].linkname;
		} else {
			txt = urlById[0].url_eng;
			titl = urlById[0].linkname_eng;
		}
		
		if(rowId != 3 && rowId != 4){			
			openLink(txt); 
		} else if(rowId == 3 || rowId == 4){			
			showRules(txt, titl);
		} 	
			
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

//-----------------------------------------------------------
// Öppnar url'en i en webView.
//-----------------------------------------------------------
function openLink(link) {
	try {
		var webview = Titanium.UI.createWebView({
			url : link
		});
		var window = Titanium.UI.createWindow();

		var btnUrlBack = Ti.UI.createButton({
			image: '/images/backarrow.png'
		});
		btnUrlBack.addEventListener('click', function(e) {
        	window.close();
    	});
    	
    	window.leftNavButton = btnUrlBack;

		window.add(webview);
		$.navInfoDetail.openWindow(window);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

//-----------------------------------------------------------
// Öppnar regler i en egen vy
//-----------------------------------------------------------
function showRules(infTxt, linktitle){
	try {
		var infoWindowRules = Ti.UI.createWindow({
			layout : 'vertical',
			top : '0dp',
			backgroundColor : 'white'
		});
		
		var btnBack = Ti.UI.createButton({
			image: '/images/backarrow.png'
		});
		btnBack.addEventListener('click', function(e) {
        	infoWindowRules.close();
    	});
    	infoWindowRules.leftNavButton = btnBack;

		var infoScrollRules = Ti.UI.createScrollView({
			showVerticalScrollIndicator : true,
			showHorizontalScrollIndicator : true,
			layout : 'vertical',
			top : '0dp'
		});

		var viewen = Ti.UI.createView({
			layout : 'vertical',
			top : '0dp',
			height : Ti.UI.SIZE
		});

		var infoDetailTitleLbl = Ti.UI.createLabel({
			top : '10dp',
			left : '15dp',
			right : '15dp',
			font : {
				fontSize : '15dp',
				fontFamily : 'Raleway-Medium'
			},
			color : '#FCAF17',
			text : linktitle
		});

		var infoDetailLbl = Ti.UI.createLabel({
			top : '10dp',
			left : '15dp',
			right : '15dp',
			font : {
				fontSize : '14dp',
				fontFamily : 'Raleway-Light'
			},
			color : 'black',
			text : infTxt
		});

		viewen.add(infoDetailTitleLbl);
		viewen.add(infoDetailLbl);
		infoScrollRules.add(viewen);
		infoWindowRules.add(infoScrollRules);

		$.navInfoDetail.openWindow(infoWindowRules);

	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "Informationssidan");
	}
}

//-----------------------------------------------------------
// Funktioner för att stänga sidan helt när man öppnar en annan
//-----------------------------------------------------------

function closeInfoWindow(){
	$.navInfoDetail.close();
}

var cleanup = function() {
	$.destroy();
	$.off();
	$.infoDetail = null;
};

$.infoDetail.addEventListener('onclose', cleanup);

