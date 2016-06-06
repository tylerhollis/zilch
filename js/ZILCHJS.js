// Rules:
// Played with 6 dice
// Game 10,000 points
// To open 750 points

// Points:
// 1's = 100
// 5's = 50
// Three of a kind = 100x number on dice (except three 1's = 1000)
// Six of a kind = 6000
// 1,2,3,4,5,6 (straight) = 2000
// 1,1,6,6,3,4 = 1600
// 1,2,2,3,3,3 = 6x next roll of dice
// 3,3,3,3 + 1,1 or 5,5 = 1200 + 100x face value of next roll
// Three pairs = 1200
// Two triples = 2200

// Roll 6 dice - if points are made put those dice aside and roll remaining dice - if more points are made put those dice aside and roll remaining dice - continue until you roll no points in which case you ZILCH and lose your points for that turn OR you roll points on all six dice in which case you may re-roll all six dice. You may "Stay" to add your points to your score total and end your turn at any time. Remember if a roll does not make any points you get ZILCH and your turn is over.
// You MUST SCORE 750 POINTS IN ONE TURN TO GET ON THE BOARD.
// When someone reaches 10,000 points or more everyone gets one turn to beat that person.

var playerCounter = 1;

function Player(){
	this.name = "";
	this.whichPlayerAmI = playerCounter++;
	this.score = 0;
}

var playerOne = new Player();
var playerTwo = new Player();
var currentPlayer = playerOne
var numberOfDice = 6;
var rollCount = 0;
var pipCount = [];
var isTheGameOver = false;

function nextPlayer(){
	sixTimesBonusRoll = false;
	oneHundoFaceBonusRoll = false;
	numberOfDice = 6;
	pointsCache = 0;
	$(".points span").html(pointsCache);
	rollCount = 0;
	$(".numberOfRoll span").html(rollCount);
	unhideDice();
	
	if (currentPlayer == playerOne){
		currentPlayer = playerTwo;
		// add activePlayer class to playerTwo
		$("#playerTwo").addClass("activePlayer");
		// remove activePlayer class from playerOne
		$("#playerOne").removeClass("activePlayer");
	}
	else if (currentPlayer == playerTwo){
		currentPlayer = playerOne;
		// add activePlayer class to playerOne
		$("#playerOne").addClass("activePlayer");
		// remove activePlayer class from playerTwo
		$("#playerTwo").removeClass("activePlayer");
	}
	$("#playerTwo span").html(playerTwo.score);
	$("#playerOne span").html(playerOne.score);
	console.log("playerOne: " + playerOne.score);
	console.log("playerTwo: " + playerTwo.score);
	console.log("it is player number " + currentPlayer.whichPlayerAmI + "'s turn");
}

// rollDice based on numberOfDice
function rollDice() {
	for (var i =0; i < numberOfDice; i++){
		var dieNum = Math.floor(Math.random() * 6) + 1;
		var currentDie = i + 1;
		var element = $("die-"+currentDie);
		if (!element.hasClass("lock")){
			pipCount.push(dieNum);
		}
	}
	rollCount += 1;
	$(".numberOfRoll span").html(rollCount);
};

// these should all equal 0
var currentRolls = new Object();
	currentRolls[1] = 0;
	currentRolls[2] = 0;
	currentRolls[3] = 0;
	currentRolls[4] = 0;
	currentRolls[5] = 0;
	currentRolls[6] = 0;


function getPips(){
// puts array in numeric order
	// pipCount.sort(function(a, b){return a-b});
	
	// THIS IS FOR TESTING ONLY 
	// Comment out the test array for live gameplay
// if (sixTimesBonusRoll == false){
// 	pipCount = [1,2,2,3,3,3];
// }
	// pipCount = [1,2,3,3,3,3];

	console.log(pipCount);

	var lockedDice = []

	$(".die").not(".lock").each(function() {
		lockedDice.push($(this));
	})
	console.log(lockedDice);

	for(i = 0; i < pipCount.length; i++) {
		$(lockedDice[i]).html(pipCount[i]);

		// To test rule fullfilment, comment out line below, comment out diceReset() for roll() button, and hard code dice combo into currentRolls object above. 
		currentRolls[pipCount[i]] += 1;

		// following line to check pipCount against currentRolls:
		// console.log(currentRolls[i+1],pipCount[i]);
	}	
};

