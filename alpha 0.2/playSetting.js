//var gameMode = {}
var expMaxArr = [ //래벨별 최대경험치 최대랩 15
    10,20,30,40,50,60,70,80,90,100,110,120,130,140,150
]
var hpMaxArr = [
    500,750,1000,1250,1500,1750,2000,2250,2500,2750,3000,3250,3500,3750,4000
]
var player = {width:15,height:15,x:120,y:120,move:3} //플레이어 설정
var playerState = {hp:hpMaxArr[0],maxHp:hpMaxArr[0],exp:0,maxExp:expMaxArr[0],LV:1}
var score = 0;
var timer = 0;

//ai setting
var aiMaxNum = 170; //최대 ai 수용량
var ai = new Array(aiMaxNum);

//ai의 초기값 damage가 0미만일경우 체력이 회복된다.
var aiStart = {
	width:10,height:10,
	able:false,
	move:1,
	x:100,y:100,
	damage:45, 
	color:"green",
    life:100*15
};



var addSec = 0.15;//ai 출현 빈도