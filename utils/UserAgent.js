import React from 'react';
import { View, WebView } from 'react-native';

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