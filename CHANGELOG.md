# 4.0.1

- Inject metaData before content loaded in webview forms

# 4.0.0

- Breaking: now requires `babel-plugin-optional-require` as dev dependency
- Make `react-native-view-shot` and `react-native-image-picker` optional dependencies

# 3.1.2

- Fix usage of removed `BackHandler.removeEventListener` method

# 3.1.1

- properly handle RTL in TextField component
- Force ltr for Branding
- Allow hiding branding
- Include type declarations in package
- refactor testRuleConditions and implement session based percentage

# 3.1.0

- Fix rtl language issues with `Rating` component
- Allow multiline in `DropDown`
- Fix alignment of the `DropDown` menu

# 3.0.2

- Re-implement onFeedbackSent callback
- Fix onClose callback

# 3.0.1

- Minor readme tweak

# 3.0.0

- Breaking: requires react-native 0.60.0 and react 16.8.0
- Massive refactor and cleanup
- Implement 'slide-in' display type functionality
- Implement 'link block'
- Implement 'multimedia block'
- Implement empty page skip functionality
- Implement autopost and pageskip on last answer given functionality
- Implement tooltip functionality
- Implement 'other option' functionality for category question types
- Implement 'randomize' functionality for category question types
- Implement legend functionality for rating types
- Align UX with other SDKs and web functionality
- Implement KeyboardAwareScrollView for handling keyboard and scrollview issues
- Remove any outdated/deprecated functionality (usage of string refs and PropTypes)

# 2.1.4

- Fix an issue in `Rating` where NPS scores had a maximum value of 9

# 2.1.3

- Fix an issue in `Rating` where swiping past all options could cause undefined values

# 2.1.2

- Pass the SDK version as feedback
-

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

- [x] Increase header elevation on Android

# 0.3.2

- [x] Use SafeAreaView to display content in safe area's only
- [x] Fix checkbox and radio button issues in Android
- [x] Enhanced keyboard handling

# 0.3.0

- [x] Add metaData prop
- [x] Bug fix posting correct fields to api
- [x] Enhancment to form opening
- [x] Remove deprecated BackAndroid from code

# 0.2.5

- [x] Add Changelog

# 0.2.4

- [x] Fix for fetching userAgent in Android

# 0.2.3

- [x] Fix for Object.keys quirks Android Studio

# 0.2.2

- [x] Fix elevation in Android

# 0.2.1

- [x] Add backbutton handler for Android
- [x] Form height issues Android

# 0.2

- [x] Added form logic!

# 0.1.0

- [x] Initial release
