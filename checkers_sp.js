var chatBox = new Object;
chatBox.height=50;
var board=new Object;
board.state=[];
var canvas;


//Return board to its pristine state.
function setupBoard(){
	board.turn="l";
	for (var i = 0;i<32;i++){
		if (i<12){
			board.state[i]="l";
		}
		else if (i>19){
			board.state[i]="d";
		}
		else {
			board.state[i]=" ";
		}
	}
}

function startup(canvasID){
	setupBoard();
	canvas = document.getElementById(canvasID);
	prepareInput(canvas); //hook up mouse events to canvas.
	ctx = canvas.getContext("2d");
	resizeCanvas();
	return ctx;
}

function resizeCanvas(){
	canvas.width= window.innerWidth*.97;
	canvas.height = window.innerHeight*.97;
}

function drawScreenBorder(ctx){
	ctx.beginPath();
	ctx.strokeRect(0.5,0.5,canvas.width-0.5,canvas.height-0.5);
	ctx.stroke();
}

function drawBoard(ctx){
	//First, let's do the border.
	ctx.beginPath();
	ctx.strokeRect(board.offsetX,board.offsetY,8*board.squaresize,8*board.squaresize);
	ctx.stroke();
		
	for (var i = 0;i<8;i++){
		for (var j = 0;j<8;j++){
			//checkered squares every other space, starting at 0.  
			if ((i+j)%2===0){
				ctx.fillRect(board.offsetX+board.squaresize*i,board.offsetY+board.squaresize*j, board.squaresize, board.squaresize);
			}
		}
	}
}


//Returns center coordinate of a piece if a square is occupied,  Coordinates are relative to the board.  Ie, 31 = (.5*squaresize,.5*squaresize);
//Expected input: (0..31 as ints)
function getCoordinatesByLocation(loc){
	var result = [0,0];
	result[0] = 7-((loc%4) * 2);
	if (Math.floor(loc/4)%2===1){result[0]--;}  // This line ensures that even rows (0,2,4, etc) are shifted one row to the left.
	result[0] = result[0] * board.squaresize;
	result[1] = (7-Math.floor(loc/4))*board.squaresize;
	
	result[0]+=(0.5)*board.squaresize;
	result[1]+=(0.5)*board.squaresize;
	return result;
}

//Just like the function above, but in reverse.  Takes an x,y (relative to the board, so use board.offsetX,Y to line up
//and spits out a # 0-31 which represents the space matching that coordinate.  -1 = no match.  Third option is strictness - picking up a piece
//should require you to click on the piece, but putting it down shouldn't require you to center on the exact center point of a square.
// pass -1 as last param to just get anywhere in the square.
function getLocationByCoordinates(x,y,distfromcenter){
	//Obvious Stuff first.  If it's outside the board, -1 for ya.
	if (x<0 || x>8*board.squaresize || y<0 || y>8*board.squaresize){
		return -1;
	}
	var row=Math.floor(y/board.squaresize); //0-7
	var col=Math.floor(x/board.squaresize); //0-7
	var center = new Object();
	center.X = (col+0.5)*board.squaresize;
	center.Y = (row+0.5)*board.squaresize;
	// 
	if ((row+col)%2===1){return -1;}
	
	var location = (7-row)*4;
	location += Math.floor((7-col)/2);
	
	if (distfromcenter!=-1 && !(getDist(x,y,center.X,center.Y)<=distfromcenter)){
		return -1;
	}
	return location;

}

function getDist(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(Math.abs(y2-y1),2)+Math.pow(Math.abs(x2-x1),2));
}


function drawPiece(x,y,type){
	ctx.beginPath();
	ctx.arc(x,y,(0.4*board.squaresize),0,2*Math.PI,true);
	if (type=="l"){
		ctx.fillStyle = "rgb(150,0,0)";
		ctx.fill();
	} else if (type=="d"){
		ctx.fillStyle = "rgb(40,40,40)";
		ctx.fill();
	}	
}

// Piece placement relies on knowing the position in the board.state array (which represents the 32 available spaces on a checkers game).
// makes extensive use of getCoordinatesByLocation.
// board.state[] has 5 possible values: "d" for regular dark pieces "D" for kinged dark pieces " " for empty territory
// "L" for kinged light pieces and "l" for regular light pieces
//
// As to actually drawing the pieces, just use an arc which creates a full circle.
function drawPieces(ctx){
	for (var i = 0;i<32;i++){
		var coords = getCoordinatesByLocation(i);
		if (board.state[i]!=" "){ // empty spaces don't need anything.
			drawPiece(coords[0]+board.offsetX,coords[1]+board.offsetY,board.state[i]);
		}
	}
}


function draw(ctx){
	resizeCanvas();
	drawScreenBorder(ctx);
	var tmp=480;

	if (canvas.height>canvas.width){
		tmp=canvas.width;
	}else{ tmp=canvas.height; }
	
	board.squaresize = Math.floor((tmp - chatBox.height)/8);
	board.offsetX = (canvas.width - 8*board.squaresize)/2;
	board.offsetY = 10; //It's a good number.  Trust me.  (http://img.anongallery.org/img/4/1/i-have-no-idea-what-im-doing-dog.jpg)
	
	drawBoard(ctx);
	//movingPieces(ctx);
	drawPieces(ctx);
	
	if (hand.holding!=" "){
		drawPiece(input.mouseX,input.mouseY,hand.holding);
	}
	
}

function setup(canvasID){
	var ctx = startup("renderer");
	var redraw = setInterval(function(){ draw(ctx); },50);
}
