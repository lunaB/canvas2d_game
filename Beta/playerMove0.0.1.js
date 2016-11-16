// JavaScript Document


/* 
2016 09 25
나영채

키를 입력받았을시의 움직임을
삼각비를 사용하여 움직이게함

*/

var canvas = {maxWidth:800,maxHeight:800} //캔버스 설정 (수정필요)
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

var player = {width:20,height:20,x:50,y:50,move:3} //플레이어 설정

//keyEvent
var keyCode = [];
window.addEventListener('keydown',function (e){keyCode[e.keyCode]=true});
window.addEventListener('keyup',function (e){keyCode[e.keyCode]=false});


function key(){
	//대각선거리
	var diagonal = (Math.sqrt(2)/2)*player.move;
	
	if(keyCode[38] && keyCode[37]){//위왼쪽
		if(player.x - diagonal < 0 && player.y - diagonal < 0) return;
		else if(player.x - diagonal < 0) player.y -= player.move;
		else if(player.y - diagonal < 0) player.x -= player.move;
		else{
			player.x -= diagonal;
			player.y -= diagonal;
		}
	}else if(keyCode[38] && keyCode[39]){//위오른쪽
		if(player.x + diagonal > canvas.maxWidth && player.y - diagonal < 0) return;
		else if(player.x + diagonal > canvas.maxWidth) player.y -= player.move;
		else if(player.y - diagonal < 0) player.x += player.move;
		else{
			player.x += diagonal;
			player.y -= diagonal;
		}
	}else if(keyCode[40] && keyCode[37]){//아레왼쪽
		if(player.x - diagonal < 0 && player.y + diagonal > canvas.maxHeight) return;
		else if(player.x - diagonal < 0) player.y += player.move;
		else if(player.y + diagonal > canvas.maxHeight) player.x -= player.move;
		else{
			player.x -= diagonal;
			player.y += diagonal;
		}
	}else if(keyCode[40] && keyCode[39]){//아레오른쪽
		if(player.x + diagonal > canvas.maxWidth && player.y + diagonal > canvas.maxHeight) return;
		else if(player.x + diagonal > canvas.maxWidth) player.y += player.move;
		else if(player.y + diagonal > canvas.maxHeight) player.x += player.move;
		else{
			player.x += diagonal;
			player.y += diagonal;
		}
	}else if(keyCode[38]){//위
		if(player.y - player.move < 0) return;
		player.y -= player.move;
	}else if(keyCode[40]){//아레
		if(player.y + player.move > canvas.maxHeight) return;
		player.y += player.move;
	}else if(keyCode[37]){//왼쪽
		if(player.x - player.move < 0) return;
		player.x -= player.move;
	}else if(keyCode[39]){//오른쪽
		if(player.x + player.move > canvas.maxWidth) return;
		player.x += player.move;
	}
}
function onLoad(){
	setInterval(function(){
		drow();
	},10);
	setInterval(function(){key()},10);
}

//drow
function drow(){
	ctx.clearRect(0,0,canvas.maxWidth,canvas.maxHeight);
	ctx.save();
	//------------------------------------------
	ctx.fillStyle = "red";
	ctx.fillRect(
		player.x - player.width/2, 
		player.y - player.height/2,
		player.width , player.height
	);
	//------------------------------------------
	ctx.restore();
}