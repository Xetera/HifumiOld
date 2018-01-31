function Voice(){
    this.voiceConnection = null;
    this.volume;
}

Voice.prototype.setStream = function(voiceConnection){
    this.voiceConnection = voiceConnection;
};





