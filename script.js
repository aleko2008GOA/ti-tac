var move = "x";
var gameEnded = false;
var botMove = false;
var win_arr = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

if(localStorage.med){
    var medScores = JSON.parse(localStorage.med);
    $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
    localStorage.med = JSON.stringify(medScores);
}else{
    var medScores = [0, 0];
    $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
    localStorage.med = JSON.stringify(medScores);
}

if(localStorage.easy){
    var easyScores = JSON.parse(localStorage.easy);
    $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
    localStorage.easy = JSON.stringify(easyScores);
}else{
    var easyScores = [0, 0];
    $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
    localStorage.easy = JSON.stringify(easyScores);
}

if (localStorage.ask == 2) {
    easyScores[1]+=1; 
    $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
    localStorage.easy = JSON.stringify(easyScores);
}
else if(localStorage.ask == 3){
    $(".medium").addClass("active");
    medScores[1]+=1; 
    localStorage.med = JSON.stringify(medScores);
    $(".medium").removeClass("active");
}
localStorage.ask = 1;

$(".restart").click(function(){
    var win = false;
    for (var i = 0; i < win_arr.length; i++) {
        if (win_arr[i].includes("x")) {
            win = true;
            break;
        }
    }
    if($(".pvp").hasClass("active") || gameEnded == true){
        $(".line").css("display", "none");
        restart();
    }
    else if(gameEnded == false && botMove == false && win == true){
        var question = prompt("You will automaticly lose, do you want to resign now? only yes/no");
        if(question == "yes"){
            if($(".easy").hasClass("active")){
                easyScores[1]+=1; 
                $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                localStorage.easy = JSON.stringify(easyScores);
            }
            else if($(".medium").hasClass("active")){
                medScores[1]+=1; 
                $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                localStorage.med = JSON.stringify(medScores);
            }
            restart();
        }
        else if(question != "no"){
            alert("Invalid choise, be correct.");
        }
    }
});

$(".tic-tac-rect").click(function(){
    if($(".pvp").hasClass("active")){
        pvp(this);
    }
    else if($(".easy").hasClass("active")){
        easy(this);
    }
    else if($(".medium").hasClass("active")){
        medium(this);
    }
});

window.onbeforeunload = function (e) {
    if($(".easy").hasClass('active') || $(".medium").hasClass("active")){    
        var start = false;
        for(var i = 0; i < win_arr.length; i++){
            for(var j = 0; j < win_arr[i].length; j++){
                if(win_arr[i][j] != ""){
                    start = true;
                    break;
                }
            }
        }
        if (gameEnded == false && start == true) {
            if($(".easy").hasClass("active")){
                localStorage.ask = 2;
            }
            else if($(".medium").hasClass("active")){
                localStorage.ask = 3;
            }
            e.preventDefault();
        }
    }
};

$("body").click(function(){
    localStorage.ask = 1;
});

$(".row .play").click(function(){
    addActive(this);
});
//pvp
function pvp(element){
    if(gameEnded == false){
        var indexOfRow = $(element).parent().index();
        var indexOfElement = $(element).index();
        if(win_arr[indexOfRow][indexOfElement] == ""){
            if(move == "x"){    
                $(element).append("<div class = 'tic'></div>");
                move = "0";
                win_arr[indexOfRow][indexOfElement] = "x"
            }else{
                $(element).append("<div class = 'tac'></div>");
                move = "x";
                win_arr[indexOfRow][indexOfElement] = "0"
            }
            checkWin();
        }
    }
}
//easy bot
function easy(element){
    if(gameEnded == false && botMove != true){
        var indexOfRow = $(element).parent().index();
        var indexOfElement = $(element).index();

        if(win_arr[indexOfRow][indexOfElement] == ""){
            $(element).append("<div class = 'tic'></div>");
            win_arr[indexOfRow][indexOfElement] = "x"
            checkWin();
            //bot move
            if(gameEnded != true){
                botMove = true;
                delay(function(){
                    var n = getRandomInt(0, 2);
                    var m = getRandomInt(0, 2);
                    while(win_arr[n][m] != ""){
                        n = getRandomInt(0, 2);
                        m = getRandomInt(0, 2);
                    }
                    win_arr[n][m] = "0";
                    var row = $(".row").eq(n); 
                    var cell = row.children().eq(m);
                    cell.append("<div class = 'tac'></div>");
                    
                    //will bot win?
                    botMove = false;
                    checkWin();
                }, Math.random() * 2000);
            }
        }
    }
}
//medium bot
function medium(element){
    if(gameEnded == false && botMove != true){
        var indexOfRow = $(element).parent().index();
        var indexOfElement = $(element).index();

        if(win_arr[indexOfRow][indexOfElement] == ""){
            $(element).append("<div class = 'tic'></div>");
            win_arr[indexOfRow][indexOfElement] = "x"
            checkWin();
            //bot move
            if(gameEnded != true){
                botMove = true;
                delay(function(){
                    mediumBotMove();
                    checkWin();
                }, Math.random() * 2000);
            }
        }
    }
}

