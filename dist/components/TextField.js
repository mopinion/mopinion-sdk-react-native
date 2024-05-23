var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=TextField;var _objectWithoutProperties2=_interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));var _react=require("react");var _reactNative=require("react-native");var _styles=require("../styles");var _jsxRuntime=require("react/jsx-runtime");var _excluded=["style","select","type"];var styles=_reactNative.StyleSheet.create({container:{position:'relative',justifyContent:'center'},border:{position:'absolute',flex:1,top:0,left:0,right:0,bottom:0,pointerEvents:'none'},input:{backgroundColor:'transparent',borderWidth:0,borderColor:'transparent',width:'100%',borderRadius:_styles.baseTheme.borderRadius,paddingHorizontal:(0,_styles.spacing)(1),paddingTop:(0,_styles.spacing)(1.5),paddingBottom:(0,_styles.spacing)(1.5)},accessory:{width:24,height:24,justifyContent:'center',alignItems:'center',position:'absolute',right:(0,_styles.spacing)(1),alignSelf:'center'},triangle:{width:8,height:8,backgroundColor:'gray',transform:[{translateY:-4},{rotate:'45deg'}]},triangleContainer:{width:12,height:6,overflow:'hidden',alignItems:'center',backgroundColor:'transparent'}});function TextField(_ref){var style=_ref.style,select=_ref.select,type=_ref.type,props=(0,_objectWithoutProperties2.default)(_ref,_excluded);var anim=(0,_react.useRef)(new _reactNative.Animated.Value(0));var theme=(0,_styles.useTheme)();var borderStyle={borderColor:anim.current.interpolate({inputRange:[0,1],outputRange:[theme.borderColor,theme.selectedControlColor]}),borderWidth:anim.current.interpolate({inputRange:[0,1],outputRange:[1,2]}),borderRadius:theme.borderRadius};var animate=function animate(_in){_reactNative.Animated.timing(anim.current,{toValue:_in?1:0,duration:225,easing:_reactNative.Easing.bezier(0.4,0.0,0.2,1),useNativeDriver:false}).start();};return(0,_jsxRuntime.jsxs)(_reactNative.View,{style:[styles.container,style],children:[(0,_jsxRuntime.jsx)(_reactNative.TextInput,Object.assign({onFocus:function onFocus(){return animate(true);},onBlur:function onBlur(){return animate(false);},style:styles.input},props)),select&&(0,_jsxRuntime.jsx)(Triangle,{}),(0,_jsxRuntime.jsx)(_reactNative.Animated.View,{style:[styles.border,borderStyle]})]});}function Triangle(){return(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.accessory,children:(0,_jsxRuntime.jsx)(_reactNative.View,{style:styles.triangleContainer,children:(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.triangle]})})});}