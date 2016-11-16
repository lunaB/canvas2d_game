// JavaScript Document

//last version


function clone(obj) {//객체복사
	if (obj === null || typeof(obj) !== 'object')
		return obj;

	var copy = obj.constructor();
	for (var attr in obj) {
    	if (obj.hasOwnProperty(attr)) {
    		copy[attr] = obj[attr];
    	}
	}
	return copy;
}//------------------------------------------------

var canvas = {maxWidth:800,maxHeight:800} //캔버스 설정 (수정필요)
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

var player = {width:15,height:15,x:120,y:120,move:3} //플레이어 설정

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
var aiMaxNum = 5; //최대 ai 수용량
var ai = new Array(aiMaxNum);

var aiStart = {width:10,height:10,able:false,move:1,x:100,y:100};	//ai의 초기값

for(var i=0;i<aiMaxNum;i++){
	ai[i] = clone(aiStart);
}
//addAi index < aiMaxNum
//편집의 편의를 위한 메서드 정의
function addAi(i) {
	ai[i].able = true;
}
function getNullAi(){
	for(var i=0;i<aiMaxNum;i++){
		if(ai[i].able == false){
			return i;
			break;	
		}
	}
	alert("ERRORCODE:2 getNullAi Array Out Of Bounds");
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
	
	//대각선 이동거리 삼각비 식 (width^2 + height^2) 의 제곱근
	var diagonalLine = Math.sqrt(Math.pow(th,2) + Math.pow(tw,2)); //좌표평면위의 두점사이 거리
	var moveXYTmp = ai[i].move / diagonalLine;
	
	//움직일 좌표상의 거리
	var mx = moveXYTmp * tw;
	var my = moveXYTmp * th;
	
	if(	//겹침감지
		(
			(ai[i].x - (ai[i].width/2) < player.x + (player.width/2)) &&
			(ai[i].x + (ai[i].width/2) > player.x - (player.width/2)) &&
			(ai[i].y - (ai[i].height/2) < player.y + (player.height/2)) &&
			(ai[i].y + (ai[i].height/2) > player.y - (player.height/2))
		)
	){
		ai[i] = clone(aiStart);	//초기설정값으로 바꾸기
		//위치는 렌덤으로 (임시)
		setAiLocation(i,Math.random() * canvas.maxWidth , Math.random() * canvas.maxHeight);
	}else{
		ai[i].x += mx;
		ai[i].y += my;
	}
}

//board setting
function onLoad(){
	var addSec = 2;
	for(var i=0;i<aiMaxNum;i++){
		ai[i].x = Math.random() * canvas.maxWidth;
		ai[i].y = Math.random() * canvas.maxHeight;
	}
	setInterval(function(){
		var randSpeed = Math.random()*1.2+1;
		var tmpIndex = getNullAi();
		addAi(tmpIndex);
		setAiSpeed(tmpIndex,randSpeed);
		console.log(tmpIndex++);
	},1000*addSec);
	
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