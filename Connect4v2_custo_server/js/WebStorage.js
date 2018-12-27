class WebStorage{
  constructor(){

    this.supported = !(typeof(Storage) === 'undefined');
    if (!this.supported ) {
      loadTextMessagePopUp("Web Storage does not supported =/");
    }
  }

  loadGame(key){
    if(this.supported){
      return JSON.parse(localStorage.getItem(key));
    }
  }

  removeData(key){
    if(this.supported){
      localStorage.removeItem(key);
      webStorage.saveGameStatus(nick, JSON.stringify({'game_history': game_history}));
    }
  }

  saveGameStatus(key, data){
    if(this.supported){
      localStorage.setItem(key, data );
    }
  }

}
