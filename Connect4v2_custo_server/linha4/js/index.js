var history_loaded = false;

$luc('.close-pop-up').click(function(){
	$luc(this).parent().parent().animation({'opacity': '0'}, 500);
	setTimeout(function(p){p.style('display', '')}, 500,$luc(this).parent().parent());
});

$luc('#login-card').style('display', 'block');

// *************** GAME OPTIONS ***************
$luc('.pop-up-btn-expandable').mouseOver(function(){
	$luc(this).animation({'height': '300px'}, 500);
	$luc(this).parent().animation({'marginTop':'-90px'}, 500);
	if(!history_loaded)
		loadHistory();
	history_loaded = true;
}).mouseLeave(function(){
	$luc(this).animation({'height': ''}, 500);
	$luc(this).parent().animation({'marginTop':''}, 500);
	history_loaded = false;
});

// *************** MENU ***************
$luc('.fakeStart').click(fakeStart);
function flipCardFunc(obj_id){
	if(user_name!='' || obj_id=='new-login-card')
		flipCard(obj_id);
	else
		flipCard('login-card');
}
function gameDifficulty(d, t){
	depthLimit = eval(d);
	t = $luc(t);
	$luc('.game-difficulty').style('borderColor', '#7f8c8d');
	t.style('borderColor', '#c0392b');
}
	// setando o jogo com dificuldade normal
$luc('.game-difficulty').elements[1].element.click();
// $luc('.initField').click(initField);
$luc('.surrender').click(function(){
	if(newGame){
	game_history.push({'player': 'SURRENDER', 
		'diff': (depthLimit==EASY)?'EASY':(depthLimit==NORMAL)?'NORMAL':'HARD', 
		'row':  document.getElementById("row").value, 
		'col': document.getElementById("col").value});
	}
	initField();
});

function gameType(gt, t){
	game_tipe=eval(gt);
	$luc('.game-type').style('borderColor', '');
	$luc(t).style('borderColor', '#e74c3c');
}
$luc('.game-type').elements[0].element.click();


// ***************CREATE USER / LOGIN******************

$luc('.login-button-confirm').click(function(){
	user_name = $luc(this).parent().parent().children('.menu-login-container').children('.menu-login-input').elements[0].element['value'];
	console.log(user_name);
	if(user_name!='')
		flipCard('confirm-pop-up-card');
	else
		loadTextMessagePopUp('You have entered an invalid username or password');
});

