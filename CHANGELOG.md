# 2.1.2
- Pass the SDK version as feedback
# 2.1.1
- Fix issues with deprecated text and view proptypes by using `deprecated-react-native-prop-types`
- Allow 0 values as feedback - fixes an issue where 0 scores in NPS blocks weren't posted as feedback
- Update API URL for fetching form configuration
- Remove unused function and testing URL
# 2.1.0
- Add Mopinion Metrics
- Webform autoclose

# 2.0.1
- MIME JPEG fix
- Feedback API URL change

# 2.0.0
- Implement upload screenshot functionality through `react-native-image-picker`
- Update dependency from deprecated `@react-native-community/async-storage` to `@react-native-async-storage/async-storage`
- Remove deprecated `react-native-material-textfield` and `react-native-material-dropdown` depedencies, fork them and modify to fix issues with newer RN versions and import into package
- Fix percentage test in `TestRuleConditions.percentage`
- Fix rating labels in `Rating` component
  
# 1.4.1
- Pass Content-Type header when submitting feedback, fixes api post in Android

# 1.4.0
- Implement `fireWhenReady` prop
- Document `modalAnimationDuration` prop


# 1.3.0
- Fix for rating label heights
- Thanks page margins
- Update dependencies for TextField and Dropdown components
- React Native 0.62+ compatibility fixes
- Decrease Android shadows around screenshot
- Lower elevation on Android

# 1.2.3
- Fix UserAgent fetching using a WebView

# 1.2.2
- Rename deprecated component lifecycle methods
- Make onFeedbackSent prop work with webview forms

# 1.2.1

- Fix modal offset issue on Android after closing keyboard

# 1.2.0

- Add metaData to webview type forms

# 1.1.0

- Add onDeploymentLoaded prop


# 1.0.1

- Fixed webview named import
- Update webview path

# 1.0.0

- Breaking change: fixed deprecated imports of AsyncStorage and WebView 
- Breaking change: moved rnpm linking of assets to react-native.config.js
- Added onOpen, onFormLoaded, onFeedbackSent and onClose props

# 0.3.3

- [X] Increase header elevation on Android

# 0.3.2

- [X] Use SafeAreaView to display content in safe area's only
- [X] Fix checkbox and radio button issues in Android
- [X] Enhanced keyboard handling

# 0.3.0

- [X] Add metaData prop
- [X] Bug fix posting correct fields to api
- [X] Enhancment to form opening
- [X] Remove deprecated BackAndroid from code 

# 0.2.5

- [X] Add Changelog

# 0.2.4

- [X] Fix for fetching userAgent in Android

# 0.2.3

- [X] Fix for Object.keys quirks Android Studio

# 0.2.2

- [X] Fix elevation in Android

# 0.2.1

- [X] Add backbutton handler for Android
- [X] Form height issues Android

# 0.2

- [X] Added form logic!

# 0.1.0

- [X] Initial release