var tx, ty, ra;

class WaitCanvas{
  constructor(canvas_id, font_size, text){
    this.canvas = document.getElementById(canvas_id);
    this.ctx = this.canvas.getContext('2d');
    this.font_size = font_size;
    this.text = text;

    this.resizeWindow();
    this.waitMessage(0, true);
  }

  waitMessage(degree, bkg){
    this.canvas.width = this.w;
    this.waitMessageText();
    this.waitMessageArc(degree, bkg);
    degree++;
    if(degree>=360){
      bkg=!bkg;
      degree = 0;
    }
    if(wait)
      setTimeout(()=>{this.waitMessage(degree, bkg)}, 5);

  }

  waitMessageText(){
    this.ctx.save();

    this.ctx.font = this.font_size+"px Comic Sans MS";
    this.ctx.fillStyle = "rgb(24, 188, 156)";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.text, this.w/2, this.h/2);

    this.ctx.restore();
  }

  waitMessageArc(degree, bkg){
    this.ctx.save();

    this.ctx.translate( this.w/2, this.h/2 );
    this.ctx.rotate(-90*Math.PI/180);
    this.ctx.translate( -this.w/2, -this.h/2 );


    this.ctx.font = this.font_size+"px Comic Sans MS";
    this.ctx.beginPath();
    this.ctx.strokeStyle = (bkg)?'rgb(24, 188, 156)': 'rgb(44, 62, 80)';
    this.ctx.lineWidth = parseInt(this.ctx.font)*.25;
    this.ctx.arc(this.w/2, this.h/2, this.ctx.measureText(this.text).width*.75, 0, 2 * Math.PI);
    this.ctx.stroke();

    this.ctx.beginPath();
    // console.log(bkg);
    this.ctx.strokeStyle = (bkg)?'rgb(44, 62, 80)': 'rgb(24, 188, 156)';

    this.ctx.lineWidth = parseInt(this.ctx.font)*.25+1;
    this.ctx.arc(this.w/2, this.h/2, this.ctx.measureText(this.text).width*.75, 0, (degree/180)* Math.PI, true);
    this.ctx.stroke();

    this.ctx.restore();
  }

  resizeWindow(){
    this.w = (window.innerWidth);
    this.h = (window.innerHeight);

    this.canvas.width  = this.w;
    this.canvas.height = this.h;

    this.canvas.style.marginTop = (window.innerHeight - this.canvas.height)/2 - 50+"px";
  }
}
