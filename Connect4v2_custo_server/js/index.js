flipCard('login-card');

$luc('.close-pop-up').click(function(){
	$luc(this).parent().parent().animation({'opacity': '0'}, 500);
	setTimeout(function(p){p.style('display', '')}, 500,$luc(this).parent().parent());
});

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
$luc('.fakeStart').click(gameStart);

function flipCardFunc(obj_id){
	if(pvp){
		$luc('.pvp_off').style('display','none');

	}
	else{
		$luc('.pvp_off').style('display','');

	}

	if(nick!='' || obj_id=='new-login-card')
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
	if(pvp){
		leave();
		flipCard('menu-card');
	}
	else{
		if(newGame){
		game_history.push({'player': 'SURRENDER',
			'diff': (depthLimit==EASY)?'EASY':(depthLimit==NORMAL)?'NORMAL':'HARD',
			'row':  document.getElementById("row").value,
			'col': document.getElementById("col").value});
		}
		webStorage.saveGameStatus(nick, JSON.stringify({'game_history': game_history}));
		initField();
	}
});

// ***************START GAME******************
function gameStart() {
    let row_el = document.getElementById("row");
    let col_el = document.getElementById("col");

    //ENTREGA2 - PEDIDOS
    if(pvp)
      join();

    game_tipe = !pvp;

    if(isNaN(row_el.value) || (row_el.value < 4 && row_el.value > 10)) {
        row_el.style.color = 'red';
    }
    if(isNaN(col_el.value) || (col_el.value < 4 && col_el.value > 10)) {
        col_el.style.color = 'red';
    }
    else
        // row_el.style.color = 'black';
        initField();
}

// ***************CREATE USER / LOGIN******************

$luc('.login-button-confirm').click(function(){
	nick = document.getElementById('menu-login-email').value;
	pass = document.getElementById('menu-login-password').value;

	if(nick!='' && pass !='')
		register();
	else
		loadTextMessagePopUp('ERROR: Username or password is empty!');
});

function loadRanking(rank){
	let  t = document.getElementById('ranking-table');
	t.innerHTML = "<tr><th>NICK</th><th>VICTORIES.</th><th>GAMES</th></tr>";
	setTimeout(()=>{
		for(let i in rank){
				let r = rank[i];
				let c, new_r;
				new_r = document.createElement('tr');
				c = new_r.insertCell(0);
				c.innerHTML = r.nick;
				c = new_r.insertCell(1);
				c.innerHTML = r.victories;
				c = new_r.insertCell(2);
				c.innerHTML = r.games;
				t.appendChild(new_r, t.children[1]);
		}
	}, 0);
}

function returnSettings(){
	leave();
	flipCard('config-card');
}
