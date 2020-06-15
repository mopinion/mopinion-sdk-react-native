import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export const UserAgent = ({setUserAgent}) => {

	const html = `
		<html>
			<head></head>
			<body></body>
		</html>
	`;

	const js = `
		(function() {
			setTimeout(function() {
			  window.ReactNativeWebView.postMessage(navigator.userAgent);
			},500);
			return true;
		})()
	`;

	return (
		<WebView
			source={{html}}
			injectedJavaScript={js}
			javaScriptEnabled={true}
			style={{
				width: 0,
				height: 0,
				position:'absolute',
				display:'none'
			}}
			onMessage={event => setUserAgent(event.nativeEvent.data)}
    	/>
  	)
}