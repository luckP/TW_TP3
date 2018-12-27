const URL = 'http://localhost:8888/';
// const URL = 'http://twserver.alunos.dcc.fc.up.pt:8008/';
var room;

// var aiBot = true;
var aiTurn = false;
var game_history = [];
var nick = '';
var pass = '';
const group = 47453;
var game_start = false;
// var newGame="false";
var game_type = true;//true=> player vs player, false=> player vs bot
var game_pedido;
var responde_pedido = {}
var pvp = false;
var eventSource;
var winning_player;

var history_loaded = false;

var webStorage;
var play_history = [];
var wait = true;
