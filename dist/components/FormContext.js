Object.defineProperty(exports,"__esModule",{value:true});exports.FormContext=void 0;exports.FormContextProvider=FormContextProvider;exports.useFormContext=useFormContext;exports.withFormContext=withFormContext;var _react=require("react");var _jsxRuntime=require("react/jsx-runtime");var FormContext=exports.FormContext=(0,_react.createContext)({});function FormContextProvider(_ref){var children=_ref.children,value=_ref.value;return(0,_jsxRuntime.jsx)(FormContext.Provider,{value:value,children:children});}function useFormContext(){return(0,_react.useContext)(FormContext);}function withFormContext(Component){return function(props){return(0,_jsxRuntime.jsx)(FormContext.Consumer,{children:function children(value){return(0,_jsxRuntime.jsx)(Component,Object.assign({},props,value));}});};}