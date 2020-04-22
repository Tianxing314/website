"use strict"
const whiteWin = [[3, 4, 5],
			   	  [6, 7, 8],
				  [0, 3, 6],
				  [1, 4, 7],
				  [2, 5, 8],
				  [0, 4, 8],
				  [2, 4, 6]];

const blackWin = [[0, 1, 2],
				  [3, 4, 5],
				  [0, 3, 6],
			   	  [1, 4, 7],
			   	  [2, 5, 8],
			   	  [0, 4, 8],
				  [2, 4, 6]];

const speed = 800;

var w1;
var w2;
var w3;
var b1;
var b2;
var b3;
var t1;
var t2;
var t3;
var whitePosition;
var blackPosition;
var transPosition;
var selectedPieces;
var player;
var isOver;

//generate lines in board
var board = document.getElementById("board");
var ctx = board.getContext("2d");
ctx.beginPath();
ctx.strokeStyle="#b39a46";
ctx.lineWidth=2;
ctx.moveTo(0, 0);
ctx.lineTo(208, 208);
ctx.stroke();
ctx.moveTo(208, 0);
ctx.lineTo(0, 208);
ctx.stroke();
ctx.moveTo(104, 0);
ctx.lineTo(104, 208);
ctx.stroke();
ctx.moveTo(0, 104);
ctx.lineTo(208, 104);
ctx.stroke();

start_game();
//replay button
$("#replay").click(function() {replay_game();});

function Piece(color, position, element) {
	this.element=element;
	this.element.color=color;
	this.element.position=position;
	this.element.addEventListener('click', click_select, false);
}

function start_game() {
	isOver = false;
	document.getElementById("endgame").style.display = "none";
	w1 = new Piece("white", 0, document.getElementById('w1'));
	w2 = new Piece("white", 1, document.getElementById('w2'));
	w3 = new Piece("white", 2, document.getElementById('w3'));
	b1 = new Piece("black", 6, document.getElementById('b1'));
	b2 = new Piece("black", 7, document.getElementById('b2'));
	b3 = new Piece("black", 8, document.getElementById('b3'));
	t1 = new Piece("transparent", 3, document.getElementById('t1'));
	t2 = new Piece("transparent", 4, document.getElementById('t2'));
	t3 = new Piece("transparent", 5, document.getElementById('t3'));
	update_position();
	player = "white";
	selectedPieces = new Array();
}

function replay_game() {
	document.getElementById("endgame").style.display = "none";
	update_selector();
	$(w1.element).animate({
			marginLeft: "-142px",
			top: "62px"
		}, 500);
	$(w2.element).animate({
			marginLeft: "-38px",
			top: "62px"
		}, 500);
	$(w3.element).animate({
			marginLeft: "66px",
			top: "62px"
		}, 500);
	$(t1.element).animate({
			marginLeft: "-142px",
			top: "168px"
		}, 500);
	$(t2.element).animate({
			marginLeft: "-38px",
			top: "168px"
		}, 500);
	$(t3.element).animate({
			marginLeft: "66px",
			top: "168px"
		}, 500);
	$(b1.element).animate({
			marginLeft: "-142px",
			top: "272px"
		}, 500);
	$(b2.element).animate({
			marginLeft: "-38px",
			top: "272px"
		}, 500);
	$(b3.element).animate({
			marginLeft: "66px",
			top: "272px"
		}, 500);
	start_game();
}

//control the selector1 and selector2 image divs
function update_selector() {
	if (selectedPieces.length == 1) {
		//hide selector2		
		$("#selector2").css("visibility","hidden");
		//move and show selector1
		$("#selector1").css("margin-left", $(selectedPieces[0]).css("margin-left"));
		$("#selector1").css("top", $(selectedPieces[0]).css("top"));
		$("#selector1").css("visibility", "visible");
	}
	else if (selectedPieces.length == 2) {
		$("#selector2").css("margin-left", $(selectedPieces[1]).css("margin-left"));
		$("#selector2").css("top", $(selectedPieces[1]).css("top"));
		$("#selector2").css("visibility", "visible");
	}
	else {
		$("#selector1").css("visibility","hidden");
		$("#selector2").css("visibility","hidden");
	}
}


function click_select(piece) {
	if (isOver == true) {
		return;
	}
	if (selectedPieces.length == 0) {
		if (piece.target.color==player) {
			selectedPieces[0] = piece.target;
			update_selector();
		}
	} 
	else if (selectedPieces.length==1) {
		if (piece.target.color==player) {
			selectedPieces[0] = piece.target;
			update_selector()
		}
		else if (piece.target.color=="transparent") {
			if (can_move(selectedPieces[0], piece.target)){
				selectedPieces[1] = piece.target;
				update_selector()
			}	
		}
	}
	if (selectedPieces.length==2) {
		turn();
	}
}

function swap(piece1, piece2) {
	$(piece1).animate({
			marginLeft: $(piece2).css("margin-left"),
			top: $(piece2).css("top")
		}, speed);
	$(piece2).animate({
			marginLeft: $(piece1).css("margin-left"),
			top: $(piece1).css("top")
		}, speed);

	//update_position
	let tempPosition = piece1.position;
	piece1.position = piece2.position;
	piece2.position = tempPosition;
}

function update_position() {
	whitePosition = [w1.element.position, w2.element.position, w3.element.position].sort();
	transPosition = [t1.element.position, t2.element.position, t3.element.position].sort();
	blackPosition = [b1.element.position, b2.element.position, b3.element.position].sort();
}


function switch_player() {
	if (player=="white") {
		player = "black";
	}
	else {
		player = "white";
	}
}


function turn(player) {
	//swap(from, to);
	swap(selectedPieces[0], selectedPieces[1]);
	update_position();
	if (check_win()) {
		end_game();
	}
	selectedPieces=[];
	switch_player();
}

function can_move(piece1, piece2) {
	let p1 = piece1.position;
	let p2 = piece2.position;
	if (p1 == 0) {
		if ([1, 3, 4].includes(p2)) {
			return true
		}
	}
	else if (p1 == 1) {
		if ([0, 2, 4].includes(p2)) {
			return true
		}
	}
	else if (p1 == 2) {
		if ([1, 4, 5].includes(p2)) {
			return true
		}
	}
	else if (p1 == 3) {
		if ([0, 4, 6].includes(p2)) {
			return true
		}
	}
	else if (p1 == 4) {
		return true
	}

	else if (p1 == 5) {
		if ([2, 4 ,8].includes(p2)) {
			return true
		}
	}
	else if (p1 == 6) {
		if ([3, 4, 7].includes(p2)) {
			return true
		}
	}
	else if (p1 == 7) {
		if ([4, 6, 8].includes(p2)) {
			return true
		}
	}
	if (p1 == 8) {
		if ([4, 5, 7].includes(p2)) {
			return true
		}
	}
	return false;
}

function check_win() {
	if (player=="white") {
		for (var i=0; i<whiteWin.length; i++) {
			if (JSON.stringify(whitePosition)==JSON.stringify(whiteWin[i])) {
				return true;
			} 
		}
		return false;
	} else {
		for (var i=0; i<blackWin.length; i++) {
			if (JSON.stringify(blackPosition)==JSON.stringify(blackWin[i])) {
				return true;
			} 
		}
		return false;
	}
}

function end_game() {
	document.getElementById("endgame").style.display = "block";
	document.getElementById("endgame").innerHTML = player + " Wins!";
	isOver = true;
}
