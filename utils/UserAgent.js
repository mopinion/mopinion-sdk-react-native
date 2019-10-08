import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export const UserAgent = ({setUserAgent}) => {
	const content = `
		<script>
			setTimeout(function() {
			  window.postMessage(navigator.userAgent);
			},500);
		</script>
	`;
	return (
		<WebView
			source={{ html: content }}
			javaScriptEnabled={true}
			style={{
				width: 0,
				height: 0,
				position:'absolute',
				display:'none'
			}}
			onMessage={(event) => {setUserAgent(event.nativeEvent.data)}}
    	/>
  	)
}
