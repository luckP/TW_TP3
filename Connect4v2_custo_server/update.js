var responses = {};

module.exports.responses = function(){
  return responses;
}

module.exports.checkGameStart = function(game){
  return (responses[game].length==2);
}

module.exports.save = function(game, response){
  if(!responses[game])
    responses[game]  = [response];
  else
    responses[game].push(response);

}

module.exports.update = function(game, message){
  for(r of responses[game])
    r.write('data: '+ message+'\n\n');
}

module.exports.close = function(game, code){
  // console.log('close');
  // responses[game][code].end();

  // if(responses[game].length == 0)
  //   delete responses[game];


  // for(let i in  responses[game])
  //    responses[game][i].end();
  //
  // delete responses[game];
}
