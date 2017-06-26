var config = {
    apiKey: "AIzaSyAzludvFteOFkkQrYibZcuRWEpS_12WRUo",
    authDomain: "rpsgame-4c7bc.firebaseapp.com",
    databaseURL: "https://rpsgame-4c7bc.firebaseio.com",
    projectId: "rpsgame-4c7bc",
    storageBucket: "rpsgame-4c7bc.appspot.com",
    messagingSenderId: "759012371750"
 };   
firebase.initializeApp(config);
var database = firebase.database();

var p1Images =["assets/images/r1.jpg", "assets/images/p1.jpg","assets/images/s1.jpg"];
var p2Images =["assets/images/r2.jpg", "assets/images/p2.jpg","assets/images/s2.jpg"];

function renderImages (imgSource, x) {
	var newdiv = $("<div>");
	var imgs = ('<img src="' + imgSource + '" id="img'+ x + '" >' );
	newdiv.attr("value", x);
	newdiv.append(imgs);
	newdiv.addClass("choices");
	return(newdiv);
	}

var numberOfPlayers = 0;
var userChoice = 0;
var	p1Choice = 0;
var p2Choice = 0;
var p1Wins = 0;
var p2Wins = 0;
var p1Losses =0;
var p2Losses = 0;
var ties =0;

function hideChoices (x) {
	for (i=0; i < 6; i++) {
		$("#img"+i).hide();
	}	
	$("#img"+x).show()
	
}
function reset () {
	p1Choice = 0;
	p2Choice = 0;
	$("#p1wins").html(p1Wins);
	$("#p2wins").html(p2Wins);
	$("#p1looses").html(p1Losses);
	$("#p2looses").html(p2Losses);
	// show choices
}
function displayScore () {

}
// check function key: (0,3=rock), (1,4=paper), (2,5= scissords)
function check(){
	if (userChoice < 3) {
			for (i=0; i < 3; i++) {
				$("#img"+i).show();
			}
	}	else {
			for (i=3; i < 6; i++) {
			$("#img"+i).show();
			}
		}

	var p2 = (p2Choice-3);
	if(p1Choice==p2) {
		ties++;
		reset();
	}
// player one wins
	 else if (((p1Choice == 0) & (p2 == 1)) || ((p1Choice == 1) & (p2 == 2)) || ((p1Choice == 2) & (p2 == 0))
) {
	 	p1Wins++;
	 	p2Losses++;
	 	reset();
	} else if (((p1Choice == 1) & (p2 == 0)) || ((p1Choice == 2) & (p2 == 1)) || ((p1Choice == 0) & (p2 == 2))
) {
		p2Wins++;
		p1Losses++;
		reset();
	}


}

var connectionsRef = database.ref("/connections");


var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

database.ref().on("value", function(snapshot){
	numberOfPlayers = snapshot.val().players.playerCount;
	console.log(numberOfPlayers);
	p1Choice = snapshot.val().player1.p1Choice;
	p2Choice = snapshot.val().player2.p2Choice;
	var p1Check = snapshot.val().player1.p1Check;
	var p2Check = snapshot.val().player2.p2Check;
	console.log(p1Check);
	console.log(p2Check)
// if bothe players have submited responce
	if (p1Check == p2Check){
		console.log("cheking");
		console.log(userChoice);
		check();
		database.ref("/player1").set({
				p1Choice: userChoice,
				p1Check: false,
			});
		database.ref("/player2").set({
				p2Choice: userChoice,
				p2Check: false,
			});
		
		}

	 



}, function(errorCode){
	console.log("The read failed: " + errorCode.code);

});


database.ref("/players").on("value", function(snapshot){

})


$("#nameSubmit").on("click", function() {
	event.preventDefault();
 
	numberOfPlayers++;
	database.ref("/players").set({
		playerCount: numberOfPlayers
	});

	$("#chatBox").show();
	var playerName = $("#userName").val().trim();
	
	

	if (numberOfPlayers ==1) {
	
		$("#p1Data").show();	
		$("#p1Name").html(playerName);
		
		for (i = 0 ; i < p1Images.length; i++) {
			var pic = renderImages(p1Images[i], i);
			$("#p1Images").append(pic);
		}
	} else {
		$("#p2Data").show();
		$("#p2Name").html(playerName);

		for (i = 0 ; i < 3; i++) {
			var pic = renderImages(p2Images[i], (i+3));
			$("#p2Images").append(pic);
		}
		database.ref("/players").set({
				playerCount: 0
			});
	}



});









$(document).ready(function() {
	
	$(document.body).on("click",".choices", function() {
		var userChoice = $(this).attr("value");
		console.log(userChoice);
		if(userChoice < 3) {
			database.ref("/player1").set({
				p1Choice: userChoice,
				p1Check: true,
			});
		} else {
			localStorage.setItem("p2Choice",userChoice);
			database.ref("/player2").set({
				p2Choice: userChoice,
				p2Check: true,
			});
		}
		
		hideChoices(userChoice);
	});


	

	
});




// on click function for user picks that:
// 1.)logs user responce (as 0 for rock, 1 for paper, 2 for scissords)
// 2.)hides the other two images
// 3.)uploads the option chosen online to firebase
