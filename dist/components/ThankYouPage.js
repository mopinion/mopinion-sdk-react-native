var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=ThankYouPage;var _react=_interopRequireDefault(require("react"));var _reactNative=require("react-native");var _FormContext=require("./FormContext");var _PageContainer=_interopRequireDefault(require("./PageContainer"));var _Icon=_interopRequireDefault(require("./Icon"));var _styles=require("../styles");var _jsxRuntime=require("react/jsx-runtime");function ThankYouPage(){var theme=(0,_styles.useTheme)();var _useFormContext=(0,_FormContext.useFormContext)(),formConfig=_useFormContext.formConfig;var containerStyle={flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',marginHorizontal:(0,_styles.spacing)(1.5)};var checkStyle={fontSize:80,color:theme.darkTextColor,marginBottom:(0,_styles.spacing)(4),backgroundColor:'transparent'};return(0,_jsxRuntime.jsx)(_PageContainer.default,{children:(0,_jsxRuntime.jsxs)(_reactNative.View,{style:containerStyle,children:[(0,_jsxRuntime.jsx)(_reactNative.Text,{style:checkStyle,children:(0,_jsxRuntime.jsx)(_Icon.default,{icon:"check"})}),(0,_jsxRuntime.jsx)(_reactNative.Text,{style:theme.typography.base,children:formConfig.properties.exit_content})]})});}