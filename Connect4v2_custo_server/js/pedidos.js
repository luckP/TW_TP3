function register(){
  // para teste: nick: asdf;  pass: asdf
  let url = URL+'register';
  let data = {'group': group, 'nick': nick, 'pass': pass};
  console.log('register');
  fetch(url,{
  method: 'POST',
  body: JSON.stringify(data)
  }).then(response=>{
    if(!response.ok)
      throw('You have entered an invalid username or password');

    flipCard('confirm-pop-up-card');
    webStorage = new WebStorage();
    reloadField();
  }
).catch(error =>{
  loadTextMessagePopUp(error);
  nick = '';
  pass = '';
});
}

 // ------------------------------------

function join(){
  let url = URL+'join';
  let data = {'group': group, 'nick': nick, 'pass': pass, 'size': {'rows': parseInt(document.getElementById('row').value), 'columns': parseInt(document.getElementById('col').value)}};
  console.log('join');
  fetch(url,{
    method: 'POST',
    body: JSON.stringify(data)
  }).then(response=>{
    if(!response.ok)
      throw('Connection Error');
    return response.json();
  }).then(j=>{
    game_pedido = j.game;
    update();
    wait = true;
    let wc = new WaitCanvas('canvas', 36, "Please Wait...");
  }).catch(error =>{
    loadTextMessagePopUp(error);

  });
}

// ------------------------------------

function leave(){
  let url = URL+'leave';
  let data ={'group': group, "nick": nick, "pass": pass, "game": game_pedido }
  console.log('leave');
  fetch(url,{
    method: 'POST',
    body: JSON.stringify(data)
    }).then(response=>{
      if(!response.ok)
        throw('Connection Error');
    }
    ).catch(error =>{
      loadTextMessagePopUp(error);
    });
}
// ------------------------------------

function notify(stc){
  let url = URL+'notify';
  let data = {'group': group, 'nick': nick, 'pass': pass, 'game': game_pedido, 'column': stc};
  console.log('notify');
  fetch(url,{
    method: 'POST',
    body: JSON.stringify(data)
    }).then(response=>{

      if(!response.ok){
        return response.json();
      }
      }
    )
    .then(j=>{
      // throw();
      if(j)
        throw(j.error);
    })
    .catch(error =>{
      loadTextMessagePopUp(error);
    });
}
// ------------------------------------

function endGame(d){
  eventSource.close();
  flipCard('menu-card');
  if(d.winner)
    loadTextMessagePopUp("Player: "+d.winner+" wins!\nWould you like to play again?", gameStart);
  else
    loadTextMessagePopUp("W.O.! You win!\nWould you like to play again?", gameStart);
  webStorage.removeData(nick);
  play_history = [];
  wait = false;

}

function update(){
  let url = URL+'update?'+'nick='+nick+'&game='+game_pedido+'&group='+group;
    eventSource = new EventSource(url);
    eventSource.onerror = function(){
      loadTextMessagePopUp("Error: Impossible to restore game status =/", flipCard('menu-card'));

    }
    eventSource.onmessage = function(event) {
        let d = JSON.parse(event.data);
        let data_size = Object.keys(d).length;
        console.log(d);
        play_history.push(d.column);
        switch (data_size) {
          case 1: //player leave
            endGame(d);
          break;
          case 2: // pair players
            document.getElementById('game-title-player2').innerHTML = 'Player2: ';
            webStorage.removeData(nick);
            play_history = [];
            wait = false;
            flipCard('game-card');
          break;
          case 3: // to play
            play(d.column, room);
            // player won
            if(d.winner){
              endGame(d);
            }
            else{
              let data = JSON.stringify({'game_history': game_history});
              webStorage.saveGameStatus(nick, data);
          }
          break;
          default:
        }

     }

}
// ------------------------------------

function ranking(){
  let url = URL+'ranking';
  let lin = parseInt(document.getElementById('ranking-settings-lin').value);
  let col = parseInt(document.getElementById('ranking-settings-col').value);
  let data = {'size': {'rows': lin, 'columns': col}};
  console.log('ranking');

  fetch(url,{
    method: 'POST',
    body: JSON.stringify(data)
    }).then(response=>{
        return response.json();
    }).then(j=>{
      loadRanking(j.ranking);
    }).catch(error=>{
      loadTextMessagePopUp(error);

    });
}
