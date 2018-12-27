function lucStyle(){
    let style = '';
    style += '.luc-slade{\n width: 100vw;\n height: 100vh;\n overflow: hidden;\n }\n';
    style += '\n';
    style += '.luc-slides-container{\nheight:100%;\n display: flex;\n }\n';
    style += '\n';
    style += '.luc-slide-component{\n width: 100vw;\n height: 100%;\n float: left;\n }\n';
    style += '\n';
    style += '.luc-slides-buttons-container{\n';
    // style += 'background: black;\n';
    style += 'background: transparent;\n';
    style += 'height: 20px;\n';
    // style += 'width: 100px\n;';
    style += 'position: absolute;\n';
    style += 'bottom: 20px;\n';
    style += 'left: 50vw;\n';
    style += '}\n';
    style += '\n';
    style += '.luc-slide-button{\n border: none;\n width: 15px;\n height: 15px;\n margin: 0 5px 0 0px;\n padding: 0;\n border-radius: 100%;\n background-color: red;\n transition: .5s;\n }\n';
    style += '.luc-slide-button:focus { outline: none; }';
    style += '';
    style += '.luc-slide-arrow-button {position: absolute; top: 50%;width: 30px;height: 30px;z-index: 10;background-color: red;border: none;}';
    style += '.luc-slide-arrow-left-button  {left:0;}';
    style += '.luc-slide-arrow-right-button {right:0;}';
    style += '.luc-slide-button-on-off {position:absolute; border:none; background-color: #29fa43; width:25px; height:25px; border-radius:100%; right:20px; bottom: 20px; z-index:100}';
    style += '';
    style += '';
    style += '';


    
    return style;
}

function slideAutoAnimation(e){

        if(e.attr('slide_on_off')>0){
            if(parseInt(e.attr('slide_time-check')) == 0){
                e.attr('slide_time-check', '10');

                let sc = $luc(e.children('.slide-container').elements[0].element);
                
                let slide_position = parseInt(e.attr('slide_position')[0])+1;
                if(slide_position>=sc.children('.slide').elements.length)
                slide_position = 0;
                e.attr('slide_position', slide_position);
                
                let bts = e.children('.luc-slides-buttons-container').children('.luc-slide-button');
                for(var i=0; i<bts.elements.length; i++){
                    if(bts.elements[i].attrVal('slide_move') == slide_position)
                    bts.elements[i].element.click();
                }
            }
        else{
            e.attr('slide_time-check', parseInt(e.attr('slide_time-check'))-1)
        }
    } 
          
    setTimeout(slideAutoAnimation, parseInt(e.attr('slide_time')[0])/10, e);
}

class LucComponent{
    constructor(obj_luc){
        this.obj_luc = obj_luc;
    }
    // fazer
    slide(){
        // verificar possivel erro na funcao children... ou na funcao que detecta por classe css
        for(var i in this.obj_luc.elements){

            let e = $luc(this.obj_luc.elements[i].element);
            let sc = $luc(e.children('.slide-container').elements[0].element);
            
            e.addClass('luc-slade');
            sc.addClass('luc-slides-container');
            sc.style('width', 100*sc.children('.slide').elements.length+'vw');
            sc.children('.slide').addClass('luc-slide-component');
            
            e.attr('slide_position', '0');
            e.attr('slide_on_off', '1');
            e.attr('slide_time', '5000');
            e.attr('slide_time-check', '10');
            e.append('<container class="luc-slides-buttons-container"></container>');
            e.append('<button class="luc-slide-arrow-button luc-slide-arrow-left-button"></button>');
            e.append('<button class="luc-slide-arrow-button luc-slide-arrow-right-button"></button>');
            e.append('<button class="luc-slide-button-on-off luc-slide-button-on"></button>');
            e.children('.luc-slide-button-on-off').click(function(){
                $luc(this).parent().attr('slide_on_off', parseInt($luc(this).parent().attr('slide_on_off'))*-1);
                if(parseInt($luc(this).parent().attr('slide_on_off'))<0){
                    $luc(this).rmClass('luc-slide-button-on');
                    $luc(this).addClass('luc-slide-button-off');
                }
                else{
                    $luc(this).addClass('luc-slide-button-on');
                    $luc(this).rmClass('luc-slide-button-off');   
                }
            });

            e.children('.luc-slide-arrow-left-button').click(function(){
                let e = $luc(this).parent();
                let slide_position = parseInt(e.attr('slide_position')[0])-1;
                if(slide_position<0)
                slide_position = e.children('.slide-container').children('.slide').elements.length-1;
                e.attr('slide_position', slide_position);

                let bts = e.children('.luc-slides-buttons-container').children('.luc-slide-button');
                for(var i=0; i<bts.elements.length; i++){
                    if(bts.elements[i].attrVal('slide_move') == slide_position)
                        bts.elements[i].element.click();
                }
            });

            e.children('.luc-slide-arrow-right-button').click(function(){
                let e = $luc(this).parent();
                let slide_position = parseInt(e.attr('slide_position')[0])+1;
                if(slide_position>=e.children('.slide-container').children('.slide').elements.length)
                slide_position = 0;
                e.attr('slide_position', slide_position);

                let bts = e.children('.luc-slides-buttons-container').children('.luc-slide-button');
                for(var i=0; i<bts.elements.length; i++){
                    if(bts.elements[i].attrVal('slide_move') == slide_position)
                        bts.elements[i].element.click();
                }
            });

            setTimeout((e)=>{
                e.children('.luc-slides-buttons-container').style('left', 'calc(50vw - '+e.children('.luc-slides-buttons-container').elements[0].element.offsetWidth/1.5+'px');
                 },10, e);
            for(var j in sc.children('div').elements)
                e.children('.luc-slides-buttons-container').append('<button class="luc-slide-button luc-slide-button-off" slide_move="'+ j +'"></button>');
            
            
            e.children('.luc-slides-buttons-container').children('.luc-slide-button').elements[0].addClass('luc-slide-button-on');
            e.children('.luc-slides-buttons-container').children('.luc-slide-button').elements[0].rmClass('luc-slide-button-off');
            e.children('.luc-slides-buttons-container').children('.luc-slide-button').click(function(){
                // alterar para o botao receber uma classe de botao ativo em vez de um valor de background
                $luc(this).parent().parent().children('div').animation({'transform':'translate('+ -100 * parseInt($luc(this).attr('slide_move')[0]) +'vw)'}, 500);
            e.attr('slide_time-check', '10');

                $luc(this).parent().children('button').rmClass('luc-slide-button-on');
                $luc(this).parent().children('button').addClass('luc-slide-button-off');
                $luc(this).addClass('luc-slide-button-on');
                $luc(this).rmClass('luc-slide-button-off');

                // falta chamar as animacoes

            });

            setTimeout(slideAutoAnimation, 3000, e);
        }
    }


}

