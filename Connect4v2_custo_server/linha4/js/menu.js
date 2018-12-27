function fakeStart() {
    let row_el = document.getElementById("row");
    let col_el = document.getElementById("col");
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

function flipCard(name) {

    let temp = $luc('#'+name);
    // $luc('.card').style('display', '');
    console.log(temp);
    if(!temp.hasClass('pop-up-card'))
        $luc('.card').style('display', '');
    // else
    //     room.gameover = true;
    
    temp.style({
        'display': 'block', 
        'marginTop':'-1000px',
        'opacity':'0'
    });

    temp.animation({
        'marginTop':'',
        'opacity':''}, 500);
}

function topFunction() {
    document.getElementById('btn2').scrollTop = 0;
}

function showVal(v, id, name){
    document.getElementById(id).innerHTML = name+' - '+v;
}

function gameStart(e, d){
    startGame = d;
    let buttons = document.getElementsByClassName('game-start');
    for(let i=0; i<buttons.length; i++)
        buttons[i].style.borderColor = '#7f8c8d';
    buttons[e].style.borderColor = '#c0392b';
    // console.log(this.style);
}

function loadHistory(){
    let v, d, l, diff;
    v = d = l = 0;
    let  t = $luc('.schedule-history').elements[0].element;
    t.innerHTML = "<tr><th>PLAYER</th><th>DIFF.</th><th>ROW</th><th>COL</th></tr>";
    for(let i in game_history){
        let g = game_history[i];

        if(g.player == user_name)
            v++;
        else if(g.player == 'BOT' || g.player == 'SURRENDER')
            l++;
        else
            d++;

        let c, r;
        r = document.createElement('tr');
        c = r.insertCell(0);
        c.innerHTML = g.player;
        c = r.insertCell(1);
        c.innerHTML = g.diff;
        c = r.insertCell(2);
        c.innerHTML = g.row;
        c = r.insertCell(3);
        c.innerHTML = g.col;
        // t.appendChild(r);
        t.insertBefore(r, t.children[1]);
    }

    let sho = $luc('.schedule-header-option span').elements;
    sho[0].element.innerHTML = v;
    sho[1].element.innerHTML = d;
    sho[2].element.innerHTML = l;
}

function loadTextMessagePopUp(msg_txt, msg_btn1_func){
    let m = $luc('#pop-up-card-message');
    m.children('div').children('p').innerHTML(msg_txt);
    m.children('div').children('.close-pop-up').style('display', '');

    if(msg_btn1_func==null){
         m.children('div').children('.close-pop-up').style('display', 'none');
          m.children('div').children('.pop-up-confirm').click(function(){
            $luc(this).parent().parent().animation({'opacity': '0'}, 500);
            setTimeout(function(p){p.style('display', '')}, 500,$luc(this).parent().parent());
        });
    }
    else{
        m.children('div').children('.pop-up-confirm').click(function(){msg_btn1_func()});
    }


    flipCard('pop-up-card-message');
}

























