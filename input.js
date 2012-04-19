function prepareInput(canvas){
	canvas.addEventListener('mousedown',function(e){
		if (input.mouse===false){
			input.mouse=true;input.mouseX=e.pageX;input.mouseY=e.pageY;
			var loc = getLocationByCoordinates(input.mouseX-board.offsetX,input.mouseY-board.offsetY,.4*(board.squaresize));
			
			if (loc != -1 && board.state[loc]!=" " && hand.holding==" "){
				hand.holding=board.state[loc];
				hand.grabbedfrom=loc;
				board.state[loc]=" ";
			}
			
		}
		
		}
		);
	canvas.addEventListener('mouseup',function(e){
		if (input.mouse===true){
			input.mouse=false;input.mouseX=e.pageX;input.mouseY=e.pageY;
			
			if (hand.holding!=" "){
				var releaseon = getLocationByCoordinates(input.mouseX-board.offsetX,input.mouseY-board.offsetY,-1);
				if (releaseon!=-1 && board.state[releaseon]==" "){
					board.state[releaseon]=hand.holding;
					hand.holding=" ";
				} else { board.state[hand.grabbedfrom]=hand.holding; hand.holding=" ";}
			}
		}
		});
	canvas.addEventListener('mousemove',function(e){
		if (input.mouse){input.mouseX=e.pageX;input.mouseY=e.pageY;
		
		}});
}

var input = {
	mouse: false,
	mouseX: 0,
	mouseY: 0
};

var hand = new Object;
hand.holding=" ";