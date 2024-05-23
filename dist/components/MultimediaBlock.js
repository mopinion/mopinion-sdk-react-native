Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _react=require("react");var _reactNative=require("react-native");var _reactNativeWebview=require("react-native-webview");var _utils=require("../utils");var _styles=require("../styles");var _jsxRuntime=require("react/jsx-runtime");function getMediaStyle(_ref){var _ref$properties=_ref.properties,properties=_ref$properties===void 0?{}:_ref$properties;if(properties.mediatype==='image'&&['jpg','jpeg','gif','png','svg'].includes(properties.location.split('.').pop())){return{textAlign:properties.media_align?properties.media_align:'left',borderRadius:_styles.baseTheme.borderRadius,overflow:'hidden'};}if(['youtube','vimeo'].includes(properties.mediatype)&&properties.location.match(/^(https\:\/\/youtube)|^(https\:\/\/www\.youtube)|^(https\:\/\/player\.vimeo)/gi)){return{flex:1,width:properties.media_width,borderRadius:_styles.baseTheme.borderRadius,overflow:'hidden',margin:properties.media_align==='right'?'0 0 0 auto':properties.media_align==='center'?'auto':'0'};}return null;}function Media(_ref2){var block=_ref2.block;var properties=block.properties;if(block.type==='img'){return(0,_jsxRuntime.jsx)(_reactNative.Image,{source:{uri:block.url},alt:block.title,style:{width:properties.media_width||'100%',flex:1,aspectRatio:'1'}});}else if(properties.mediatype==='image'&&['jpg','jpeg','gif','png','svg'].includes(properties.location.split('.').pop())){return(0,_jsxRuntime.jsx)(_reactNative.Image,{source:{uri:(0,_utils.getImageUri)(properties.location)},style:{width:properties.media_width||'100%',flex:1,aspectRatio:'1'}});}else if(['youtube','vimeo'].indexOf(properties.mediatype)>-1&&properties.location.match(/^(https\:\/\/youtube)|^(https\:\/\/www\.youtube)|^(https\:\/\/player\.vimeo)/gi)){return(0,_jsxRuntime.jsx)(_reactNative.View,{style:{flex:1,width:'100%',aspectRatio:'16/9'},children:(0,_jsxRuntime.jsx)(_reactNativeWebview.WebView,{source:{uri:properties.location},scalesPageToFit:false,style:{flex:1}})});}}var _default=exports.default=(0,_react.memo)(function Multimedia(_ref3){var block=_ref3.block;return(0,_jsxRuntime.jsx)(_reactNative.View,{style:getMediaStyle(block),children:(0,_jsxRuntime.jsx)(Media,{block:block})});},function(){return false;});