class LucElement{
    constructor(e){
        this.element = e;
    }

    style(p, s){
        if(s==null)
            return this.element.style[p];
        this.element.style[p] = s;
    }

    addClass(cls){
        if(!this.hasClass(cls))
            this.element.className = (this.element.className!='') ? this.element.className+' '+cls : cls;
    }

    rmClass(cls){
        if(this.hasClass(cls)){

        let c_toke = this.element.className.split(' ');
        this.element.className = '';
        for(var i in c_toke)
            if(c_toke[i]!=cls)
                this.addClass(c_toke[i]);
        }
    }

    hasClass(class_name){
        let c_toke = this.element.className.split(' ');
        for(var i in c_toke)
            if(c_toke[i]==class_name)
                return true;
        return false;
    }

    attr(attr_name, attr_val){
        let functions_list = ['onclick'];
        if(functions_list.indexOf(attr_name)!=-1)
            this.element[attr_name] = attr_val;
        else
            this.element.setAttribute(attr_name, attr_val);
    }

    attrVal(attr_name){
        return this.element.getAttribute(attr_name);
    }

    click(func){
        this.element['onclick'] = func;
    }

    mouseOver(func){
        this.element['onmouseover'] = func;
    }

    mouseLeave(func){
        this.element['onmouseleave'] = func;
    }

    parent(){
        return this.element.parentElement;
    }

    children(str){
        // console.log(str);
        let c_nodes = [];
        str = (str==null)?'*':str;
        switch (str.slice(0, 1)){
            case '#': {
                let id = str.slice(1, str.length)
                for (var i = 0; i<this.element.children.length; i++) {
                    if(this.element.children[i].id == id)
                        c_nodes.push(this.element.children[i]);
                }
            }; break;
            case '.': {
                let class_name = str.slice(1, str.length);
                for (var i = 0; i<this.element.children.length; i++) {
                    // console.log(this.element.children[i].className.includes(class_name));
                    let all_class_name = this.element.children[i].className.split(' ');
                    for(var j = 0; j<all_class_name.length; j++)
                        if(all_class_name[j] == class_name){
                            c_nodes.push(this.element.children[i]);
                            j = all_class_name.length;
                        }
                }
            }; break;
            case '*': {
                for (var i = 0; i<this.element.children.length; i++) 
                    c_nodes.push(this.element.children[i]);
            }; break;
            default : {
                let tag_name = str;
                for (var i = 0; i<this.element.children.length; i++) {
                    if(this.element.children[i].tagName.toLowerCase() == tag_name)
                        c_nodes.push(this.element.children[i]);
                }
            };
        }

        return c_nodes;
    }

    hide(){
        if(this.style('display')!='none')
            this.element.setAttribute('bkp_display', this.style('display'));
        this.style('display', 'none');
    }

    show(){
        // verificar... provavelmente nao é necessario esse if pois se a propriedade bkp_display for null por padrao ele ja iria atribuir o valor de '' a style('display')
        if(this.element.getAttribute('bkp_display')!=null){
            this.style('display', this.element.getAttribute('bkp_display'));
            this.element.removeAttribute('bkp_display');
        }
        else
            this.style('display', '');
    }

