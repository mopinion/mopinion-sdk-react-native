var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));var _getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));var _inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits"));var _react=_interopRequireWildcard(require("react"));var _reactNative=require("react-native");var _FontAwesomeIcons=_interopRequireDefault(require("./FontAwesomeIcons"));var _jsxRuntime=require("react/jsx-runtime");function _getRequireWildcardCache(e){if("function"!=typeof WeakMap)return null;var r=new WeakMap(),t=new WeakMap();return(_getRequireWildcardCache=function _getRequireWildcardCache(e){return e?t:r;})(e);}function _interopRequireWildcard(e,r){if(!r&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=_getRequireWildcardCache(r);if(t&&t.has(e))return t.get(e);var n={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&{}.hasOwnProperty.call(e,u)){var i=a?Object.getOwnPropertyDescriptor(e,u):null;i&&(i.get||i.set)?Object.defineProperty(n,u,i):n[u]=e[u];}return n.default=e,t&&t.set(e,n),n;}function _callSuper(t,o,e){return o=(0,_getPrototypeOf2.default)(o),(0,_possibleConstructorReturn2.default)(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],(0,_getPrototypeOf2.default)(t).constructor):o.apply(t,e));}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t;})();}function formatIconString(){var str=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'';return str.replace('fa fa-','').replace(/(\-\w)/g,function(s){return s[1].toUpperCase();});}var Icon=function(_Component){function Icon(){(0,_classCallCheck2.default)(this,Icon);return _callSuper(this,Icon,arguments);}(0,_inherits2.default)(Icon,_Component);return(0,_createClass2.default)(Icon,[{key:"setNativeProps",value:function setNativeProps(nativeProps){this._root.setNativeProps(nativeProps);}},{key:"render",value:function render(){var _this=this;var _this$props=this.props,style=_this$props.style,color=_this$props.color,children=_this$props.children,icon=_this$props.icon;return(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[styles.icon,{color:color},style],ref:function ref(component){return _this._root=component;},children:icon?_FontAwesomeIcons.default[formatIconString(icon)]:children});}}]);}(_react.Component);var styles=_reactNative.StyleSheet.create({icon:{fontFamily:'FontAwesome',backgroundColor:'transparent'}});var _default=exports.default=Icon;