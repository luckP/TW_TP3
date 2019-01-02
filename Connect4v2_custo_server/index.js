const http   = require('http');
const url    = require('url');
const fetch  = require('node-fetch');
const fs     = require('fs');
const conf   = require('./conf.js');

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
      else if(request.method == 'GET'){
        if(parseUrl.pathname == '/')
          parseUrl.pathname = '/index.html';
        doGetPathname(parseUrl.pathname, response);
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

server.timeout = 120000;
server.listen(conf.port);


function getMediaType(pathname) {
  const pos = pathname.lastIndexOf('.');
  let mediaType;
  if(pos !== -1)
   mediaType = conf.mediaTypes[pathname.substring(pos+1)];
  if(mediaType === undefined)
    mediaType = 'text/plain';
  return mediaType;
}

function isText(mediaType) {
  if(mediaType.startsWith('image'))
    return false;
  else
    return true;
}

function doGetPathname(pathname,response){
  const mediaType = getMediaType(pathname);
  const encoding = isText(mediaType) ? "utf8" : null;
  fs.readFile('.'+pathname,encoding,(err,data) => {
    if(err) {
      response.writeHead(404);
      // Not Found
      console.log('error');
      console.log(mediaType);
      response.end();
    }
    else {
      response.writeHead(200, { 'Content-Type': mediaType });
      response.end(data);
    }
  });
}
