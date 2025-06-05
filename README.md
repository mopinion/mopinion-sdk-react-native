# Mopinion for React Native

Easily collect in-app feedback with the Mopinion SDK for React Native.

## Installation

To install the Mopinion SDK into your React Native Application:

1. In a terminal window, navigate to the root directory of your project and run:

```
npm install mopinion-react-native-sdk --save
```

2. Install dev dependencies, this is required since the SDK uses optional dependencies. **(Breaking change in 4.0.0)**

```
npm install babel-plugin-optional-require --save-dev
```

3. Update `babel.config.js` to use the optional require plugin. **(Breaking change in 4.0.0)**

```
{
  plugins: [
    'babel-plugin-optional-require'
  ]
}
```

4. Link icon font

```
npx react-native-asset -asset node_modules/mopinion-react-native-sdk/assets/fonts

```

5. Install peerDependencies, these have to be installed separately because they require linking of native modules.

```

npm install @react-native-async-storage/async-storage react-native-webview --save

```

6. Install optional dependencies, if you use the screenshot functionality at least one of these is required.

```

npm install --save react-native-view-shot react-native-image-picker --save

```

7. Install native modules:

```

cd ios && bundle exec pod install

```

_When using the image upload functionality._

The SDK may allow users to pick an image from her/his device to upload as a screenshot. To enable this on iOS, make sure to add the `Privacy - Photo Library Usage Description` permission to the `Info.plist` of your app in Xcode:

```

<key>NSPhotoLibraryUsageDescription</key>
<string>To use an image from your library as a screenshot</string>

```

## Implementing the SDK

Import the `MopinionDeployment` component in your main app file:

```

import { MopinionDeployment } from 'mopinion-react-native-sdk'

```

Add a `<MopinionDeployment />` component with your deployment ID to the top level of your app structure:

```

function YourApp() {
	//...
  return (
   <TopLevel>
      {
      	//app content
      }
      <MopinionDeployment deploymentID="YOUR_DEPLOYMENT_ID" />
   </TopLevel>
  );
}

```

Trigger events from anywhere you might want to show a form.

_Pro tip, preemptively implement event calls in relevant places throughout your application so other teams working with Mopinion can easily add or remove forms via the Mopinion platform without changes to your app code. Forms are only shown if the event matches parameters defined in your deployment._

```

import { MopinionSDK } from 'mopinion-react-native-sdk';

//...

<PurchaseButton
	onPress={() => {
		handlePurchase();
		MopinionSDK.event('purchase_completed');
	}}
/>

```

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
/>

```

### Properties

| Property                 | Description                                                                                            | Type                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `deploymentID`           | **Required** the identifier of your deployment                                                         | `string`                           |
| `metaData`               | An object with string values which will be passed along as feedback when your users submit a form      | `Record<string, string \| number>` |
| `fireWhenReady`          | Array of events to fire when the deployment is ready                                                   | `Array<string>`                    |
| `modalAnimationDuration` | Customize the animation duration of the feedback dialog (default: 400, set to 0 to disable animations) | `number`                           |
| `onOpen`                 | Callback fired when a form opens                                                                       | `function`                         |
| `onFormLoaded`           | Callback fired when a form configuration is loaded                                                     | `function`                         |
| `onClose`                | Callback fired when a form closes after being open                                                     | `function`                         |
| `onFeedbackSent`         | Callback fired when a feedback form has been fully submitted                                           | `function`                         |

## Support

Mopinion For React Native is maintained by the Mopinion Development Team. For support contact support@mopinion.com

```

```
