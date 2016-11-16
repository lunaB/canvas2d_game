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
var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
canvas.maxWidth = c.width;
canvas.maxHeight = c.height;
document.body.appendChild(c);

function resize(){ //리사이즈 할시
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    canvas.maxWidth = c.width;
    canvas.maxHeight = c.height;
    document.body.appendChild(c);
}

var ctx = c.getContext('2d');

var gameMode = {}
var player = {width:15,height:15,x:120,y:120,move:3} //플레이어 설정
var playerState = {hp:500,maxHp:500}
var score = 0;
var timer = 0;
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
var aiMaxNum = 100; //최대 ai 수용량
var ai = new Array(aiMaxNum);

//ai의 초기값 damage가 0미만일경우 체력이 회복된다.
var aiStart = {width:10,height:10,able:false,move:1,x:100,y:100,damage:20};	


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
	//도망
	var mx = moveXYTmp * tw;//임시
	var my = moveXYTmp * th;
	
	//mx = moveXYTmp * tw;//임시
	//my = moveXYTmp * th;
	
	
	//만약 x좌표나 y 좌표로 mx 나 my 만큼이동할때 초과하면 움직이지 않게 코딩하면 공간이 남을수 있기떄문에
	//공간이 초과하게 남으면 mx 나 my 가 ai의 x나y가 0이되게한다.
	
	if(	//충돌감지
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
        
        //hp증감 처리
        if(playerState.hp - ai[i].damage <= 0){ //죽었을때
            gameOver();
        }else if(playerState.hp - ai[i].damage > playerState.maxHp){ //최대hp 초과
            playerState.hp = playerState.maxHp;
        }
        playerState.hp -= ai[i].damage;
        console.log("hp:" + playerState.hp + " damage:" + ai[i].damage );
	}else{	
		//끝으로갈경우
		if(ai[i].x + mx < 0){ 
			console.log("x");
			mx = -ai[i].x;
		}else if(ai[i].x + mx > canvas.maxWidth){	//같은 축에서 미만과 초과가 같이 나타날수 없기에 else
			mx = canvas.maxHeight - ai[i].x;
		}
		if(ai[i].y + my < 0){
			console.log("y");
			my = -ai[i].y;
		}else if(ai[i].y + my > canvas.maxHeight){
			my = canvas.maxWidth - ai[i].y;
		}
		
		ai[i].x += mx;
		ai[i].y += my;
	}
}
//board setting

var interval = Array(4);
function onLoad(){ //interval 개수 4개
	var addSec = 2;
	for(var i=0;i<aiMaxNum;i++){
		ai[i].x = Math.random() * canvas.maxWidth;
		ai[i].y = Math.random() * canvas.maxHeight;
	}
    interval[0] = setInterval(function(){
		var randSpeed = Math.random()*1.8+1;
		var tmpIndex = getNullAi();
		addAi(tmpIndex);
		setAiSpeed(tmpIndex,randSpeed);
        console.log(tmpIndex);//임시
        tmpIndex++
	},1000*addSec);
	
	interval[1] = setInterval(function(){
		moveAi();
		drow();
	},10);
	interval[2] = setInterval(function(){key()},10);
    interval[3] = setInterval(function(){timer++},1000)
}

//drow
function drow(){
	ctx.clearRect(0,0,canvas.maxWidth,canvas.maxHeight);
	ctx.save();
	//----------------player--------------------
	ctx.fillStyle = "red";
	ctx.fillRect(
		player.x - player.width/2, 
		player.y - player.height/2,
		player.width , player.height
	);
	//----------------ai------------------------
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
    //----------------timer---------------------
    ctx.font="30px 맑은 고딕";
    ctx.fillStyle="#000";
    ctx.fillText("timer:"+timer,40,45,200);
    
    //----------------stitus UI--------------------
	ctx.fillStyle = "rgba(200,200,200,0.7)";
    ctx.fillRect(canvas.maxWidth/2-200,canvas.maxHeight-80,400,60);
    
    //hp 빈칸
    var hpWidth = 350; //hp칸 width
    ctx.fillStyle = "rgba(200,200,200,0.6)";
    ctx.fillRect(canvas.maxWidth/2-(hpWidth/2),canvas.maxHeight-75,hpWidth,15);
    //hp 칸
    var hp1PM = hpWidth / playerState.maxHp; //hp 1 까일때마다 줄어드는 width
    ctx.fillStyle = "rgba(255,60,60,0.8)";
    ctx.fillRect(canvas.maxWidth/2-175,canvas.maxHeight-75,hp1PM * playerState.hp,15);
    
    //mp , exp 나중에 만들자
    ctx.restore();
}

function gameOver(){
    for(var i=0;i<interval.length;i++){
        clearInterval(interval[i]);
    }
    //setTimeout
    setTimeout(function(){
        ctx.save();
        ctx.fillStyle == "#000";
        ctx.fillRect(0,0,canvas.maxWidth,canvas.maxHeight);
        
        ctx.font="80px 맑은 고딕";
        ctx.fillStyle="#FFF";
        ctx.textAlign = "center";
        ctx.fillText("GameOver :D",canvas.maxWidth/2,canvas.maxHeight/2,canvas.maxWidth);
        
        ctx.font="20px 맑은 고딕";
        ctx.fillStyle="#FFF";
        ctx.fillText(
            "yourScore : " +   score,
            canvas.maxWidth/2,
            canvas.maxHeight/2+50,
            canvas.maxWidth
        );
        
        ctx.font="20px 맑은 고딕";
        ctx.fillStyle="#FFF";
        ctx.fillText(
            ":: replay spacebar ::",
            canvas.maxWidth/2,
            canvas.maxHeight/2+90,
            canvas.maxWidth
        );
        
        ctx.restore();
        setInterval(function(){
            if(keyCode[32]){
                console.log("엉");
                location.reload();
            }
        },10);
    },50);
}