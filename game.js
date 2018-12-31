const crypto = require('crypto');
const update = require('./update.js');
const fs = require('fs');
const secret = 'lucTWproject';
// const path = require('path');
const data_path = 'data.json';

function checkDataBase(){
  try {
    if (!fs.existsSync(data_path)) {

      fs.writeFileSync(data_path, '{"groups":{},"ranking":{}}', { flag: 'w+'},function (err) {
        if (err) throw err;
      });

      // fs.open(data_path, 'w', function (err, file) {
      //   if (err) throw err;
      // });
      // console.log('Created file');
      // let d = {
      //   'groups':{},
      //   'ranking':{}
      // }
      // updateDataBase(d);
    }
  } catch (err){
    console.error(err);
  }
}

function updateDataBase(data){
    fs.writeFile(data_path, '', { flag: 'w+'},function (err) {
      if (err) throw err;
      fs.writeFile(data_path, JSON.stringify(data), { flag: 'w+'},function (err) {
        if (err) throw err;
        console.log('update file');
      });
    });
}


const header =  {'POST': {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'},
                 'SSE':  {'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*', 'Connection': 'keep-alive'}
                };

// --------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports.register = function(data_request, response){
    checkDataBase();
    fs.readFile(data_path, (err,data) => {
      if(!err) {
        let d = JSON.parse(data.toString());
        if(!data_request.nick || !data_request.pass || !data_request.group || Object.keys(data_request).length != 3){
          console.log('bad request');
          badRequestError(data_request, response);
          return;
        }

        if(!d.groups[data_request.group])
          d.groups[data_request.group] = {'games':{}, 'nicks':{}};

        if(d.groups[data_request.group].nicks[data_request.nick]){
          if( d.groups[data_request.group].nicks[data_request.nick].pass  == crypto.createHmac('sha256', secret).update( data_request.pass).digest('hex')){
            response.writeHead(200, header.POST);
            response.write('login');
            console.log('login success');
          }
          else{
            console.log('login fail');
            badRequestError(data_request, response);
          }
          response.end();
        }
        else{
          response.writeHead(200, header.POST);
          response.write('register && login');
          console.log('register success')
          d.groups[data_request.group].nicks[data_request.nick] = {'pass':crypto.createHmac('sha256', secret).update( data_request.pass ).digest('hex'), 'num_games': 0};

          updateDataBase(d);
          response.end();
        }
      }
    });
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports.join = function(data_request, response){
  checkDataBase();
  fs.readFile(data_path, (err,data) => {
    if(!err) {
      let d = JSON.parse(data.toString());
      if( !data_request.group || !data_request.nick || !data_request.pass || !data_request.size || Object.keys(data_request).length != 4){
        console.log('bad request');
        badRequestError(data_request, response);
        return;
      }

      d.groups[data_request.group].nicks[data_request.nick].num_games++;
      for(let i in d.groups[data_request.group].games){
        if(d.groups[data_request.group].games[i].size.rows == data_request.size.rows && d.groups[data_request.group].games[i].size.columns == data_request.size.columns && !d.groups[data_request.group].games[i].nick2){
          if(d.groups[data_request.group].games[i].nick1 == data_request.nick){
            response.writeHead(200, header.POST);
            response.write('{"game": "'+i+'"}');
            response.end();
            console.log('reload game && join');
            return;
          }


          d.groups[data_request.group].games[i].nick2 = data_request.nick;
          // console.log(JSON.stringify(responses));
          response.writeHead(200, header.POST);
          response.write('{"game": "'+i+'"}');
          response.end();
          console.log('join success');
          updateDataBase(d);
          return;
        }
      }

      let hash = crypto.createHmac('sha256', secret).update((Math.random()+'')).digest('hex');
      let board = [];

      for (var i = 0; i < data_request.size.columns; i++) {
        board[i]=[];
        for (var j = 0; j < data_request.size.rows; j++) {
          board[i][j]='-';
        }
      }
      d.groups[data_request.group].games[hash] = {'nick1': data_request.nick, 'size': {'rows': data_request.size.rows, 'columns': data_request.size.columns}, 'board': board, 'turn': data_request.nick};
      response.writeHead(200, header.POST);
      response.write('{"game": "'+hash+'"}');
      console.log('create game && join')

      updateDataBase(d);
      response.end();
    }
  });
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports.leave = function(data_request, response){
  checkDataBase();
  fs.readFile(data_path, (err,data) => {
    if(!err) {
      let d = JSON.parse(data.toString());
      if( !data_request.group || !data_request.nick || !data_request.pass || !data_request.game || Object.keys(data_request).length != 4){
        console.log('bad request');
        badRequestError(data_request, response);
        return;
      }
      response.writeHead(200, header.POST);

      if(typeof !d.groups[data_request.group].games[data_request.game].nick2!== 'undefined'){
        console.log('leave success1');
        delete d.groups[data_request.group].games[data_request.game];
        updateDataBase(d);
        response.end();
        // update.close(data_request.game, 0);
        return;
      }

      let rank_key = d.groups[data_request.group].games[data_request.game].size.columns+''+d.groups[data_request.group].games[data_request.game].size.rows;

      if(!d.ranking[rank_key])
        d.ranking[rank_key] = {};


      if(data_request.nick == d.groups[data_request.group].games[data_request.game].nick1){
        update.update(data_request.game, '{ "winner": "'+d.groups[data_request.group].games[data_request.game].nick2+'" } ');
        if(!d.ranking[rank_key][data_request.group + '' +d.groups[data_request.group].games[data_request.game].nick2])
          d.ranking[rank_key][data_request.group + '' +d.groups[data_request.group].games[data_request.game].nick2] = {'group':data_request.group,'nick':d.groups[data_request.group].games[data_request.game].nick2, 'num_win': 0};
        d.ranking[rank_key][data_request.group + '' +d.groups[data_request.group].games[data_request.game].nick2].num_win++;

      }
      else{
        update.update(data_request.game, '{ "winner": "'+d.groups[data_request.group].games[data_request.game].nick1+'" } ');
        if(!d.ranking[rank_key][data_request.group + '' +d.groups[data_request.group].games[data_request.game].nick1])
          d.ranking[rank_key][data_request.group + '' +d.groups[data_request.group].games[data_request.game].nick1] = {'group':data_request.group,'nick':d.groups[data_request.group].games[data_request.game].nick1, 'num_win': 0};
        d.ranking[rank_key][data_request.group + '' +d.groups[data_request.group].games[data_request.game].nick1].num_win++;

      }

      console.log('leave success');
      d.groups[data_request.group].games[data_request.game].nick2 = data_request.nick;
      delete d.groups[data_request.group].games[data_request.game];
      updateDataBase(d);
      response.end();
      return;
      }
  });
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------
function playColumn(d, data_request){
  for (let i = d.groups[data_request.group].games[data_request.game].size.rows-1; i >=0; i--) {
    if(d.groups[data_request.group].games[data_request.game].board[data_request.column][i]=='-'){
      d.groups[data_request.group].games[data_request.game].board[data_request.column][i]=data_request.nick;
      d.groups[data_request.group].games[data_request.game].turn=(d.groups[data_request.group].games[data_request.game].nick1 == d.groups[data_request.group].games[data_request.game].turn)?d.groups[data_request.group].games[data_request.game].nick2:d.groups[data_request.group].games[data_request.game].nick1;
      updateDataBase(d);
      return true;
    }
  }
  return false;
}

function checkEndGame(d, data_request){
  let board = d.groups[data_request.group].games[data_request.game].board;
  let num_columns  = d.groups[data_request.group].games[data_request.game].size.columns;
  let num_rows     = d.groups[data_request.group].games[data_request.game].size.rows;

  data_request.column = parseInt(data_request.column);

  for(let i=0; i<num_rows; i++){
    if(board[data_request.column][i]!='-'){
      let cont_hori = 0, cont_vert = 0, cont_dia1 = 0, cont_dig2 = 0;
      let user_nick = board[data_request.column][i];

      for (var j = -3; j <0; j++) {
        cont_hori = (data_request.column + j >= 0 && board[data_request.column+j][i]   == user_nick)? cont_hori+1: 0;
        // cont_vert = (data_request.column + j >= 0 && i + j >= 0 && board[data_request.column][i+j]   == user_nick)? cont_vert+1: 0;
        cont_dia1 = (data_request.column + j >= 0 && i + j >= 0 && board[data_request.column+j][i+j] == user_nick)? cont_dia1+1: 0;
        cont_dig2 = (data_request.column + j >= 0 && i - j < num_rows && board[data_request.column+j][i]     == user_nick)? cont_dig2+1: 0;
      }

      for (var j = 0; j < 4; j++) {
        // console.log("testando data_request + j ---------------->       "+data_request.column + j);
        cont_hori = ( cont_hori!==false && data_request.column + j < num_columns && board[data_request.column + j][i] == user_nick)? cont_hori+1: false;
        cont_vert = ( cont_vert!==false && i + j < num_rows && board[data_request.column][i+j]   == user_nick)? cont_vert+1: false;
        cont_dia1 = ( cont_dia1!==false && data_request.column + j < num_columns && i + j < num_rows && board[data_request.column+j][i+j] == user_nick)? cont_dia1+1: false;
        cont_dig2 = ( cont_dig2!==false && data_request.column + j < num_columns && i - j >= 0 && board[data_request.column+j][i-j] == user_nick)? cont_dig2+1: false;
        console.log('cont_dig2=>' + cont_dig2);

        if( ((cont_hori)&&(cont_hori==4))||((cont_vert)&&(cont_vert==4))||((cont_dia1)&&(cont_dia1==4))||((cont_dig2)&&(cont_dig2==4)) ){
          let rank_key = d.groups[data_request.group].games[data_request.game].size.columns+''+d.groups[data_request.group].games[data_request.game].size.rows;

          if(!d.ranking[rank_key])
            d.ranking[rank_key] = {};


          if(!d.ranking[rank_key][data_request.group + '' +data_request.nick])
            d.ranking[rank_key][data_request.group + '' +data_request.nick] = {'group':data_request.group,'nick':data_request.nick, 'num_win': 0};
          d.ranking[rank_key][data_request.group + '' +data_request.nick].num_win++;
          delete d.groups[data_request.group].games[data_request.game];
          updateDataBase(d);

          return true;
        }
      }
      return false;
    }
  }
  return false;
}


module.exports.notify = function(data_request, response){
  checkDataBase();
  fs.readFile(data_path, (err,data) => {
    if(!err) {
      let d = JSON.parse(data.toString());
      if( !data_request.group || !data_request.nick || !data_request.pass || !data_request.game || typeof data_request.column === 'undefined' || Object.keys(data_request).length != 5){
        console.log('bad request1');
        badRequestError(data_request, response);
        return;
      }

      if(data_request.column>=d.groups[data_request.group].games[data_request.game].size.column || data_request.column<0){
        // jogada fora do escopo
        console.log('bad request2');
        badRequestError(data_request, response, '{ "error": "Column reference is negative" }');
        return;
      }

      if(d.groups[data_request.group].games[data_request.game].turn != data_request.nick){
        // nao é o turno
        console.log('bad request3');
        badRequestError(data_request, response, '{ "error": "Not your turn to play" } ');
        return;
      }

      if(!d.groups[data_request.group].games[data_request.game].nick2){
        // tentou jogar quando ainda nao tem um oponente
        console.log('bad request4');
        badRequestError(data_request, response);
        return;
      }

      if(!playColumn(d, data_request)){
        // coluna cheia
        console.log('bad request5');
        badRequestError(data_request, response, '{ "error": "Column reference is negative" }');
        return;
      }

      let message;
      let board = d.groups[data_request.group].games[data_request.game].board;
      if(checkEndGame(d, data_request)){
        message = { "winner": data_request.nick, "board": board, 'column': data_request.column};
        update.update(data_request.game, JSON.stringify(message));


        // update.close(data_request.game);
      }
      else{
        message = { "turn": (d.groups[data_request.group].games[data_request.game].nick1 == data_request.nick)?d.groups[data_request.group].games[data_request.game].nick2:d.groups[data_request.group].games[data_request.game].nick1, "board":  d.groups[data_request.group].games[data_request.game].board, 'column': data_request.column};
        update.update(data_request.game, JSON.stringify(message));
    }

      response.writeHead(200, header.POST);
      response.write('notify');
      response.end();
      console.log('notify success');
      return;
      }
  });
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports.update = function(request, response, parseUrl){

  checkDataBase();
  console.log('update success');
  fs.readFile(data_path, (err,data) => {
    if(!err) {
      let d = JSON.parse(data.toString());
      var query = parseUrl.query;
      if( !query.group || !query.nick || !query.game || Object.keys(query).length != 3){
        console.log('bad request');
        badRequestError(request, response);
        return;
      }

      request.on('close',(data_request, fs, query)=>{
        let new_data = update.close(data_request, fs, query);
        if(new_data)
          updateDataBase(d);
      });

      response.writeHead(200, header.SSE);
      update.save(query.game, response);

      // if have two players send message
      if(update.checkGameStart(query.game))
        update.update(query.game, JSON.stringify({ "turn": d.groups[query.group].games[query.game].turn, "board": d.groups[query.group].games[query.game].board } ));
    }
  });
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------
// {"size": { "rows": 6, "columns": 7 } }

module.exports.ranking = function(data_request, response){
  checkDataBase();
  fs.readFile(data_path, (err,data) => {
    if(!err) {
      if( !data_request.size || Object.keys(data_request).length != 1){
        console.log('bad request');
        badRequestError(data_request, response);
        return;
      }

      console.log('ranking success');

      let d = JSON.parse(data.toString());
      let size = data_request.size.columns+''+data_request.size.rows;
      let NULL_NAME = crypto.createHmac('sha256', secret).update(Math.random()+'').digest('hex');
      let rank = new Array(11).fill({"group": NULL_NAME, "nick": NULL_NAME,"num_win":-1});

      for(let r in d.ranking[size]){
        for(let i=rank.length-2; i>=0 && rank[i].num_win<d.ranking[size][r].num_win; i--){
          rank[i+1] = rank[i];
          rank[i] = d.ranking[size][r];
        }
      }

      // { "ranking": [{"nick":"jpleal","victories":2,"games":2},{"nick":"zp","victories":0,"games":2}] }

      // console.log(rank);

      let rank_response = [];
      for(let i=0; i<10; i++)
        if(rank[i].group != NULL_NAME)
          rank_response.push({"nick":rank[i].nick,"victories":rank[i].num_win,"games":d.groups[rank[i].group].nicks[rank[i].nick].num_games});

      response.writeHead(200, header.POST);
      response.write(JSON.stringify({'ranking':rank_response}));
      response.end();
      }
  });
}
// --------------------------------------------------------------------------------------------------------------------------------------------------------
module.exports.error = function(data_request, response){
 badRequestError(data_request, response);
 checkDataBase();
}

function badRequestError(data_request, response, msg){
  response.writeHead(404, header.POST);
  response.end(msg);

}
