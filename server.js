const http   = require('http');
const url    = require('url');
const fetch  = require('node-fetch');

const game = require('./game.js');
const server = http.createServer(function(request, response){
  const parseUrl = url.parse(request.url, true);
  let data = '';
  request
    .on('data', chunk => {data+=chunk;})
    .on('end', () => {
      if (request.method == 'GET' && parseUrl.pathname == '/update') {
        game.update(request, response, parseUrl);
      }
      else if(request.method == 'POST'){
        data = JSON.parse(data);
        console.log(JSON.stringify(data));
        switch(parseUrl.pathname){
          case '/register':
            game.register(data, response);
          break;
          case '/join':
            game.join(data, response);
          break;
          case '/leave':
            game.leave(data, response);
          break;
          case '/notify':
            game.notify(data, response);
          break;
          case '/ranking':
            game.ranking(data, response);
          break;
          default:
            game.error(data, response);
          break;
        }
      }
      else{
        game.error(request, response);
        response.end();
      }
    })
    .on('error', (err) => {
      console.log(err.message);
      response.writeHead(500, header);
      response.write('error');
      response.end();
    });
});

server.listen(8888);