var pointsCache = 0;
var sixTimesBonusRoll = false;
var oneHundoFaceBonusRoll = false;
var finalRound = false;
var finalScoreToBeat = 0;
var diceToLock = 0;

function getPoints(){
	var finished = false;
	var potentialPoints = 0;
	var bonusPoints = 0;
	var diceOutOfPlay = 0;
	console.log("numberOfDice at start of getPoints " + numberOfDice);

// is this the 100x face value bonus roll?
	if (oneHundoFaceBonusRoll == true){
			var faceValue = 0;
			$.each(pipCount,function() {
 				faceValue += this;
			});
			potentialPoints += (faceValue * 100);
			// $(".points span").html(pointsCache);
			hideAllDice();
			alert("Bonus " + potentialPoints + " points!")
			unhideDice();
			finished = true;
			oneHundoFaceBonusRoll = false;
	}
	
// one two three score ... (sixTimesBonusRoll)
	if (finished == false){	
 		if (currentRolls[1] == 1
			&& currentRolls[2] == 2
			&& currentRolls[3] == 3){
 				hideAllDice();
				alert("You rolled One 1, Two 2's and Three 3's! Roll all six dice and multiply those points by six. Don't ZILCH!")
				unhideDice();
				finished = true;
				sixTimesBonusRoll = true;
		} 
	}	
// multiplier ... (oneHundoFaceBonusRoll)
	if (finished == false) {
		if ((currentRolls[3] == 4 
			&& currentRolls[1] == 2)
			|| (currentRolls[3] ==4
			&& currentRolls[5] == 2)){
				potentialPoints = 1200;
				hideAllDice();
				alert("Donna says so! You get 1200 points PLUS 100x the FACE VALUE of your next roll.")
				unhideDice();
				finished = true;
				oneHundoFaceBonusRoll = true;
			}
	}
// six of a kind
	 if (finished == false) {
	 	for (i = 1; i < 7; i++){
	 		if (currentRolls[i] == 6 ){
	 			if (sixTimesBonusRoll == false){
	 				potentialPoints = 6000;
	 			}else if (sixTimesBonusRoll == true){
	 				bonusPoints = 6000;
	 			}
	 			hideAllDice();
	 			alert("Six of a kind! 6000 points!")
	 			unhideDice();
	 			finished = true;
	 		}
	 	}
	 }
// double triples
	if (finished == false) {
		var triples = 0;
		for (i = 1; i < 7; i++){
			if (currentRolls[i] == 3 ){
				triples +=1;
			}
		}
		if (triples == 2){
	 		if (sixTimesBonusRoll == false){
	 			potentialPoints=2200;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints = 2200;
	 			}
	 		hideAllDice();	
			alert("Double triples! 2200 points!");
			unhideDice();
			finished = true;
		}
	}
// straight
	if (finished == false) {
		if (currentRolls[1] == 1
			&& currentRolls[2] == 1
			&& currentRolls[3] == 1
			&& currentRolls[4] == 1
			&& currentRolls[5] == 1
			&& currentRolls[6] == 1){
			if (sixTimesBonusRoll == false){
	 			potentialPoints=2000;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints = 2000;
	 			}
	 		hideAllDice();	
			alert("You rolled a Straight! 2000 points!")
			unhideDice();
			finished = true;
		}
	}
// Donna sez
	if (finished == false) {
		if (currentRolls[1] == 2
			&& currentRolls[3] == 1
			&& currentRolls[4] == 1
			&& currentRolls[6] == 2){
			if (sixTimesBonusRoll == false){
	 			potentialPoints=1600;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints = 1600;
	 			}
	 		hideAllDice();	
			alert("That roll was worth 1600 points. Donna says so!");
			unhideDice();
			finished = true;
		}
	}

// three pairs score
	if (finished == false) {
		var pairs = 0;
		for (i = 1; i < 7; i++){
			if (currentRolls[i] == 2 ){
				pairs +=1;
			}
			if (currentRolls[i] == 4 ){
				pairs +=2;
			}
		}
		if (pairs == 3){
			if (sixTimesBonusRoll == false){
	 			potentialPoints=1200;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints = 1200;
	 			}
	 		hideAllDice();	
			alert("Three pairs! 1200 points!");
			unhideDice();
			finished = true;
		}
	}
// three of a kind score (ones and fives excluded)
	if (finished == false) {
		if (currentRolls[2] >= 3){
			if (sixTimesBonusRoll == false){
	 			potentialPoints=200;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints = 200;
	 			}
	 		hideDiceTriple(2);	
			alert("Triple 2's for 200 points")
			diceToLock = 3;
			for (i = 1; i < diceToLock; i++){	
			}
			diceOutOfPlay += 3;
		}
		if (currentRolls[3] >= 3){
			if (sixTimesBonusRoll == false){
	 			potentialPoints=300;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints = 300;
	 			}
	 		hideDiceTriple(3);	
			alert("Triple 3's for 300 points")
			diceOutOfPlay += 3;
		}
		if (currentRolls[4] >= 3){
			if (sixTimesBonusRoll == false){
	 			potentialPoints=400;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints = 400;
	 			}
	 		hideDiceTriple(4);	
			alert("Triple 4's for 400 points")
			diceOutOfPlay += 3;
		}
		if (currentRolls[6] >= 3){
			if (sixTimesBonusRoll == false){
	 			potentialPoints=600;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints = 600;
	 			}
	 		hideDiceTriple(6);	
			alert("Triple 6's for 600 points")
			diceOutOfPlay += 3;
		}		
	}

//  ones and fives score
	if (finished == false) {
		singlePips = currentRolls[1];
		stragglerSingles = 0;
		fivePips = currentRolls[5];
		stragglerFives = 0;
		diceOutOfPlay += (singlePips + fivePips);

		if (singlePips < 3 ) {
			if (sixTimesBonusRoll == false){
	 			potentialPoints += singlePips * 100;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints += singlePips * 100;
	 			}
			hideDice(1);
		} else {
			stragglerSingles = singlePips - 3;
			if (sixTimesBonusRoll == false){
	 			potentialPoints += stragglerSingles * 100;
				potentialPoints += 1000;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints += stragglerSingles * 100;
				bonusPoints += 1000;
	 			}
			hideDice(1);
			alert("Triple 1's for 1000 points")
		}

		if (fivePips < 3 ) {
			if (sixTimesBonusRoll == false){
	 			potentialPoints += fivePips * 50;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints += fivePips * 50;
	 			}
			hideDice(5);
		} else {
			stragglerFives = fivePips - 3;
			if (sixTimesBonusRoll == false){
	 			potentialPoints += stragglerFives * 50;
				potentialPoints += 500;
	 		}else if (sixTimesBonusRoll == true){
	 			bonusPoints += stragglerFives * 50;
				bonusPoints += 500;
	 			}
			hideDice(5);
			alert("Triple 5's for 500 points")
		}

		console.log("points to be added to cache" + potentialPoints);
		console.log("dice out of play" + diceOutOfPlay);
	}
	if (bonusPoints > 0){
		alert("You rolled " + bonusPoints + " points x6 for " + (bonusPoints * 6) + " points!");
		potentialPoints += (bonusPoints * 6);
		sixTimesBonusRoll = false;

	}

	if (sixTimesBonusRoll == true){
		// do nothing (player rolls again for bonus points)
	} else if (sixTimesBonusRoll == false
		&& potentialPoints > 0){
			pointsCache+=potentialPoints;
			$(".points span").html(pointsCache);
			console.log("points " + pointsCache);
	} else {
		if (finalRound == false){
		alert("ZILCH!");
		console.log("zilch");
		pointsCache = 0;
		$(".points span").html(pointsCache);
		rollCount = 0;
		$(".numberOfRoll span").html(rollCount);
		forceTurnEnd();
		} else if (finalRound == true) {
		alert("ZILCH! You lose.");
		console.log("zilch");
		pointsCache = 0;
		$(".points span").html(pointsCache);
		rollCount = 0;
		$(".numberOfRoll span").html(rollCount);
		gameOver();
		}	
	}

	// change number of dice next throw
	numberOfDice -= diceOutOfPlay;
	if (numberOfDice == 0) {
		numberOfDice += 6;
		unhideDice();
	}
	console.log("number of dice next throw" + numberOfDice);
};

