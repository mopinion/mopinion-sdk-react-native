var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _objectWithoutProperties2=_interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));var _getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));var _inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits"));var _react=_interopRequireWildcard(require("react"));var _reactNative=require("react-native");var _Ripple=require("../../Ripple");var _TextField=_interopRequireDefault(require("../../TextField"));var _item=_interopRequireDefault(require("../item"));var _styles=_interopRequireDefault(require("./styles"));var _jsxRuntime=require("react/jsx-runtime");var _excluded=["bottom"],_excluded2=["renderBase","containerStyle","overlayStyle","pickerStyle","rippleInsets","rippleOpacity","rippleCentered","rippleSequential","hitSlop","pressRetentionOffset","testID","nativeID","accessible","accessibilityLabel","supportedOrientations"];function _getRequireWildcardCache(e){if("function"!=typeof WeakMap)return null;var r=new WeakMap(),t=new WeakMap();return(_getRequireWildcardCache=function _getRequireWildcardCache(e){return e?t:r;})(e);}function _interopRequireWildcard(e,r){if(!r&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=_getRequireWildcardCache(r);if(t&&t.has(e))return t.get(e);var n={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&{}.hasOwnProperty.call(e,u)){var i=a?Object.getOwnPropertyDescriptor(e,u):null;i&&(i.get||i.set)?Object.defineProperty(n,u,i):n[u]=e[u];}return n.default=e,t&&t.set(e,n),n;}function _callSuper(t,o,e){return o=(0,_getPrototypeOf2.default)(o),(0,_possibleConstructorReturn2.default)(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],(0,_getPrototypeOf2.default)(t).constructor):o.apply(t,e));}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t;})();}var Dropdown=exports.default=function(_PureComponent){function Dropdown(props){var _this;(0,_classCallCheck2.default)(this,Dropdown);_this=_callSuper(this,Dropdown,[props]);_this.onPress=_this.onPress.bind(_this);_this.onClose=_this.onClose.bind(_this);_this.onSelect=_this.onSelect.bind(_this);_this.onLayout=_this.onLayout.bind(_this);_this.updateRippleRef=_this.updateRef.bind(_this,'ripple');_this.updateContainerRef=_this.updateRef.bind(_this,'container');_this.updateScrollRef=_this.updateRef.bind(_this,'scroll');_this.renderItem=_this.renderItem.bind(_this);_this.keyExtractor=_this.keyExtractor.bind(_this);_this.blur=function(){return _this.onClose();};_this.focus=_this.onPress;var value=_this.props.value;_this.mounted=false;_this.focused=false;_this.state={opacity:new _reactNative.Animated.Value(0),selected:-1,modal:false,value:value};return _this;}(0,_inherits2.default)(Dropdown,_PureComponent);return(0,_createClass2.default)(Dropdown,[{key:"componentDidUpdate",value:function componentDidUpdate(_ref){var value=_ref.value;if(value!==this.props.value){this.setState({value:value});}}},{key:"componentDidMount",value:function componentDidMount(){this.mounted=true;}},{key:"componentWillUnmount",value:function componentWillUnmount(){this.mounted=false;}},{key:"onPress",value:function onPress(event){var _this2=this;var _this$props=this.props,data=_this$props.data,disabled=_this$props.disabled,onFocus=_this$props.onFocus,itemPadding=_this$props.itemPadding,rippleDuration=_this$props.rippleDuration,dropdownOffset=_this$props.dropdownOffset,_this$props$dropdownM=_this$props.dropdownMargins,minMargin=_this$props$dropdownM.min,maxMargin=_this$props$dropdownM.max,animationDuration=_this$props.animationDuration,absoluteRTLLayout=_this$props.absoluteRTLLayout,_this$props$useNative=_this$props.useNativeDriver,useNativeDriver=_this$props$useNative===void 0?true:_this$props$useNative;if(disabled){return;}var itemCount=data.length;var timestamp=Date.now();if(null!=event){event.nativeEvent.locationY-=this.rippleInsets().top;event.nativeEvent.locationX-=this.rippleInsets().left;this.ripple.startRipple(event);}if(!itemCount){return;}this.focused=true;if('function'===typeof onFocus){onFocus();}var dimensions=_reactNative.Dimensions.get('window');this.container.measureInWindow(function(x,y,containerWidth,containerHeight){var opacity=_this2.state.opacity;if(_reactNative.I18nManager.isRTL&&!absoluteRTLLayout){x=dimensions.width-(x+containerWidth);}var delay=Math.max(0,rippleDuration-animationDuration-(Date.now()-timestamp));var selected=_this2.selectedIndex();var leftInset;var left=x+dropdownOffset.left-maxMargin;if(left>minMargin){leftInset=maxMargin;}else{left=minMargin;leftInset=minMargin;}var right=x+containerWidth+maxMargin;var rightInset;if(dimensions.width-right>minMargin){rightInset=maxMargin;}else{right=dimensions.width-minMargin;rightInset=minMargin;}var top=y+dropdownOffset.top-itemPadding;_this2.setState({modal:true,width:right-left,top:top,left:left,leftInset:leftInset,rightInset:rightInset,selected:selected});setTimeout(function(){if(_this2.mounted){_this2.resetScrollOffset();_reactNative.Animated.timing(opacity,{duration:animationDuration,toValue:1,useNativeDriver:useNativeDriver}).start(function(){if(_this2.mounted&&'ios'===_reactNative.Platform.OS){var _ref2=_this2.scroll||{},flashScrollIndicators=_ref2.flashScrollIndicators;if('function'===typeof flashScrollIndicators){flashScrollIndicators.call(_this2.scroll);}}});}},delay);});}},{key:"onClose",value:function onClose(){var _this3=this;var value=arguments.length>0&&arguments[0]!==undefined?arguments[0]:this.state.value;var _this$props2=this.props,onBlur=_this$props2.onBlur,animationDuration=_this$props2.animationDuration,useNativeDriver=_this$props2.useNativeDriver;var opacity=this.state.opacity;_reactNative.Animated.timing(opacity,{duration:animationDuration,toValue:0,useNativeDriver:useNativeDriver}).start(function(){_this3.focused=false;if('function'===typeof onBlur){onBlur();}if(_this3.mounted){_this3.setState({value:value,modal:false});}});}},{key:"onSelect",value:function onSelect(index){var _this4=this;var _this$props3=this.props,data=_this$props3.data,valueExtractor=_this$props3.valueExtractor,onChangeText=_this$props3.onChangeText,animationDuration=_this$props3.animationDuration,rippleDuration=_this$props3.rippleDuration;var value=valueExtractor(data[index],index);var delay=Math.max(0,rippleDuration-animationDuration);if('function'===typeof onChangeText){onChangeText(value,index,data);}setTimeout(function(){return _this4.onClose(value);},delay);}},{key:"onLayout",value:function onLayout(event){var onLayout=this.props.onLayout;if('function'===typeof onLayout){onLayout(event);}}},{key:"value",value:function value(){var value=this.state.value;return value;}},{key:"selectedIndex",value:function selectedIndex(){var value=this.state.value;var _this$props4=this.props,data=_this$props4.data,valueExtractor=_this$props4.valueExtractor;return data.findIndex(function(item,index){return null!=item&&value===valueExtractor(item,index);});}},{key:"selectedItem",value:function selectedItem(){var data=this.props.data;return data[this.selectedIndex()];}},{key:"isFocused",value:function isFocused(){return this.focused;}},{key:"itemSize",value:function itemSize(){var _this$props5=this.props,fontSize=_this$props5.fontSize,itemPadding=_this$props5.itemPadding;return Math.ceil(fontSize*1.5+itemPadding*2);}},{key:"visibleItemCount",value:function visibleItemCount(){var _this$props6=this.props,data=_this$props6.data,itemCount=_this$props6.itemCount;return Math.min(data.length,itemCount);}},{key:"tailItemCount",value:function tailItemCount(){return Math.max(this.visibleItemCount()-2,0);}},{key:"rippleInsets",value:function rippleInsets(){var _ref3=this.props.rippleInsets||{},_ref3$top=_ref3.top,top=_ref3$top===void 0?0:_ref3$top,_ref3$right=_ref3.right,right=_ref3$right===void 0?0:_ref3$right,_ref3$left=_ref3.left,left=_ref3$left===void 0?0:_ref3$left,_ref3$bottom=_ref3.bottom,bottom=_ref3$bottom===void 0?0:_ref3$bottom;return{top:top,right:right,bottom:bottom,left:left};}},{key:"resetScrollOffset",value:function resetScrollOffset(){var selected=this.state.selected;var _this$props7=this.props,data=_this$props7.data,dropdownPosition=_this$props7.dropdownPosition;var offset=0;var itemCount=data.length;var itemSize=this.itemSize();var tailItemCount=this.tailItemCount();var visibleItemCount=this.visibleItemCount();if(itemCount>visibleItemCount){if(null==dropdownPosition){switch(selected){case-1:break;case 0:case 1:break;default:if(selected>=itemCount-tailItemCount){offset=itemSize*(itemCount-visibleItemCount);}else{offset=itemSize*(selected-1);}}}else{var index=selected-dropdownPosition;if(dropdownPosition<0){index-=visibleItemCount;}index=Math.max(0,index);index=Math.min(index,itemCount-visibleItemCount);if(~selected){offset=itemSize*index;}}}if(this.scroll){this.scroll.scrollToOffset({offset:offset,animated:false});}}},{key:"updateRef",value:function updateRef(name,ref){this[name]=ref;}},{key:"keyExtractor",value:function keyExtractor(item,index){var valueExtractor=this.props.valueExtractor;return`${index}-${valueExtractor(item,index)}`;}},{key:"renderBase",value:function renderBase(props){var value=this.state.value;var _this$props8=this.props,data=_this$props8.data,renderBase=_this$props8.renderBase,labelExtractor=_this$props8.labelExtractor,dropdownOffset=_this$props8.dropdownOffset;var index=this.selectedIndex();var title;if(~index){title=labelExtractor(data[index],index);}if(null==title){title=value;}if('function'===typeof renderBase){return renderBase(Object.assign({},props,{title:title,value:value}));}title=null==title||'string'===typeof title?title:String(title);return(0,_react.createElement)(_TextField.default,Object.assign({label:""},props,{value:title,key:value,editable:false,onChangeText:undefined,select:true}));}},{key:"renderRipple",value:function renderRipple(){var _this$props9=this.props,baseColor=_this$props9.baseColor,_this$props9$rippleCo=_this$props9.rippleColor,rippleColor=_this$props9$rippleCo===void 0?baseColor:_this$props9$rippleCo,rippleOpacity=_this$props9.rippleOpacity,rippleDuration=_this$props9.rippleDuration,rippleCentered=_this$props9.rippleCentered,rippleSequential=_this$props9.rippleSequential;var _this$rippleInsets=this.rippleInsets(),bottom=_this$rippleInsets.bottom,insets=(0,_objectWithoutProperties2.default)(_this$rippleInsets,_excluded);var style=Object.assign({},insets,{height:this.itemSize()-bottom,position:'absolute'});return(0,_jsxRuntime.jsx)(_Ripple.Ripple,{style:style,rippleColor:rippleColor,rippleDuration:rippleDuration,rippleOpacity:rippleOpacity,rippleCentered:rippleCentered,rippleSequential:rippleSequential,ref:this.updateRippleRef});}},{key:"renderItem",value:function renderItem(_ref4){var item=_ref4.item,index=_ref4.index;if(null==item){return null;}var _this$state=this.state,selected=_this$state.selected,leftInset=_this$state.leftInset,rightInset=_this$state.rightInset;var _this$props10=this.props,valueExtractor=_this$props10.valueExtractor,labelExtractor=_this$props10.labelExtractor,propsExtractor=_this$props10.propsExtractor,textColor=_this$props10.textColor,itemColor=_this$props10.itemColor,baseColor=_this$props10.baseColor,_this$props10$selecte=_this$props10.selectedItemColor,selectedItemColor=_this$props10$selecte===void 0?textColor:_this$props10$selecte,_this$props10$disable=_this$props10.disabledItemColor,disabledItemColor=_this$props10$disable===void 0?baseColor:_this$props10$disable,fontSize=_this$props10.fontSize,itemTextStyle=_this$props10.itemTextStyle,rippleOpacity=_this$props10.rippleOpacity,rippleDuration=_this$props10.rippleDuration,shadeOpacity=_this$props10.shadeOpacity;var props=propsExtractor(item,index);var _props=props=Object.assign({rippleDuration:rippleDuration,rippleOpacity:rippleOpacity,rippleColor:baseColor,shadeColor:baseColor,shadeOpacity:shadeOpacity},props,{onPress:this.onSelect}),style=_props.style,disabled=_props.disabled;var value=valueExtractor(item,index);var label=labelExtractor(item,index);var title=null==label?value:label;var color=disabled?disabledItemColor:~selected?index===selected?selectedItemColor:itemColor:selectedItemColor;var textStyle={color:color,fontSize:fontSize};props.style=[style,{height:this.itemSize(),paddingLeft:leftInset,paddingRight:rightInset}];return(0,_jsxRuntime.jsx)(_item.default,Object.assign({index:index},props,{children:(0,_jsxRuntime.jsx)(_reactNative.Text,{style:[_styles.default.item,itemTextStyle,textStyle],numberOfLines:1,children:title})}));}},{key:"render",value:function render(){var _this$props11=this.props,renderBase=_this$props11.renderBase,containerStyle=_this$props11.containerStyle,overlayStyleOverrides=_this$props11.overlayStyle,pickerStyleOverrides=_this$props11.pickerStyle,rippleInsets=_this$props11.rippleInsets,rippleOpacity=_this$props11.rippleOpacity,rippleCentered=_this$props11.rippleCentered,rippleSequential=_this$props11.rippleSequential,hitSlop=_this$props11.hitSlop,pressRetentionOffset=_this$props11.pressRetentionOffset,testID=_this$props11.testID,nativeID=_this$props11.nativeID,accessible=_this$props11.accessible,accessibilityLabel=_this$props11.accessibilityLabel,supportedOrientations=_this$props11.supportedOrientations,props=(0,_objectWithoutProperties2.default)(_this$props11,_excluded2);var data=props.data,disabled=props.disabled,itemPadding=props.itemPadding,dropdownPosition=props.dropdownPosition;var _this$state2=this.state,left=_this$state2.left,top=_this$state2.top,width=_this$state2.width,opacity=_this$state2.opacity,selected=_this$state2.selected,modal=_this$state2.modal;var itemCount=data.length;var visibleItemCount=this.visibleItemCount();var tailItemCount=this.tailItemCount();var itemSize=this.itemSize();var height=2*itemPadding+itemSize*visibleItemCount;var translateY=-itemPadding;if(null==dropdownPosition){switch(selected){case-1:translateY-=1===itemCount?0:itemSize;break;case 0:break;default:if(selected>=itemCount-tailItemCount){translateY-=itemSize*(visibleItemCount-(itemCount-selected));}else{translateY-=itemSize;}}}else{if(dropdownPosition<0){translateY-=itemSize*(visibleItemCount+dropdownPosition);}else{translateY-=itemSize*dropdownPosition;}}var overlayStyle={opacity:opacity};var pickerStyle={width:width,height:height,top:top,left:left,transform:[{translateY:translateY}]};var touchableProps={disabled:disabled,hitSlop:hitSlop,pressRetentionOffset:pressRetentionOffset,onPress:this.onPress,testID:testID,nativeID:nativeID,accessible:accessible,accessibilityLabel:accessibilityLabel};return(0,_jsxRuntime.jsxs)(_reactNative.View,{onLayout:this.onLayout,ref:this.updateContainerRef,style:containerStyle,children:[(0,_jsxRuntime.jsx)(_reactNative.TouchableWithoutFeedback,Object.assign({},touchableProps,{children:(0,_jsxRuntime.jsxs)(_reactNative.View,{pointerEvents:"box-only",children:[this.renderBase(props),this.renderRipple()]})})),(0,_jsxRuntime.jsx)(_reactNative.Modal,{visible:modal,transparent:true,onRequestClose:this.blur,supportedOrientations:supportedOrientations,children:(0,_jsxRuntime.jsx)(_reactNative.Animated.View,{style:[_styles.default.overlay,overlayStyle,overlayStyleOverrides],onStartShouldSetResponder:function onStartShouldSetResponder(){return true;},onResponderRelease:this.blur,children:(0,_jsxRuntime.jsx)(_reactNative.View,{style:[_styles.default.picker,pickerStyle,pickerStyleOverrides],onStartShouldSetResponder:function onStartShouldSetResponder(){return true;},children:(0,_jsxRuntime.jsx)(_reactNative.FlatList,{ref:this.updateScrollRef,data:data,style:_styles.default.scroll,renderItem:this.renderItem,keyExtractor:this.keyExtractor,scrollEnabled:visibleItemCount<itemCount,contentContainerStyle:_styles.default.scrollContainer})})})})]});}}]);}(_react.PureComponent);Dropdown.defaultProps={hitSlop:{top:6,right:4,bottom:6,left:4},disabled:false,data:[],valueExtractor:function valueExtractor(){var _ref5=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},value=_ref5.value;var index=arguments.length>1?arguments[1]:undefined;return value;},labelExtractor:function labelExtractor(){var _ref6=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{},label=_ref6.label;var index=arguments.length>1?arguments[1]:undefined;return label;},propsExtractor:function propsExtractor(){return null;},absoluteRTLLayout:false,dropdownOffset:{top:32,left:0},dropdownMargins:{min:8,max:16},rippleCentered:false,rippleSequential:true,rippleInsets:{top:0,bottom:0,right:0,left:0},rippleOpacity:0.54,shadeOpacity:0.12,rippleDuration:400,animationDuration:225,fontSize:16,textColor:'rgba(0, 0, 0, .87)',itemColor:'rgba(0, 0, 0, .54)',baseColor:'rgba(0, 0, 0, .38)',itemCount:4,itemPadding:8,supportedOrientations:['portrait','portrait-upside-down','landscape','landscape-left','landscape-right'],useNativeDriver:false};