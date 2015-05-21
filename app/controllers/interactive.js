Ti.include("geoFunctions.js");
Ti.include("mapFunctions.js");

var args = arguments[0] || {};

var foundLetterId = 1;
var wrongWord = 0;
var correctLetters = "A, T, R, Ö, N, N, E, M, O";

//-----------------------------------------------------------
// Hämtar letterCollection
//-----------------------------------------------------------
try {
	var letterCollection = Alloy.Collections.letterModel;
	letterCollection.fetch();
	jsonCollection = letterCollection.toJSON();
	Alloy.Globals.jsonCollection = jsonCollection;
} catch(e) {
	newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - create letterCollection");
}

displayMap();

//-----------------------------------------------------------
// Visar kartan med de olika sevärdheterna och ledtrådsplupparna
//-----------------------------------------------------------
function displayMap() {
	try {
		$.showFamilyTrail.add(showDetailMap(interactiveMap, 7, 'Äventyrsleden', 'purple'));
		addClueZone();
		displaySpecificMarkers(7, interactiveMap);
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - displaymap");
	}
}

//-----------------------------------------------------------
// Startar bokstavsjakten, gömmer och visar rätt labels
//-----------------------------------------------------------
function startInteractive() {
	$.btnStartQuiz.hide();
	$.btnStartQuiz.height = 0;

	$.txtLetter.show();
	$.txtLetter.height = '40dp';

	$.lblLetters.show();
	$.lblLetters.height = '40dp';

	$.lblCollectedLetters.show();
	$.lblCollectedLetters.text = 'Bokstäver: ';

	$.viewNext.show();
	$.viewNext.height = '60dp';

	$.horizontalView.show();
	$.horizontalView.height = Ti.UI.SIZE;

	getUserPos('letter');
	loadClue(foundJSON.length + 1);
	interactiveGPS = true;
}

//-----------------------------------------------------------
// Laddar in nästa ledtråd om man inte hittar bokstaven
//-----------------------------------------------------------
$.nextClue.addEventListener('click', function() {
	var nextDialog = Ti.UI.createAlertDialog({
		title : 'Gå till nästa',
		message : 'Är du säker på att du inte hittar bokstaven?',
		buttonNames : ['Ja, visa nästa ledtråd', 'Stäng']
	});

	nextDialog.addEventListener('click', function(e) {
		if (e.index == 0) {
			if (lettersModel.get('found') != 1) {
				checkLetter(lettersModel.get('letter'));
				$.lblCollectedLetters.text = 'Bokstäver:  ' + foundJSON;
			}
		}
	});

	nextDialog.show();
});

//-----------------------------------------------------------
// Laddar in första ledtråden
//-----------------------------------------------------------
function loadClue(id) {
	try {
		$.lblWelcome.text = "Ledtråd " + id + ":";
		$.lblInfoText.text = jsonCollection[id - 1].clue;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - loadClue");
	}
}

//-----------------------------------------------------------
// Efter bokstaven validerats läses den upp bland de andra
// bokstäverna i en label
//-----------------------------------------------------------
function sendLetter() {
	try {
		var letter = $.txtLetter.value;
		var sendletter = letter.toUpperCase();

		checkLetter(sendletter);
		allLetters();

		$.lblCollectedLetters.text = 'Bokstäver:  ' + foundJSON;
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - sendLetter");
	}
}

//-----------------------------------------------------------
// Validerar bokstaven som skrivits in, sätter found till
// 1 i letterModel och läser upp nästa ledtråd
//-----------------------------------------------------------
function checkLetter(letterToCheck) {
	try {
		var messageDialog = Ti.UI.createAlertDialog();

		if (letterToCheck.length > 1) {
			messageDialog.message = "Man får bara skriva in en bokstav.";
			messageDialog.title = 'Ojdå, nu blev det fel';
			messageDialog.buttonNames = ['Stäng'];
			
			messageDialog.show();
		} else if (letterToCheck.length < 1) {
			messageDialog.message = "Man måste skriva in en bokstav.";
			messageDialog.title = 'Ojdå, nu blev det fel';
			messageDialog.buttonNames = ['Stäng'];
			
			messageDialog.show();
		} else {
			messageDialog.message = "Är du säker på att du vill spara bokstaven " + letterToCheck + "?";
			messageDialog.title = 'Ojdå, nu blev det fel';
			messageDialog.buttonNames = ['Ja, jag vill spara!', 'Stäng'];
			
			messageDialog.addEventListener('click', function(e) {
				if (e.index == 0) {
					$.txtLetter.value = '';
					foundLettersModel.fetch({
						'id' : foundLetterId
					});

					foundLettersModel.set({
						'letter' : letterToCheck,
						'found' : 1
					});
					foundLettersModel.save();

					foundLetterId++;
					getFound();
					loadClue(foundJSON.length + 1); 
				}
			}); 

			messageDialog.show();
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - checkLetter");
	}
}

//-----------------------------------------------------------
// Kontrollerar om man fått ihop alla bokstäver. Om man hittat / alla bokstäver göms och släcks rätt labels och textfields
//-----------------------------------------------------------
function allLetters() {
	try {
		if (word.length == foundJSON.length) {
			$.txtLetter.hide();
			$.txtLetter.height = 0;
			$.lblLetters.hide();
			$.lblLetters.height = 0;
			$.viewNext.hide();
			$.viewNext.height = 0;
			$.btnStartQuiz.height = 0;
			$.wordView.show();
			$.wordView.height = '80dp';
			

			$.lblWelcome.text = 'Skriv ordet du bildat av bokstäverna!';
			$.lblInfoText.text = 'Ledtråd: En svävande geléklump i havet.';
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - allLetters");
	}
}

//-----------------------------------------------------------
// Kontrollerar det inskickade ordet mot "facit"
//-----------------------------------------------------------
function checkWord() {
	try {
		var check = $.txtWord.value;
		var checkword = check.toUpperCase();
		var alertDialog = Ti.UI.createAlertDialog({
			buttonNames : ['Stäng']
		});

		if (checkword == word) {
			alertDialog.title = "Rätt ord!";
			alertDialog.message = "Bra jobbat! Du hittade det rätta ordet!";

			$.lblWelcome.text = "Bra jobbat!";
			$.lblWelcome.fontSize = '30dp';

			$.lblInfoText.text = "Ordet var öronmanet!";

			$.txtLetter.hide();
			$.txtLetter.height = '0dp';

			$.lblLetters.hide();
			$.lblLetters.height = '0dp';

			$.lblCollectedLetters.text = '';

			$.wordView.visible = false;
			$.wordView.height = 0;
			$.horizontalView.visible = false;
			$.horizontalView.height = 0;

			stopGame();
			startOver();
			interactiveGPS = false;
		} else if(wrongWord == 3){
			alertDialog.title = 'Fel ord';
			alertDialog.message = "Nu blev det fel. Vill du kontrollera dina bokstäver? Det här är de korrekta: " + correctLetters;
		} else {
			alertDialog.title = "Fel ord";
			alertDialog.message = "Försök igen! Du har snart klurat ut det!";
			wrongWord++;
		}
	} catch(e) {
		newError("Något gick fel när sidan skulle laddas, prova igen!", "interactive - checkWord");
	}
}

Titanium.App.addEventListener('close', function() {
	startOver();
});

//-----------------------------------------------------------
// Eventlistener för klick på trail eller hotspot
//-----------------------------------------------------------
interactiveMap.addEventListener('click', function(evt) {
	if (evt.clicksource == 'rightButton') {
		showHotspot(evt.annotation.id);
	}
}); 