var hideCount = 0;
function hideDiceTriple(value){
	for (var i =0; i < $(".dice .die").length; i++){
		$(".die").each(function(i){
			if ($(this).text() == value
				&& hideCount < 3
			){
				$(this).addClass("lock");
				hideCount += 1;
			} else if (hideCount >=3){
				// do nothing
			}
		})
	}
	hideCount = 0;	
};

function hideDice(value){
	$(".die").each(function(i){
		if ($(this).text() == value){
			$(this).addClass("lock")
		}
	})
};

function unhideDice(){
	$(".die").each(function(i){
		if ($(this).hasClass("lock")) {
			$(this).removeClass("lock")
		}
	})
};

function hideAllDice(){
	$(".die").each(function(i){
			$(this).addClass("lock")
	})
};


function forceTurnEnd(){
	nextPlayer();
};

function stay(){
	if (finalRound == false){
		if (currentPlayer.score+pointsCache >= 10000){
		// change to >= 10000
			alert("Your score has reached 10000! The other player gets one turn to beat your score without throwing a ZILCH.");
			// alert("Your score has reached 10000! Now every player gets one turn to try and beat your score.");
			finalRound = true;
			finalScoreToBeat = currentPlayer.score+pointsCache;
		}	
		if (pointsCache >= 750 
			|| currentPlayer.score >= 750){
			currentPlayer.score += pointsCache;
			nextPlayer();
		} else {
			alert("You need at least 750 points to first get on the score board. Keep rolling!");
		}
	} else if (finalRound == true){
		if (pointsCache + currentPlayer.score  >= finalScoreToBeat){
			currentPlayer.score += pointsCache;
			finalScoreToBeat = currentPlayer.score;
			alert("You are the winner!");
			// alert("You are the new leader!")
			gameOver();
		} else {
			alert("You need to beat the high score of " + finalScoreToBeat + " to win. Keep rolling! Don't ZILCH!")
		}
	}		
};



