[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/usabilla/usabilla-u4a-react-native/blob/develop/LICENSE)


# Mopinion for React Native

Easily collect in-app feedback with the Mopinion SDK for React Native.

## Installation

To install the Mopinion SDK into your React Native Application:
1. In a terminal window, navigate to the root directory of your project and run :

```
npm install mopinion-react-native-sdk
```

2. Link assets

```
react-native link mopinion-react-native-sdk
react-native link react-native-view-shot
```

## Implementing the SDK

Import the Mopinion SDK in your main app file:

`import { MopinionSDK, MopinionDeployment } from 'mopinion-react-native-sdk'`

### Loading your deployment

Add a `<MopinionDeployment />` component with your deployment ID to your JSX:

`<MopinionDeployment deploymentID={'YOUR_ID_HERE'} />`

Trigger forms by calling the event emitter.

`MopinionSDK.event('_button')`

### Passing meta data from your app into Mopinion forms

You can send an object of data along with the feedback sent by your users using the `metaData` prop. This useful for passing along various meta data that want to have linked to a users feedback.

```
<MopinionDeployment 
	deploymentID={'YOUR_ID_HERE'} 
	metaData={{
		meta:'value',
		meta2:'value2',
		meta3:'value3'
	}}
/>
```


## Support

Mopinion For React Native is maintained by the Mopinion Development Team. For support contact support@mopinion.com