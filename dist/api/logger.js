Object.defineProperty(exports,"__esModule",{value:true});exports.logger=void 0;var LOG=false;var SUBJECT='[Mopinion SDK RN]: ';var logger=exports.logger={setLog:function setLog(log){LOG=log;},log:function log(value){if(LOG){try{value=JSON.stringify(value);}catch(e){}console.log(SUBJECT+value);}}};