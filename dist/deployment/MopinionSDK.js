Object.defineProperty(exports,"__esModule",{value:true});exports.MopinionSDK=void 0;var MopinionSDK=exports.MopinionSDK={_events:{},subscribe:function subscribe(event,fct){this._events=this._events||{};this._events[event]=this._events[event]||[];this._events[event].push(fct);},unsubscribe:function unsubscribe(event,fct){this._events=this._events||{};if(event in this._events===false)return;this._events[event].splice(this._events[event].indexOf(fct),1);},event:function event(_event){var force=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;this._events=this._events||{};if(_event in this._events===false)return;for(var i=0;i<this._events[_event].length;i++){this._events[_event][i](_event,force);}}};