function diceReset(){
	pipCount = [];
	currentRolls[1] = 0;
	currentRolls[2] = 0;
	currentRolls[3] = 0;
	currentRolls[4] = 0;
	currentRolls[5] = 0;
	currentRolls[6] = 0;
};

function gameOver(){
	isTheGameOver = true;
	numberOfDice = 6;
	pointsCache = 0;
	$("#playerTwo span").html(playerTwo.score);
	$("#playerOne span").html(playerOne.score);
	$(".points span").html(pointsCache);
	rollCount = 0;
	$(".numberOfRoll span").html(rollCount);
	unhideDice();
	$("#playerOne").removeClass("activePlayer");
	$("#playerTwo").removeClass("activePlayer");
	if (playerOne.score > playerTwo.score){
		$("#playerOne").addClass("activePlayer");
		alert("Player One is the winner!");
	} else if (playerOne.score < playerTwo.score){
		$("#playerTwo").addClass("activePlayer");
		alert("Player Two is the winner!");
	}

};

$(".roll").on("click", function(e) {
	e.preventDefault();
	if (isTheGameOver == false){
		diceReset();
		rollDice();
		getPips();
		getPoints();
		console.log(currentRolls);	
	} else {
		// do nothing
	}
	
});

$(".stay").on("click", function(e) {
	e.preventDefault();
	if (isTheGameOver == false){
		if (sixTimesBonusRoll == true){
			alert("Don't quit now! Roll for bonus points (and don't ZILCH!)");
		} else if (oneHundoFaceBonusRoll == true){
			alert("Don't quit now! Roll for bonus points.");
		} 
		else if (pointsCache == 0){
			alert("Don't be afraid. Roll the dice!");
		}
		else {
			stay();	
		}
	} else {
		// do nothing
	}		
});

