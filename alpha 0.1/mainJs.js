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
var expMaxArr = [ //래벨별 최대경험치 최대랩 15
    10,20,30,40,50,60,70,80,90,100,110,120,130,140,150
]
var hpMaxArr = [
    50,75,100,125,150,175,200,225,250,275,300,325,350,375,400
]
var player = {width:15,height:15,x:120,y:120,move:3} //플레이어 설정
var playerState = {hp:hpMaxArr[0],maxHp:hpMaxArr[0],exp:0,maxExp:expMaxArr[0],LV:1}
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
var aiStart = {
	width:10,height:10,
	able:false,
	move:1,
	x:100,y:100,
	damage:20,
	//color: red blue yellow black green 
	color:"blue",
    life:100*20
};

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
function removeAi(i){
    //충돌처리된것을 초기화 시킵니다.
    ai[i] = clone(aiStart);
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
	var mx = moveXYTmp * tw;//임시
	var my = moveXYTmp * th;
	
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
		removeAi(i); //초기화
        //hp증감 처리
        if(playerState.hp - ai[i].damage <= 0){ //죽었을때
            ai[i].damage = playerState.hp;
            gameOver();
        }else if(playerState.hp - ai[i].damage > playerState.maxHp){ //최대hp 초과
            playerState.hp = playerState.maxHp;
        }
        playerState.hp -= ai[i].damage;
	}else{	
		//끝으로갈경우
		if(ai[i].x + mx < 0){ 
			mx = -ai[i].x;
		}else if(ai[i].x + mx > canvas.maxWidth){	//같은 축에서 미만과 초과가 같이 나타날수 없기에 else
			mx = canvas.maxHeight - ai[i].x;
		}
		if(ai[i].y + my < 0){
			my = -ai[i].y;
		}else if(ai[i].y + my > canvas.maxHeight){
			my = canvas.maxWidth - ai[i].y;
		}
		
		ai[i].x += mx;
		ai[i].y += my;
	}
}
//board setting

var interval = Array(80);//온로드에 인터벌을 추가하려면 1높여줍니다.
function onLoad(){ //interval 개수 4개
	var addSec = 0.5;
    bimTableScript(); // 빔테이블 초기화-----------------------
	for(var i=0;i<aiMaxNum;i++){
		ai[i].x = Math.random() * canvas.maxWidth;
		ai[i].y = Math.random() * canvas.maxHeight;
	}
    interval[0] = setInterval(function(){
		var randSpeed = Math.random()*1.9+1;
		var tmpIndex = getNullAi();
		addAi(tmpIndex);
		setAiSpeed(tmpIndex,randSpeed);
		setAiLocation(tmpIndex,Math.random() * canvas.maxWidth , Math.random() * canvas.maxHeight);
        tmpIndex++
	},1000*addSec);
	
	interval[1] = setInterval(function(){
		moveAi();
		drow();
	},10);
	interval[2] = setInterval(function(){key()},10);
    interval[3] = setInterval(function(){
        timer++;
        expPlus(1);//경험치 증가
        scorePlus(1);//스코어증가
    },1000)
    
    // 이아레코드부터는 게임모드의 코드입니다 ------------------------------------------
    
	aiLife();  //interval
    mapDanger();  //interval
}

function scorePlus(plus){
    score += plus;
}

function expPlus(exp){ //경험치 증가의 함수
    if(playerState.LV != expMaxArr.length){ //만랩아닐경우만
        playerState.exp += exp; //exp 증가분 매개변수
        if(playerState.maxExp <= playerState.exp){
            //플레이어 레벨 증가분이 max를 초과할경우를 대비함
            playerState.LV += playerState.exp / playerState.maxExp;
            //exp 랩업하고 남은 exp 반환
            playerState.exp = playerState.exp % playerState.maxExp;
            //maxExp 레벨에 마춰진 최대경험치량
            playerState.maxExp = (playerState.LV != expMaxArr.length ? expMaxArr[playerState.LV-1] : expMaxArr[expMaxArr.length-1]);
            // 레벨업을 했을경우에 주고싶은 이벤트는 아레에 추가하면됨
            playerState.maxHp = hpMaxArr[playerState.LV-1];
            playerState.hp = playerState.maxHp;//체력 초기화
        }
    }
}

