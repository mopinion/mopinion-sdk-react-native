var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _objectWithoutProperties2=_interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));var _getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));var _inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits"));var _react=_interopRequireWildcard(require("react"));var _reactNative=require("react-native");var _raisedButton=_interopRequireDefault(require("../raised-button"));var _styles=require("./styles");var _jsxRuntime=require("react/jsx-runtime");var _excluded=["title","titleColor","titleStyle","disabledTitleColor"];function _getRequireWildcardCache(e){if("function"!=typeof WeakMap)return null;var r=new WeakMap(),t=new WeakMap();return(_getRequireWildcardCache=function _getRequireWildcardCache(e){return e?t:r;})(e);}function _interopRequireWildcard(e,r){if(!r&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=_getRequireWildcardCache(r);if(t&&t.has(e))return t.get(e);var n={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&{}.hasOwnProperty.call(e,u)){var i=a?Object.getOwnPropertyDescriptor(e,u):null;i&&(i.get||i.set)?Object.defineProperty(n,u,i):n[u]=e[u];}return n.default=e,t&&t.set(e,n),n;}function _callSuper(t,o,e){return o=(0,_getPrototypeOf2.default)(o),(0,_possibleConstructorReturn2.default)(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],(0,_getPrototypeOf2.default)(t).constructor):o.apply(t,e));}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t;})();}var RaisedTextButton=exports.default=function(_PureComponent){function RaisedTextButton(props){var _this;(0,_classCallCheck2.default)(this,RaisedTextButton);_this=_callSuper(this,RaisedTextButton,[props]);var _this$props=_this.props,disabled=_this$props.disabled,_this$props$disableAn=_this$props.disableAnimation,disableAnimation=_this$props$disableAn===void 0?new _reactNative.Animated.Value(disabled?1:0):_this$props$disableAn;_this.state={disableAnimation:disableAnimation};return _this;}(0,_inherits2.default)(RaisedTextButton,_PureComponent);return(0,_createClass2.default)(RaisedTextButton,[{key:"render",value:function render(){var disableAnimation=this.state.disableAnimation;var _this$props2=this.props,title=_this$props2.title,titleColor=_this$props2.titleColor,titleStyle=_this$props2.titleStyle,disabledTitleColor=_this$props2.disabledTitleColor,props=(0,_objectWithoutProperties2.default)(_this$props2,_excluded);var titleStyleOverrides={color:disableAnimation.interpolate({inputRange:[0,1],outputRange:[titleColor,disabledTitleColor]})};return(0,_jsxRuntime.jsx)(_raisedButton.default,Object.assign({rippleColor:titleColor,shadeColor:titleColor,titleColor:titleColor},props,{disableAnimation:disableAnimation,children:(0,_jsxRuntime.jsx)(_reactNative.Animated.Text,{style:[_styles.styles.title,titleStyle,titleStyleOverrides],numberOfLines:1,children:title})}));}}]);}(_react.PureComponent);RaisedTextButton.defaultProps={titleColor:'rgb(66, 66, 66)',disabledTitleColor:'rgba(0, 0, 0, .26)'};