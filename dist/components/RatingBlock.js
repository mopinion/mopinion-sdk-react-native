var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=RatingBlock;var _react=_interopRequireDefault(require("react"));var _reactNative=require("react-native");var _Rating=_interopRequireDefault(require("./Rating"));var _jsxRuntime=require("react/jsx-runtime");function RatingBlock(props){var _block$properties,_block$properties2,_block$properties3,_block$properties4,_block$properties5,_block$properties6,_block$properties7;var block=props.block,setValue=props.setValue,_isSwiping=props.isSwiping;var scale=block.typeName==='nps'?10:((_block$properties=block.properties)==null?void 0:_block$properties.type)==='bar'||block.typeName==='ces'||((_block$properties2=block.properties)==null?void 0:_block$properties2.type)==='emoji'?5:(_block$properties3=block.properties)==null?void 0:_block$properties3.scale;var includeZero=((_block$properties4=block.properties)==null?void 0:_block$properties4.type)==='numeric'||((_block$properties5=block.properties)==null?void 0:_block$properties5.type)==='stars'?(_block$properties6=block.properties)==null?void 0:_block$properties6.includeZero:block.typeName==='nps'?true:false;var RatingProps={scale:scale,block:block,includeZero:includeZero,reverseScore:(_block$properties7=block.properties)!=null&&_block$properties7.reverseScore?true:false,valueChanged:function valueChanged(value){setValue(value);},isSwiping:function isSwiping(swiping){_isSwiping(swiping);}};return(0,_jsxRuntime.jsx)(_reactNative.View,{children:(0,_jsxRuntime.jsx)(_Rating.default,Object.assign({},RatingProps))});}