    append(str){
        this.element.innerHTML+=str;
    }

    innerHTML(str){
        this.element.innerHTML=str;
    }
    
}

class Luc{
    constructor(elements, reference){
        this.elements = [];
        this.reference = reference;

        for(let i in elements)
            this.elements.push(new LucElement(elements[i]));
    }
    // change element style
    style(p, s){
        if(typeof(p) == 'string' && typeof(s) == 'string')
            for(var i in this.elements)
                this.elements[i].style(p, s)

        // this type of input .style('css_property')
        else if(typeof(p) == 'string' && s == null){
            let values = [];
            for(var i in this.elements)
                values.push(this.elements[i].style(p, s))
            return values;
        }

        // this type of input .style({css_property: css_value})
        else if(typeof(p) == 'object')
            for(var i in this.elements)
                for(var j in p)
                    this.elements[i].style(j, p[j]);

        // else
        //     console.error('incorrect input');
        return this;
    }

    // create an animation for eatch element
    animation(obg_animation, time, after_animation){
        let element_transition = [];
        for(var i in this.element)
            element_transition.push(this.elements[i].style('transition'));

        setTimeout(function(t){
            t.style('transition', time/1000+'s');
            t.style(obg_animation);
            }, 0, this);

        setTimeout(function(t){
            t.style('transition', '');
            t.style(after_animation);

            setTimeout((t)=>{
                for(var i in this.elements) this.elements[i].style('transition',  element_transition.shift());
                }, time*2, this);

            }, time, this);
        return this;
    }

    attr(attr_name, attr_val){
        if(attr_name == 'id' && this.elements.length!=1){
            console.error('elementos nao podem ter o mesmo valor de id');
            return;
        }
        if(attr_val==null){
            let results = [];
            for(let i in this.elements)
                results.push(this.elements[i].attrVal(attr_name));
            return results;
        }

        for(let i in this.elements)
            this.elements[i].attr(attr_name, attr_val);
        return this;
    }

    createComponent(){
        return new LucComponent(this);
    }

    append(str){
        for(var i in this.elements){
            this.elements[i].append(str);
        }
        return this;
    }

    innerHTML(str){
        for(var i in this.elements){
            this.elements[i].innerHTML(str);
        }
        return this;
    }

    addClass(cls){
        for(let i in this.elements)
            this.elements[i].addClass(cls);
        return this;
    }

    rmClass(cls){
        for(let i in this.elements)
            this.elements[i].rmClass(cls);
        return this;
    }

    hasClass(cls){
        // resultado incerto devido a se tratar de uma lista, foi definido que caso um dos elementos tenha a classe ira voltar true
        for(let i in this.elements)
            if(this.elements[i].hasClass(cls))
                return true;
        return false;
    }

    click(func){
        for(let i in this.elements)
            this.elements[i].click(func);
        return this;
    }

    mouseOver(func){
        for(var i in this.elements)
            this.elements[i].mouseOver(func);
        return this;
    }

    mouseLeave(func){
        for(var i in this.elements)
            this.elements[i].mouseLeave(func);
        return this;
    }

    parent(){
        let result = [];
        for(let i in this.elements)
            result.push(this.elements[i].parent());
        return new Luc(result);
    }

    children(str){
        var c = [];
        for(var i in this.elements){
            let e = this.elements[i].children(str);
            c=c.concat(e);
        }
        return new Luc(c, '');
    }

    hide(){
        for(let i in this.elements)
            this.elements[i].hide();
        return this;
    }

    show(){
        for(let i in this.elements)
            this.elements[i].show();
        return this;
    }

    // animation scroll smooth
    animationScroll(){
        let obj = {
            top: this.offsetTop(),
            left: 0, 
            behavior: 'smooth'
        }
        window.scroll(obj);
        return this;
    }

    offsetTop(){
        return this.elements[0].element.offsetTop;
    }
}

function $luc(str){
    
    if(typeof(str) == 'object'){
        return new Luc([str], str);
    }

    let tok = str.split(' ');
    let doc = [document];


    while(tok.length != 0){
        t = tok.shift();
        let doc_aux = [];
        while(doc.length!=0){
            let e = doc.shift();
            switch (t.slice(0, 1)){
                case '#': doc_aux.push([document.getElementById(t.slice(1, t.length))]); doc=[]; break;
                case '.': doc_aux.push(e.getElementsByClassName(t.slice(1, t.length))); break;
                default : doc_aux.push(e.getElementsByTagName(t));
            }
        }
        for(var i=0; i<doc_aux.length; i++){
            for(var j=0; j<doc_aux[i].length; j++)
                doc.push(doc_aux[i][j]);
            }
    }
    if(doc[0] == null)
        return null;
    return new Luc(doc, str);
}

// window.onload = function(){
    var css = lucStyle(),
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
    } else {
    style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
// };
















