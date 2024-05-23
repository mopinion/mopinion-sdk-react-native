var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.UserAgent=void 0;var _react=_interopRequireDefault(require("react"));var _reactNative=require("react-native");var _reactNativeWebview=require("react-native-webview");var _jsxRuntime=require("react/jsx-runtime");var UserAgent=exports.UserAgent=function UserAgent(_ref){var setUserAgent=_ref.setUserAgent;var html=`
		<html>
			<head></head>
			<body></body>
		</html>
	`;var js=`
		(function() {
			setTimeout(function() {
			  window.ReactNativeWebView.postMessage(navigator.userAgent);
			},500);
			return true;
		})()
	`;return(0,_jsxRuntime.jsx)(_reactNativeWebview.WebView,{source:{html:html},injectedJavaScript:js,javaScriptEnabled:true,style:{width:0,height:0,position:'absolute',display:'none'},onMessage:function onMessage(event){return setUserAgent(event.nativeEvent.data);}});};