function addActive(element){
    if(botMove == false){
        if($(element).hasClass("active")){
            alert("already chosen!");
        }else{
            var win = false;
            for (var i = 0; i < win_arr.length; i++) {
                if (win_arr[i].includes("x")) {
                    win = true;
                    break;
                }
            }
            if($(".active").hasClass("pvp") || gameEnded == true || win == false){
                if($(element).hasClass("easy")){
                    $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                }
                else if($(element).hasClass("medium")){
                    $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                }
                else if($(element).hasClass("pvp")){
                    $(".score").text("No scores in this mode!");
                }
                
                $(".row button").removeClass("active");
                $(element).addClass("active");
                $(".line").css("display", "none");
                restart();
            }
            else if(gameEnded == false && botMove == false && win == true){
                var question = prompt("You will automaticly lose, do you want to resign now? only yes/no");
                if(question == "yes"){
                    if($(element).hasClass("easy")){
                        $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                    }
                    else if($(element).hasClass("medium")){
                        $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                    }
                    else if($(element).hasClass("pvp")){
                        $(".score").text("No scores in this mode!");
                    }
                    
                    if($(".easy").hasClass("active")){
                        easyScores[1]+=1; 
                        $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                        localStorage.easy = JSON.stringify(easyScores);
                    }
                    else if($(".medium").hasClass("active")){
                        medScores[1]+=1; 
                        $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                        localStorage.med = JSON.stringify(medScores);
                    }
                    $(".row button").removeClass("active");
                    $(element).addClass("active");
                    if($(element).hasClass("easy")){
                        $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                    }
                    else if($(element).hasClass("medium")){
                        $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                    }
                    else if($(element).hasClass("pvp")){
                        $(".score").text("No scores in this mode!");
                    }
                    restart();
                }
                else if(question != "no"){
                    alert("Invalid choise, be correct.");
                }
            }
        }
    }
}

