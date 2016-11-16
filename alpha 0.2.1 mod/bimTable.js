var denger = [];
denger[0] = { //첫 빔
    drowDengerTimeS:1,  //경고시작시간
    drowDengerTimeE:3,  //경고끝시간
    drowAble:false,     //그리기에서 확인하기위한 변수
    xy:'x',             //어떤축에서 빔이나올지
    drowDengerWH:220,   //경고 높이나 너비
    drowDengerWeight:50,//경고바 두깨
    alpha:0,            //경고 초기투명도
    
    attackLocation:0,   //경고가 끝난뒤에 공격할 좌표
    
    bimColor:"rgba(0,0,255,1)",     //빔색깔
    attackAble:false,    //공격시작타임
    attackS:4,          //공격시작타임
    attackE:6,          //공격끝타임
    attackDamage:280    //초당데미지
};
denger[1] = { //둘때 빔
    drowDengerTimeS:10, //경고시작시간
    drowDengerTimeE:12, //경고끝시간
    drowAble:false,     //그리기에서 확인하기위한 변수
    xy:'y',             //어떤축에서 빔이나올지
    drowDengerWH:250,   //경고 높이나 너비
    drowDengerWeight:50,//경고바 두깨
    alpha:0,            //경고 초기투명도
    
    attackLocation:0,   //경고가 끝난뒤에 공격할 좌표
    
    bimColor:"rgba(0,0,255,1)",     //빔색깔
    attackAble:false,   //공격시작타임
    attackS:13,         //공격시작타임
    attackE:15,         //공격끝타임
    attackDamage:280    //초당데미지
};

var ddts = 11;
var ddte = 12;
var as = 13;
var ae = 14;
var ad = 260;

var delay = 5;
function bimTableScript(){
    for(var i = 2;i < 500;i++){
        ddts += delay;
        ddte += delay;
        as += delay;
        ae += delay;
        ad += 40;
        var randxx = Math.floor(Math.random()*2);
        denger[i] = { //둘때 빔
            drowDengerTimeS:ddts,           //경고시작시간
            drowDengerTimeE:ddte,           //경고끝시간
            drowAble:false,                 //그리기에서 확인하기위한 변수
            xy:(randxx == 0 ? 'y' : 'x'),   //어떤축에서 빔이나올지
            drowDengerWH:250+i*6,         //경고 높이나 너비
            drowDengerWeight:50,            //경고바 두깨
            alpha:0,                        //경고 초기투명도

            attackLocation:0,               //경고가 끝난뒤에 공격할 좌표

            bimColor:"rgba(0,0,255,1)",                 //빔색깔
            attackAble:false,               //공격시작타임
            attackS:as,                     //공격시작타임
            attackE:ae,                     //공격끝타임
            attackDamage:ad                 //초당데미지
        };
    }
}