// 이아레코드부터는 게임모드의 코드입니다 ------------------------------------------
function aiLife(){ //ai 의 수명 관리 10 interval
	interval[4] = setInterval(function() {
        for(var i=0;i<ai.length;i++){
            if(ai[i].able){
                if(ai[i].life < 0 ){
                    removeAi(i);
                }else{
                    ai[i].life --;
                }
            }
        }
    },10);
}

var dengerIndex = 0;
var locationStop = true;
function mapDanger(){ //10 interval
    interval[5] = setInterval(function() {
        //시간이 준비시간보다 같거나클때 시간이 준비시간끝 보다 작을때
        //EX 1 2 4 5
		if(denger[dengerIndex].drowDengerTimeS <= timer && timer < denger[dengerIndex].drowDengerTimeE) { //1,2
			denger[dengerIndex].drowAble = true;
        }else if(denger[dengerIndex].drowDengerTimeE <= timer && timer < denger[dengerIndex].attackS) { //2,3
            denger[dengerIndex].drowAble = false;
			if(locationStop){
				denger[dengerIndex].attackLocation = (denger[dengerIndex].xy == 'x' ? player.x - player.width/2 : player.y - player.height/2);
				locationStop = false;
			}
        }else if(denger[dengerIndex].attackS <= timer && timer < denger[dengerIndex].attackE) { //4
			denger[dengerIndex].attackAble = true;
            //충돌처리
			if(denger[dengerIndex].xy == 'x'){
				if(
                    denger[dengerIndex].attackLocation - denger[dengerIndex].drowDengerWH/2 <= (player.x + player.width/2) &&
                    denger[dengerIndex].attackLocation + denger[dengerIndex].drowDengerWH/2 >= (player.x - player.width/2)
                  ){
                    playerState.hp -= denger[dengerIndex].attackDamage/100;
                    if(playerState.hp < 0){ //죽었을때
                        gameOver();
                    }   
				}
			}else if(denger[dengerIndex].xy == 'y'){
				if(
                    denger[dengerIndex].attackLocation - denger[dengerIndex].drowDengerWH/2 <= (player.y + player.width/2) &&
                    denger[dengerIndex].attackLocation + denger[dengerIndex].drowDengerWH/2 >= (player.y - player.width/2)
                ){
					playerState.hp -= denger[dengerIndex].attackDamage/100;
                    if(playerState.hp < 0){ //죽었을때
                        gameOver();
                    }   
				}
			}
        }else if(denger[dengerIndex].attackE <= timer ){//5
            denger[dengerIndex].attackAble = false;
            if(dengerIndex + 1 != denger.length){
				locationStop = true;
				dengerIndex ++;
            }
        }
    },10);
}
//------------------------------여기까지--------------------------------------




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
	for(var i=0;i<aiMaxNum;i++){
		if(ai[i].able){
			ctx.fillStyle = ai[i].color;
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
    
    //여기서는 새롭게 생성된 게임모드의 이벤트 를 그리는 코드입니다----------------------------------------
    
    if(denger[dengerIndex].drowAble == true){ // 경고
        //10은 drow 의 interval 1000은 초 곱 2는 1초맞추기
        denger[dengerIndex].alpha += (10 / ((denger[dengerIndex].drowDengerTimeE - denger[dengerIndex].drowDengerTimeS) * 1000)); //투명도 낮춰줌
        ctx.fillStyle = "rgba(255,80,80,"+ denger[dengerIndex].alpha +")";
		if(denger[dengerIndex].xy == 'y'){ //y축 경고
			ctx.fillRect(
                0,
                player.y - denger[dengerIndex].drowDengerWH/2,
                denger[dengerIndex].drowDengerWeight,
                denger[dengerIndex].drowDengerWH
            );
        }else if(denger[dengerIndex].xy == 'x'){  //x축 경고
            ctx.fillRect(
                player.x - denger[dengerIndex].drowDengerWH/2,
				0,
				denger[dengerIndex].drowDengerWH,
				denger[dengerIndex].drowDengerWeight
            );
        }
    }else if(denger[dengerIndex].attackAble == true){ // 발사
        ctx.fillStyle = denger[dengerIndex].bimColor;
        if(denger[dengerIndex].xy == 'y'){ //y축 빔
            ctx.fillRect(
                0,
                denger[dengerIndex].attackLocation - denger[dengerIndex].drowDengerWH/2,
                canvas.maxWidth,
                denger[dengerIndex].drowDengerWH
            );
        }else if(denger[dengerIndex].xy == 'x'){ //x축 빔
            ctx.fillRect(
                denger[dengerIndex].attackLocation - denger[dengerIndex].drowDengerWH/2,
				0,
				denger[dengerIndex].drowDengerWH,
				canvas.maxHeight
            );
        }
    }
    
    //----------------stitus UI--------------------
	ctx.fillStyle = "rgba(190,190,190,0.7)";
    ctx.fillRect(canvas.maxWidth/2-200,canvas.maxHeight-80,400,60);
    
	var stateUI = {hpWidth:350,expWidth:350}
    //hp 빈칸
    ctx.fillStyle = "rgba(170,170,170,0.6)";
    ctx.fillRect(canvas.maxWidth/2-(stateUI.hpWidth/2),canvas.maxHeight-70,stateUI.hpWidth,25);
    //hp 칸
    ctx.fillStyle = "rgba(255,60,60,0.8)";
    ctx.fillRect(canvas.maxWidth/2-(stateUI.hpWidth/2),canvas.maxHeight-70,(stateUI.hpWidth / playerState.maxHp) * playerState.hp,25);
    //hp info
	ctx.fillStyle = "#EEE";
	ctx.font="20px 맑은 고딕";
	//-------표현할때소수점자리를 버림합니다.
	ctx.fillText(Math.trunc(playerState.hp)+"/"+Math.trunc(playerState.maxHp),(canvas.maxWidth/2)-(stateUI.hpWidth/2)+10,canvas.maxHeight-50,stateUI.maxWidth);
    //exp 빈칸
	ctx.fillStyle = "rgba(170,170,170,0.6)";
    ctx.fillRect(canvas.maxWidth/2-(stateUI.expWidth/2),canvas.maxHeight-40,stateUI.expWidth,10);
	//exp 칸
	ctx.fillStyle = "rgba(255,228,80,0.8)";
    ctx.fillRect(canvas.maxWidth/2-(stateUI.expWidth/2),canvas.maxHeight-40,(stateUI.expWidth / playerState.maxExp) * playerState.exp,10);
    //LV 칸
    if(playerState.LV == expMaxArr.length){ //만랩일때의 특수 텍스쳐
        ctx.fillStyle = "rgba(193,55,250,0.7)";
    }else{
        ctx.fillStyle = "rgba(232,37,82,0.7)";
    }
    ctx.fillRect(canvas.maxWidth/2-245,canvas.maxHeight-65,45,45);
    //lv 글씨
    ctx.font="28px 맑은 고딕";
    ctx.fillStyle = "#EEE";
    if(playerState.LV == expMaxArr.length){ //만랩일때의 특수 텍스쳐
        ctx.fillStyle = "#78CFE8";
    } 
    if(playerState.LV < 10){ //한 자리 수 일때
        ctx.fillText(playerState.LV,canvas.maxWidth/2-230,canvas.maxHeight-32,40);
    }else if(playerState.LV < 100){ //두자리일때
        ctx.fillText(playerState.LV,canvas.maxWidth/2-237.5,canvas.maxHeight-32,40);
    }
    
    
    
    ctx.restore();
}

function gameOver(){
    for(var i=0;i<interval.length;i++){
        if(interval[i] != null) clearInterval(interval[i]);
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
            if(keyCode[32]){    //스페이스시 새로고침
                location.reload();
            }
        },10);
    },150);
}