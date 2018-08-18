window.onload=function(){
	var check=document.querySelector("input[type=checkbox]:checked");
	if(check!==null)
	check.checked=false;
}	
var origBoard;															// array to store the board cell status i.e 'X' or 'O' or index
function Player(char,color,bgcolor,message)
{
	this.char=char;
	this.color=color;
	this.bgcolor=bgcolor;
	this.message=message;
}

const huPlayer = new Player('O','#ffff00','#00ff00',"You Win!");
const aiPlayer = new Player('X','#0000ff','#ff0000',"You Lose.");

var messageBox=document.querySelector('#messageBox');

var messageElem=document.querySelector('#messageBox #text');


const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[2,4,6],
]

var cells = document.querySelectorAll('.cell');									// get all the elements in the document having class .cell i.e. all board cells

startGame();

function startGame()
{
	origBoard = Array.from(Array(9).keys());									// initialize the origBoard with 0-8 numbers
	messageBox.style.display="none";											// hide the message box
	for(var i=0;i<cells.length;i++){	
		cells[i].innerHTML = "";												// empty all the board squares
		cells[i].style.removeProperty("background-color");							// reset the background-color
		cells[i].addEventListener('click',turnClick,false);						// respond for the clicks on the board squares
	}
}

function emptySquares()
{
	return origBoard.filter(s=> typeof s == 'number');							// filter the origBoard for the empty squares i.e. that contain number instead of 'X' or 'O'
}

function getMove()
{
	return minimax(origBoard,aiPlayer).index;
}

function tie()
{
	return (emptySquares().length === 0) && !checkWin(origBoard,huPlayer) && !checkWin(origBoard,aiPlayer);  // if no squares are empty and no player has won
}

function turnClick(square)
{
		if(typeof origBoard[square.target.id] == "number"){			//if the clicked cell doesnt has 'X' or 'O' i.e. it contains a number
			turn(square.target.id,huPlayer);						// then play the turn
			if(!tie())	turn(getMove(),aiPlayer);					// if the game is not tie the play the AI move
			else
			{
				displayMessage("Tie Game!");						// else i.e the game is tie then display the tie message
				for (var i = 0; i < cells.length; i++) {
					cells[i].style.backgroundColor="#0f7";
				}
			}
	
		}	
}




function turn(squareId,player)
{
	origBoard[squareId] = player.char;										// update the origBoard status with the players character (X or O) at the given squareId
	var cell=document.getElementById(squareId);
	cell.innerHTML = player.char;											// display the players character at the clicked cell
	cell.style.color = player.color;										// with the players color
	var game=checkWin(origBoard,player);
	if(game)   gameOver(game);	 									// If player has won display its message
}

function gameOver(gameWin)
{
	displayMessage(gameWin.player.message);
	for (var i of winCombos[gameWin.index]) {
		document.getElementById(i).style.backgroundColor=gameWin.player.bgcolor;
	}
}

function displayMessage(message)
{	
	messageElem.innerHTML=message;											// write the given message to the messageBox
	messageBox.style.display="block";										// to make the messageBox visible set its display to block
	for(var i=0;i<cells.length;i++){
		cells[i].removeEventListener('click',turnClick,false);				// after displaying message don't respond for any click event on the cells
	}
}
function checkWin(origBoard,player)
{
	var gameWin=null;																	// set the gameWin initially as false as no win has been decided
	var plays=origBoard.reduce((a,e,i) => e === player.char ? a.concat(i) : a,[]);      // get the indexes of the board that contain the character of the current player in plays
	for(var [index, win] of winCombos.entries())											// for each 'win' combination of winCombos having index 'index' 
	{
		if(win.every(elem=>plays.indexOf(elem)>-1))  									 // if every element of 'win' has an index in play i.e it exists in plays
		{
				gameWin={index : index, player: player};
				break;						 							// push all the win index in gameWin 
		}
	}
	return gameWin;																		// return the decision
}


function minimax(newBoard, player)
{
	var moves=[];
	var availSpots=emptySquares();

	if(checkWin(newBoard,player)){
		return {score: -10};
	}
	else if(checkWin(newBoard,aiPlayer))
	{
		return { score: 20 };
	}
	else if(availSpots.length===0)
	{
		return {score: 0};
	}

	for (var i = 0; i < availSpots.length; i++) {
		var move={};

		move.index=newBoard[availSpots[i]];
		newBoard[availSpots[i]]=player.char;

		if(player==aiPlayer)
		{
			var result=minimax(newBoard,huPlayer);
			move.score=result.score;
		}
		else
		{
			var result=minimax(newBoard,aiPlayer);
			move.score=result.score;
		}

		newBoard[availSpots[i]]=move.index;

		moves.push(move);

	}

	var bestMove;

	if(player==aiPlayer)
	{
		var bestScore=-1000;

		for (var i = 0; i < moves.length; i++) {
			if(moves[i].score>bestScore)
			{
				bestScore=moves[i].score;
				bestMove=i;
			}
		}
	}
	else
	{	
		var bestScore=1000;

		for (var i = 0; i < moves.length; i++) {
			if(moves[i].score<bestScore)
			{
				bestScore=moves[i].score;
				bestMove=i;
			}
		}
	}

	return moves[bestMove];

}

