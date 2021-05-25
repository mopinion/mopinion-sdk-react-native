[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/usabilla/usabilla-u4a-react-native/blob/develop/LICENSE)


# Mopinion for React Native

Easily collect in-app feedback with the Mopinion SDK for React Native.

## Installation

To install the Mopinion SDK into your React Native Application:

1. In a terminal window, navigate to the root directory of your project and run:

```
npm install mopinion-react-native-sdk @react-native-async-storage/async-storage react-native-webview react-native-view-shot react-native-image-picker --save
```

Note: since React Native 60 uses autolinking and the autolinking depth is only of the direct dependencies we now specifiy dependencies which require native modules as peerDependencies. This is a breaking change introduced in version 1.0.0. 

2. Link assets by running the following command in your projects root directory:

`react-native link mopinion-react-native-sdk`

3. Install native modules by running pod install. Run the following command from your root directory.

`cd ios && pod install && cd ..`

If you're using React Native 59 and lower do the following as well.

```
react-native link react-native-view-shot
react-native link @react-native-async-storage/async-storage
react-native link react-native-webview
react-native link react-native-image-picker
```

4. Optional: When using the image upload functionality

The SDK allows users to pick an image from her/his device to upload as a screenshot. 
To enable this on iOS, in Xcode make sure to add the `Privacy - Photo Library Usage Description` permission to the `Info.plist` of your app if it is missing:

```
<key>NSPhotoLibraryUsageDescription</key>
<string>To use an image from your library as a screenshot</string>
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

You can send an object of data along with the feedback sent by your users using the `metaData` prop. This is useful for passing along various metadata that you might want to have linked to a users feedback.

```
<MopinionDeployment 
	//required
	deploymentID={'YOUR_ID_HERE'} 
	//optional
	metaData={{
		meta:'value',
		meta2:'value2',
		meta3:'value3'
	}}
	fireWhenReady={['event']} //Array of events to fire when to deployment is ready
	modalAnimationDuration={400} //Customize the animation duration of the feedback dialog, default = 400, set to 0 to disable animations

	onOpen={(data) => {
		//Fires the moment a form opens
		//data
		/*
			{
				formKey:'Formkey of the form that opened'
			}
		*/
	}}
	onFormLoaded={(data) => {
		//Fires when a form opened and the form configuration was loaded
		//data
		/*
			{
				formKey:'Formkey of the form that opened',
				formName:'Name of the form'
			}
		*/
	}}
	onClose={(data) => {
		//Fires when a form closes after being open
		//data
		/*
			{
				formKey:'Formkey of the form that opened',
				formName:'Name of the form'
			}
		*/
	}}
	onFeedbackSent={(data) => {
		//Fires when the feedback on the final page is submitted
		//data
		/*
			{
				formKey:'Formkey of the form that opened',
				formName:'Name of the form',
				feedback: [] //An array of objects with feedback data 
			}
		*/
	}}
/>
```


## Support

Mopinion For React Native is maintained by the Mopinion Development Team. For support contact support@mopinion.com