function delay(callback, delay){
    setTimeout(callback, delay);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkWin(){
    for(var i = 0; i < win_arr.length; i++){
        if(win_arr[i][0] == win_arr[i][1] && win_arr[i][1] == win_arr[i][2] && win_arr[i][0] == "x"){
            winx();
            gameEnded = true;
            if($(".easy").hasClass("active")){
                easyScores[0]+=1; 
                $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                localStorage.easy = JSON.stringify(easyScores);
            }
            else if($(".medium").hasClass("active")){
                medScores[0]+=1; 
                $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                localStorage.med = JSON.stringify(medScores);
            }
            
            var margin = 12 * i + 6;
            $(".line").css({"display": "block", "margin-top": margin + "vw", "width": "36vw", "height": "4px", "left": "0", "transform": "rotate(0deg)"});
            return;
        }
        else if(win_arr[0][i] == win_arr[1][i] && win_arr[1][i] == win_arr[2][i] && win_arr[0][i] == "x"){
            winx();
            gameEnded = true;
            if($(".easy").hasClass("active")){
                easyScores[0]+=1; 
                $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                localStorage.easy = JSON.stringify(easyScores);
            }
            else if($(".medium").hasClass("active")){
                medScores[0]+=1; 
                $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                localStorage.med = JSON.stringify(medScores);
            }
            
            var margin = 12 * i + 6;
            $(".line").css({"display": "block", "left": margin + "vw", "width": "4px", "height": "36vw", "margin-top": "0", "transform": "rotate(0deg)"});
            return;
        }
        else if(win_arr[i][0] == win_arr[i][1] && win_arr[i][1] == win_arr[i][2] && win_arr[i][0] == "0"){
            win0();
            gameEnded = true;
            if($(".easy").hasClass("active")){
                easyScores[1]+=1; 
                $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                localStorage.easy = JSON.stringify(easyScores);
            }
            else if($(".medium").hasClass("active")){
                medScores[1]+=1; 
                $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                localStorage.med = JSON.stringify(medScores);
            }
            
            var margin = 12 * i + 6;
            $(".line").css({"display": "block", "margin-top": margin + "vw", "width": "36vw", "height": "4px", "left": "0", "transform": "rotate(0deg)"});
            return;
        }
        else if(win_arr[0][i] == win_arr[1][i] && win_arr[1][i] == win_arr[2][i] && win_arr[0][i] == "0"){
            win0();
            gameEnded = true;
            if($(".easy").hasClass("active")){
                easyScores[1]+=1; 
                $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                localStorage.easy = JSON.stringify(easyScores);
            }
            else if($(".medium").hasClass("active")){
                medScores[1]+=1; 
                $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                localStorage.med = JSON.stringify(medScores);
            }
            
            var margin = 12 * i + 6;
            $(".line").css({"display": "block", "left": margin + "vw", "width": "4px", "height": "36vw", "margin-top": "0", "transform": "rotate(0deg)"});
            return;
        }
    }
    if(((win_arr[0][0] == win_arr[1][1] && win_arr[1][1] == win_arr[2][2]) && win_arr[0][0] == "x")
        || (win_arr[0][2] == win_arr[1][1] && win_arr[1][1] == win_arr[2][0]) && win_arr[0][2] == "x"){
        winx();
        gameEnded = true;
        if($(".easy").hasClass("active")){
            easyScores[0]+=1; 
            $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
            localStorage.easy = JSON.stringify(easyScores);
        }
        else if($(".medium").hasClass("active")){
            medScores[0]+=1; 
            $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
            localStorage.med = JSON.stringify(medScores);
        }
        
        if((win_arr[0][0] == win_arr[1][1] && win_arr[1][1] == win_arr[2][2]) && win_arr[0][0] == "x"){
            var width = Math.sqrt(2) * 36 - 0.7;
            $(".line").css({"display": "block", "left": "-7vw", "margin-top": "18vw", "width": width + "vw", "height": "4px", "transform": "rotate(45deg)"});
        }
        else if((win_arr[0][2] == win_arr[1][1] && win_arr[1][1] == win_arr[2][0]) && win_arr[0][2] == "x"){
            var width = Math.sqrt(2) * 36 - 0.7;
            $(".line").css({"display": "block", "left": "-7vw", "margin-top": "18vw", "width": width + "vw", "height": "4px", "transform": "rotate(-45deg)"});
        }
        return;
    }
    else if(((win_arr[0][0] == win_arr[1][1] && win_arr[1][1] == win_arr[2][2]) && win_arr[0][0] == "0")
        || (win_arr[0][2] == win_arr[1][1] && win_arr[1][1] == win_arr[2][0]) && win_arr[0][2] == "0"){
        win0();
        gameEnded = true;
        if($(".easy").hasClass("active")){
            easyScores[1]+=1; 
            $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
            localStorage.easy = JSON.stringify(easyScores);
        }
        else if($(".medium").hasClass("active")){
            medScores[1]+=1; 
            $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
            localStorage.med = JSON.stringify(medScores);
        }
        
        if((win_arr[0][0] == win_arr[1][1] && win_arr[1][1] == win_arr[2][2]) && win_arr[0][0] == "0"){
            var width = Math.sqrt(2) * 36 - 0.7;
            $(".line").css({"display": "block", "left": "-7vw", "margin-top": "18vw", "width": width + "vw", "height": "4px", "transform": "rotate(45deg)"});
        }
        else if((win_arr[0][2] == win_arr[1][1] && win_arr[1][1] == win_arr[2][0]) && win_arr[0][2] == "0"){
            var width = Math.sqrt(2) * 36 - 0.7;
            $(".line").css({"display": "block", "left": "-7vw", "margin-top": "18vw", "width": width + "vw", "height": "4px", "transform": "rotate(-45deg)"});
        }
        return;
    }
    else{
        var n = 0;
        for(var i = 0; i < win_arr.length; i++){
            for(var j = 0; j < win_arr[i].length; j++){
                if(win_arr[i][j] != ""){
                    n+=1;
                    if(n == 9){
                        if($(".easy").hasClass("active")){
                            easyScores[0]+=0.5;
                            easyScores[1]+=0.5;
                            $(".score").text("Scores: " + easyScores[0] + " - " + easyScores[1]);
                            localStorage.easy = JSON.stringify(easyScores);
                        }
                        else if($(".medium").hasClass("active")){
                            medScores[0]+=0.5;
                            medScores[1]+=0.5;
                            $(".score").text("Scores: " + medScores[0] + " - " + medScores[1]);
                            localStorage.med = JSON.stringify(medScores);
                        }
                        draw();
                        gameEnded = true;
                        return;
                    }
                }
            }
        }
    }
}

function mediumBotMove(){
    for(var j = 0; j < win_arr.length; j++){
        //horizontal
        if(win_arr[j][0] == win_arr[j][1] && win_arr[j][0] == "0" && win_arr[j][2] == ""){
            win_arr[j][2] = "0";
            var row = $(".row").eq(j); 
            var cell = row.children().eq(2);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[j][0] == win_arr[j][2] && win_arr[j][0] == "0" && win_arr[j][1] == ""){
            win_arr[j][1] = "0";
            var row = $(".row").eq(j); 
            var cell = row.children().eq(1);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[j][1] == win_arr[j][2] && win_arr[j][1] == "0" && win_arr[j][0] == ""){
            win_arr[j][0] = "0";
            var row = $(".row").eq(j); 
            var cell = row.children().eq(0);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        //vertical
        else if(win_arr[0][j] == win_arr[1][j] && win_arr[0][j] == "0" && win_arr[2][j] == ""){
            win_arr[2][j] = "0";
            var row = $(".row").eq(2); 
            var cell = row.children().eq(j);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[0][j] == win_arr[2][j] && win_arr[0][j] == "0" && win_arr[1][j] == ""){
            win_arr[1][j] = "0";
            var row = $(".row").eq(1); 
            var cell = row.children().eq(j);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[1][j] == win_arr[2][j] && win_arr[1][j] == "0" && win_arr[0][j] == ""){
            win_arr[0][j] = "0";
            var row = $(".row").eq(0); 
            var cell = row.children().eq(j);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        //diagonal
        else if(win_arr[0][0] == win_arr[1][1] && win_arr[0][0] == "0" && win_arr[2][2] == ""){
            win_arr[2][2] = "0";
            var row = $(".row").eq(2); 
            var cell = row.children().eq(2);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[0][0] == win_arr[2][2] && win_arr[0][0] == "0" && win_arr[1][1] == ""){
            win_arr[1][1] = "0";
            var row = $(".row").eq(1); 
            var cell = row.children().eq(1);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[1][1] == win_arr[2][2] && win_arr[1][1] == "0" && win_arr[0][0] == ""){
            win_arr[0][0] = "0";
            var row = $(".row").eq(0); 
            var cell = row.children().eq(0);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        //other diagonal
        else if(win_arr[0][2] == win_arr[1][1] && win_arr[0][2] == "0" && win_arr[2][0] == ""){
            win_arr[2][0] = "0";
            var row = $(".row").eq(2); 
            var cell = row.children().eq(0);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[0][2] == win_arr[2][0] && win_arr[0][2] == "0" && win_arr[1][1] == ""){
            win_arr[1][1] = "0";
            var row = $(".row").eq(1); 
            var cell = row.children().eq(1);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[1][1] == win_arr[2][0] && win_arr[1][1] == "0" && win_arr[0][2] == ""){
            win_arr[0][2] = "0";
            var row = $(".row").eq(0); 
            var cell = row.children().eq(2);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
    }
    //check losing
    for(var j = 0; j < win_arr.length; j++){
        //horizontal
        if(win_arr[j][0] == win_arr[j][1] && win_arr[j][0] == "x" && win_arr[j][2] == ""){
            win_arr[j][2] = "0";
            var row = $(".row").eq(j); 
            var cell = row.children().eq(2);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[j][0] == win_arr[j][2] && win_arr[j][0] == "x" && win_arr[j][1] == ""){
            win_arr[j][1] = "0";
            var row = $(".row").eq(j); 
            var cell = row.children().eq(1);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[j][1] == win_arr[j][2] && win_arr[j][1] == "x" && win_arr[j][0] == ""){
            win_arr[j][0] = "0";
            var row = $(".row").eq(j); 
            var cell = row.children().eq(0);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        //vertical
        else if(win_arr[0][j] == win_arr[1][j] && win_arr[0][j] == "x" && win_arr[2][j] == ""){
            win_arr[2][j] = "0";
            var row = $(".row").eq(2); 
            var cell = row.children().eq(j);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[0][j] == win_arr[2][j] && win_arr[0][j] == "x" && win_arr[1][j] == ""){
            win_arr[1][j] = "0";
            var row = $(".row").eq(1); 
            var cell = row.children().eq(j);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[1][j] == win_arr[2][j] && win_arr[1][j] == "x" && win_arr[0][j] == ""){
            win_arr[0][j] = "0";
            var row = $(".row").eq(0); 
            var cell = row.children().eq(j);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        //diagonal
        else if(win_arr[0][0] == win_arr[1][1] && win_arr[0][0] == "x" && win_arr[2][2] == ""){
            win_arr[2][2] = "0";
            var row = $(".row").eq(2); 
            var cell = row.children().eq(2);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[0][0] == win_arr[2][2] && win_arr[0][0] == "x" && win_arr[1][1] == ""){
            win_arr[1][1] = "0";
            var row = $(".row").eq(1); 
            var cell = row.children().eq(1);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[1][1] == win_arr[2][2] && win_arr[1][1] == "x" && win_arr[0][0] == ""){
            win_arr[0][0] = "0";
            var row = $(".row").eq(0); 
            var cell = row.children().eq(0);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        //other diagonal
        else if(win_arr[0][2] == win_arr[1][1] && win_arr[0][2] == "x" && win_arr[2][0] == ""){
            win_arr[2][0] = "0";
            var row = $(".row").eq(2); 
            var cell = row.children().eq(0);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[0][2] == win_arr[2][0] && win_arr[0][2] == "x" && win_arr[1][1] == ""){
            win_arr[1][1] = "0";
            var row = $(".row").eq(1); 
            var cell = row.children().eq(1);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
        else if(win_arr[1][1] == win_arr[2][0] && win_arr[1][1] == "x" && win_arr[0][2] == ""){
            win_arr[0][2] = "0";
            var row = $(".row").eq(0); 
            var cell = row.children().eq(2);
            cell.append("<div class = 'tac'></div>");
            botMove = false;
            return;
        }
    }
    var n = getRandomInt(0, 2);
    var m = getRandomInt(0, 2);
    while(win_arr[n][m] != ""){
        n = getRandomInt(0, 2);
        m = getRandomInt(0, 2);
    }
    win_arr[n][m] = "0";
    var row = $(".row").eq(n); 
    var cell = row.children().eq(m);
    cell.append("<div class = 'tac'></div>");
    
    //will bot win?
    botMove = false;
    return;
}

function restart(){
    move = "x";
    gameEnded = false;
    $(".container").find(".tac, .tic").each(function(index, elem){
        $(elem).remove();
    });
    for(var i = 0; i < win_arr.length; i++){
        for(var j = 0; j < win_arr[i].length; j++){
            win_arr[i][j] = "";
        }
    }
}

function winx(){
    var message = $("<div class='winx'>X won!</div>");
    $('main').append(message);

    message.fadeIn(500);

    setTimeout(function() {
        message.fadeOut(500, function() {
            $(this).remove();
        });
    }, 2000);
}

function win0(){
    var message = $('<div class="win0">0 won!</div>');
    $('main').append(message);

    message.fadeIn(500);

    setTimeout(function() {
        message.fadeOut(500, function() {
            $(this).remove();
        });
    }, 2000);
}

function draw(){
    var message = $('<div class="draw">draw!</div>');
    $('main').append(message);

    message.fadeIn(500);

    setTimeout(function() {
        message.fadeOut(500, function() {
            $(this).remove();
        });
    }, 2000);
}