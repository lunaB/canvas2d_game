// JavaScript Document

/*
2016 09 25
나영채

플레이어를 따라가는 ai 를 동적으로 생성할수 있게 만들었고
ai도 삼각비를 이용해 움직이게 만들었다.

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
//ai setting
var aiMaxNum = 10; //최대 ai 수용량
var ai = new Array(aiMaxNum);
for(var i=0;i<aiMaxNum;i++){
	ai[i] = {width:10,height:10,able:false,move:1,x:500,y:500};
}
//addAi index < aiMaxNum
//편집의 편의를 위한 메서드 정의
function addAi(i) {
	ai[i].able = true;
}
function setAiProperty(i,w,h,m) {
	ai[i].width = w;
	ai[i].height = h;	
}
function setAiSpeed(i,m){
	ai[i].move = m;
}
function setAiLocation(i,x,y){
	ai[i].x = x;
	ai[i].y = y
}

function moveAi(){
	for(var i=0;i<aiMaxNum;i++){
		if(ai[i].able) {
			tracking(i);
		}
	}
}
//메인 추적 알고리즘 index < aiMaxNum
function tracking(i){
	//ai 자신의 위치를 (0,0) 으로 잡음
	var x1 = 0;
	var y1 = 0;
	
	var x2 = player.x - ai[i].x;
	var y2 = player.y - ai[i].y;
	
	//좌표평면위 두점 높이 너비
	var tw = x2-x1;
	var th = y2-y1;
	
	//move Ai
	var widthHeightSum = Math.pow(th,2) + Math.pow(tw,2);//
	var diagonalLine = Math.sqrt(widthHeightSum);//대각선의 거리
	var spTmp = ai[i].move / diagonalLine;
	
	var mx = spTmp * tw;
	var my = spTmp * th;
	
	ai[i].x += mx;
	ai[i].y += my;
}

//board setting
function onLoad(){
	//임시로 만든것
	var addAiSec = 10;	//ai는 ai가몇초마다생기나
	var tmpIndex = 0;	//임시변수(ai번호)
	
	setInterval(function(){
		var randSpeed = Math.random()*1.2+1;//랜덤으로 스피드 조절
		addAi(tmpIndex);
		setAiSpeed(tmpIndex++,randSpeed);
		if(tmpIndex > aiMaxNum){
			clearInterval(this);
		}
		console.log(tmpIndex);
	},1000*addAiSec);
	
	setInterval(function(){
		moveAi();
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
	ctx.fillStyle = "blue";
	for(var i=0;i<aiMaxNum;i++){
		if(ai[i].able){
			ctx.fillRect(
				ai[i].x - ai[i].width/2,
				ai[i].y - ai[i].height/2, 
				ai[i].width , ai[i].height
			);
		}
	}
	ctx.restore();
}