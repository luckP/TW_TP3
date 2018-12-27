
class Canvas{
  constructor(c, nl, nc){
    this.canvas = c;
    this.ctx = c.getContext('2d');
    this.num_lin = nl;
    this.num_col = nc;

    this.resizeWindow();
    this.board_mat = [];
  }

  drawBoll(x, y, color){
    this.ctx.beginPath();
    this.ctx.arc(x, y, (this.cel_size/2)*.75, 0, Math.PI*2, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }


  createBoard(){
    for(var i=0; i<this.num_col; i++) {
        this.board_mat[i] = [];
        for(var j=0; j<this.num_lin; j++)
          this.board_mat[i][j] = '-';
          m[i]=0;
        }
      }


  drawBoard(x, op){

    for(let i=0; i<this.num_col; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, i*this.cel_size);
        this.ctx.lineTo(this.canvas.width, i*this.cel_size);
        this.ctx.strokeStyle = "#0000ff";
        this.ctx.stroke();
        for(var j=0; j<=this.num_lin; j++){
          if(this.board_mat[i][j] == 'o')
            this.drawBoll(this.cel_size*i+this.cel_size-this.cel_size/2, this.cel_size*j-this.cel_size/2, 'red');

          else if(this.board_mat[i][j] == 'x')
            this.drawBoll(this.cel_size*i+this.cel_size-this.cel_size/2, this.cel_size*j-this.cel_size/2, 'blue');

        }
      }

      for(let i=0; i<this.num_col; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(i*this.cel_size, 0);
          this.ctx.lineTo(i*this.cel_size, this.canvas.height);
          this.ctx.strokeStyle = "#00ff00";
          this.ctx.stroke();

      }
  }

  bollAnimation(x, y, color){
    let px = this.cel_size * x + this.cel_size/2;
    // this.drawBoard(x, 0.2);
    if(turn)
      this.drawBoll(px, y, color);
    else
      this.drawBoll(px, y, color);

    y+=1+1*y/50;
    if(y<this.canvas.height  - this.cel_size*m[x]-this.cel_size/2)
      setTimeout(()=>this.bollAnimation(x, y, color), 0);
    else{
      this.drawBoll(px, this.canvas.height  - this.cel_size*m[x]-this.cel_size/2, color);
      if(color == 'blue'){
        this.board_mat[x][this.num_lin - m[x]] = 'x';
      }
      else {
        this.board_mat[x][this.num_lin - m[x]] = 'o';
      }
      if(m[x]<this.num_lin)
        m[x]++;

    }
  }

  resizeWindow(){
    let w = (window.innerWidth*0.8)/this.num_col;
    let h = (window.innerHeight*0.8)/this.num_lin;

    this.cel_size = (w<h)?w:h;

    this.canvas.width = this.cel_size*this.num_col;
    this.canvas.height = this.cel_size*this.num_lin;

    this.canvas.style.marginTop = (window.innerHeight - this.canvas.height)/2 - 50+"px";

  }

  eraseAll(){
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.fill();

    canv.drawBoard(0, 0);


  }


}





document.getElementById('board_canvas').addEventListener("click", play);
// createBoard(6,7);
function play(event){
  // tem que ter a parte window.innerWidth*0.1 devido a margem que o canvas tem que eh de 10%
  let ex = event.clientX - (window.innerWidth -canv.canvas.width)/2;
  let x = canv.cel_size;
  x = parseInt(ex/x);
  if(m[x]<canv.num_lin){

    if(turn)
      canv.bollAnimation(x, 0, 'red');
    else
      canv.bollAnimation(x, 0, 'blue');

    turn=!turn;
  }
}

var canv = new Canvas(document.getElementById('board_canvas'), 20, 20);
var m = [];
var turn = true;

window.onresize = function(){
  canv.resizeWindow();
}
canv.createBoard();

function reloadBoard(){
  canv = new Canvas(document.getElementById('board_canvas'), document.getElementById('num_lin').value, document.getElementById('num_col').value);
  canv.createBoard();

}

function eraseCanvas(){

  canv.eraseAll();
  setTimeout(function(){eraseCanvas()}, 0);
}

eraseCanvas();
