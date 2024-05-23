var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _slicedToArray2=_interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));var _asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));var _toConsumableArray2=_interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));var _classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));var _createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass"));var _possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));var _getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));var _inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits"));var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _react=_interopRequireDefault(require("react"));var _reactNative=require("react-native");var _reactNativeWebview=require("react-native-webview");var _KeyboardScrollView=require("./KeyboardScrollView");var _api=require("../api");var _logger=require("../api/logger");var _FormContext=require("./FormContext");var _ModalBox=_interopRequireDefault(require("./ModalBox"));var _Header=_interopRequireDefault(require("./Header"));var _FormContent=_interopRequireDefault(require("./FormContent"));var _styles=require("../styles");var _utils=require("../utils");var _Track=_interopRequireDefault(require("../utils/Track"));var _validation=require("../utils/validation");var _logic=require("../utils/logic");var _jsxRuntime=require("react/jsx-runtime");function _callSuper(t,o,e){return o=(0,_getPrototypeOf2.default)(o),(0,_possibleConstructorReturn2.default)(t,_isNativeReflectConstruct()?Reflect.construct(o,e||[],(0,_getPrototypeOf2.default)(t).constructor):o.apply(t,e));}function _isNativeReflectConstruct(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}));}catch(t){}return(_isNativeReflectConstruct=function _isNativeReflectConstruct(){return!!t;})();}var noInputBlocks=['section_break','multimedia','text','icon','img','link','website_data','ending','honeybot','recaptcha'];function getNestedBlockProps(_ref){var _ref$value=_ref.value,value=_ref$value===void 0?'':_ref$value,_ref$showError=_ref.showError,showError=_ref$showError===void 0?false:_ref$showError,data_field=_ref.data_field;return{value:value,showError:showError,data_field:data_field};}function getContactBlockProps(){var _block$properties$ele,_block$properties;var block=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};return(0,_utils.objectKeys)((_block$properties$ele=(_block$properties=block.properties)==null?void 0:_block$properties.elements)!=null?_block$properties$ele:{}).reduce(function(fields,elementKey){var element=block.properties.elements[elementKey];if(!element.show){return fields;}if(!element.combine&&element.subelements){(0,_utils.objectKeys)(element.subelements).forEach(function(elementKey){var subElement=element.subelements[elementKey];fields[Number(subElement.data_field)]=getNestedBlockProps({showError:element.required,data_field:Number(subElement.data_field)});});return fields;}fields[Number(element.data_field)]=getNestedBlockProps({showError:element.required,data_field:Number(element.data_field)});return fields;},{});}function getDefaultSubProps(block){var _block$properties$ele2,_block$properties2;return(0,_utils.objectKeys)((_block$properties$ele2=(_block$properties2=block.properties)==null?void 0:_block$properties2.elements)!=null?_block$properties$ele2:{}).reduce(function(fields,elementKey){var element=block.properties.elements[elementKey];if(element.data_field){fields[Number(element.data_field)]=getNestedBlockProps({data_field:Number(element.data_field)});}return fields;},{});}function getElementExtraProps(elementsExtra){return(0,_utils.objectKeys)(elementsExtra).reduce(function(fields,elementKey){var element=elementsExtra[elementKey];fields[element.data_field]=getNestedBlockProps({data_field:Number(element.data_field),isVisible:false});return fields;},{});}function getSubFieldBlockProps(block){switch(block.typeName){case'contact':return getContactBlockProps(block);default:return getDefaultSubProps(block);}}function showExtraField(_ref2){var _extraInputElement$va;var state=_ref2.state,extraInputElement=_ref2.extraInputElement,extraQuestionElement=_ref2.extraQuestionElement,block=_ref2.block;if(block.typeName==='checkbox'){return Boolean(state[extraQuestionElement.data_field].value);}return state.value===((_extraInputElement$va=extraInputElement.value)!=null?_extraInputElement$va:extraInputElement.label);}function getExtraInputElement(){var _block$properties3,_block$properties4;var block=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};if(!((_block$properties3=block.properties)!=null&&_block$properties3.elements_extra)){return null;}return block.properties.elements_extra[(0,_utils.objectKeys)((_block$properties4=block.properties)==null?void 0:_block$properties4.elements_extra).pop()];}function getExtraQuestionElement(){var _block$properties5;var block=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};if(!((_block$properties5=block.properties)!=null&&_block$properties5.elements_extra)){return null;}return block.properties.elements_extra[(0,_utils.objectKeys)(block.properties.elements_extra).shift()];}function getScreenshotProps(){var block=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};if(block.typeName!=='screenshot'){return{};}return{screenshot:null};}function applyUpdate(_ref3){var state=_ref3.state,_ref3$value=_ref3.value,value=_ref3$value===void 0?'':_ref3$value,datafieldId=_ref3.datafieldId,_ref3$block=_ref3.block,block=_ref3$block===void 0?{}:_ref3$block,_ref3$rules=_ref3.rules,rules=_ref3$rules===void 0?[]:_ref3$rules,layout=_ref3.layout;var blockStateWithNewValue=!datafieldId?Object.assign({},state[block.id],{inputSet:true,wasPrefilled:false,value:value}):Object.assign({},state[block.id],(0,_defineProperty2.default)({},datafieldId,Object.assign({},state[block.id][datafieldId],{inputSet:true,wasPrefilled:false,value:value})));var extraQuestionElement=getExtraQuestionElement(block);var extraInputElement=getExtraInputElement(block);var newBlockState=extraInputElement?Object.assign({},blockStateWithNewValue,(0,_defineProperty2.default)({},extraInputElement.data_field,Object.assign({},blockStateWithNewValue[extraInputElement.data_field],{isVisible:showExtraField({state:blockStateWithNewValue,extraInputElement:extraInputElement,extraQuestionElement:extraQuestionElement,block:block})}))):blockStateWithNewValue;var validated=(0,_validation.validate)({state:newBlockState,datafieldId:datafieldId,block:block});var newState=Object.assign({},state,(0,_defineProperty2.default)((0,_defineProperty2.default)((0,_defineProperty2.default)({},block.id,Object.assign({},newBlockState,block.typeName!=='contact'&&{showError:!validated.valid,errorReason:validated.reason},block.typeName==='contact'&&(0,_defineProperty2.default)({},datafieldId,Object.assign({},newBlockState[datafieldId],{showError:!validated.valid,errorReason:validated.reason})))),"lastUpdatedBlock",Number(block.id)),"updated",Date.now()));var _applyLogic=(0,_logic.applyLogic)({state:newState,block:block,rules:rules,layout:layout}),newStateWithLogic=_applyLogic.newState,submitFromLogic=_applyLogic.submitFromLogic;return Object.assign({},newStateWithLogic,{submitFromLogic:submitFromLogic});}function getValue(_ref5){var _block$properties7,_block$properties7$el,_block$properties7$el2,_state$block$properti4,_block$properties10,_block$properties10$e;var _ref5$block=_ref5.block,block=_ref5$block===void 0?{}:_ref5$block,_ref5$state=_ref5.state,state=_ref5$state===void 0?{}:_ref5$state,extra1=_ref5.extra1,extra2=_ref5.extra2,screenshot=_ref5.screenshot;if(block.typeName==='screenshot'){return state.value==='send_screenshot'?state.screenshot||screenshot:'';}if(!extra1&&!extra2){return state.value;}if(extra1==='extra'&&extra2){var _state$block$properti,_block$properties6,_block$properties6$el,_block$properties6$el2;return(_state$block$properti=state[(_block$properties6=block.properties)==null?void 0:(_block$properties6$el=_block$properties6.elements_extra)==null?void 0:(_block$properties6$el2=_block$properties6$el[extra2])==null?void 0:_block$properties6$el2.data_field])==null?void 0:_state$block$properti.value;}if(extra1==='name'&&!((_block$properties7=block.properties)!=null&&(_block$properties7$el=_block$properties7.elements)!=null&&(_block$properties7$el2=_block$properties7$el.name)!=null&&_block$properties7$el2.combine)){var _state$block$properti2,_block$properties8,_block$properties8$el,_block$properties8$el2,_block$properties8$el3,_block$properties8$el4;return(_state$block$properti2=state[(_block$properties8=block.properties)==null?void 0:(_block$properties8$el=_block$properties8.elements)==null?void 0:(_block$properties8$el2=_block$properties8$el.name)==null?void 0:(_block$properties8$el3=_block$properties8$el2.subelements)==null?void 0:(_block$properties8$el4=_block$properties8$el3.lastname)==null?void 0:_block$properties8$el4.data_field])==null?void 0:_state$block$properti2.value;}if(extra1==='firstname'){var _state$block$properti3,_block$properties9,_block$properties9$el,_block$properties9$el2,_block$properties9$el3,_block$properties9$el4;return(_state$block$properti3=state[(_block$properties9=block.properties)==null?void 0:(_block$properties9$el=_block$properties9.elements)==null?void 0:(_block$properties9$el2=_block$properties9$el.name)==null?void 0:(_block$properties9$el3=_block$properties9$el2.subelements)==null?void 0:(_block$properties9$el4=_block$properties9$el3.firstname)==null?void 0:_block$properties9$el4.data_field])==null?void 0:_state$block$properti3.value;}return(_state$block$properti4=state[(_block$properties10=block.properties)==null?void 0:(_block$properties10$e=_block$properties10.elements)==null?void 0:_block$properties10$e[extra1].data_field])==null?void 0:_state$block$properti4.value;}var MopinionForm=exports.default=function(_React$Component){function MopinionForm(props){var _this;(0,_classCallCheck2.default)(this,MopinionForm);_this=_callSuper(this,MopinionForm,[props]);_this.handleBackHandler=function(){if(_this.state.modalVisible){_this.toggleModal();return true;}return false;};_this.scrollTo=function(){var y=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;try{_this._scrollView.scrollTo({x:0,y:y,animated:true});}catch(e){}};_this.state={configWasLoaded:false,modalVisible:props.modalVisible?props.modalVisible:false,validateOnChange:false,showErrorsPages:[],elements:[],formConfig:{properties:{},blocks:{},text:{},layout:[],theme:'isLoading',themeCustom:{}},blockState:{updated:Date.now()},showNavAutopostPages:[],pages:[],errorMessages:{deflt:'Something went wrong',required:'This field is required',required_multi:'All fields are required',invalid_number:'This is not a valid number',invalid_phone:'This is not a valid phone number',invalid_email:'This is not a valid email address',too_short:'The answer is too short',too_long:'The answer is too long'},currentPage:1,isSwiping:false,modalStyle:'small',modalBackdrop:true,isFetchConfigInProgress:false,formIsFullySubmitted:false,formStatus:'',direction:'next',feedbackId:(0,_utils.createId)(10),customerId:(0,_utils.createId)(10),didPost:null,headerHeight:0};_this.scrollPosition=0;_this.track=new _Track.default();return _this;}(0,_inherits2.default)(MopinionForm,_React$Component);return(0,_createClass2.default)(MopinionForm,[{key:"componentWillUnmount",value:function componentWillUnmount(){_reactNative.BackHandler.removeEventListener('hardwareBackPress',this.handleBackHandler);}},{key:"componentDidUpdate",value:function componentDidUpdate(prevProps,prevState){this.handleEmptyPageSkip(prevState);this.handleLogicSubmit(prevState);this.handleAutopostPageSkip(prevState);}},{key:"handleEmptyPageSkip",value:function handleEmptyPageSkip(prevState){var _this$state=this.state,currentPage=_this$state.currentPage,blockState=_this$state.blockState,pages=_this$state.pages,direction=_this$state.direction,formConfig=_this$state.formConfig;if(prevState.currentPage===currentPage){return;}var hasVisibleElements=pages[currentPage-1].some(function(blockId){var _blockState$blockId;return(_blockState$blockId=blockState[blockId])==null?void 0:_blockState$blockId.isVisible;});var isFirstPage=currentPage===1;var isLastPage=Number((0,_utils.objectKeys)(formConfig.pageMap).slice(-1).pop())===Number(currentPage);if(!hasVisibleElements){if(isFirstPage&&direction==='next'){this.setPage(true);return;}if(isLastPage){this.handleSubmit();return;}this.setPage(direction==='next');}}},{key:"handleLogicSubmit",value:function handleLogicSubmit(prevState){var blockState=this.state.blockState;if(blockState.submitFromLogic&&!prevState.blockState.submitFromLogic){this.handlePost(true);}}},{key:"handleAutopostPageSkip",value:function handleAutopostPageSkip(prevState){var _formConfig$blocks$cu,_currentPageBreakBloc,_formConfig$blocks$la;var _this$state2=this.state,blockState=_this$state2.blockState,pages=_this$state2.pages,currentPage=_this$state2.currentPage,formConfig=_this$state2.formConfig,showNavAutopostPages=_this$state2.showNavAutopostPages;if(prevState.blockState.updated===blockState.updated){return;}var isLastPage=pages.length===currentPage;var currentPageBreakBlockId=formConfig.layout.filter(function(blockId){var _formConfig$blocks$bl;return((_formConfig$blocks$bl=formConfig.blocks[blockId])==null?void 0:_formConfig$blocks$bl.typeName)==='page_break';})[currentPage-1];var currentPageBreakBlock=(_formConfig$blocks$cu=formConfig.blocks[currentPageBreakBlockId])!=null?_formConfig$blocks$cu:{};var isAutopostablePage=((_currentPageBreakBloc=currentPageBreakBlock.properties)==null?void 0:_currentPageBreakBloc.autopost)||isLastPage&&formConfig.properties.advanced.lastPageAutoPost;if(!isAutopostablePage){return;}var lastVisibleBlockId=pages[currentPage-1].findLast(function(blockId){var block=formConfig.blocks[blockId];var state=blockState[blockId];return state.isVisible&&!noInputBlocks.includes(block.typeName);});var lastVisibleBlock=(_formConfig$blocks$la=formConfig.blocks[lastVisibleBlockId])!=null?_formConfig$blocks$la:{};if(['textarea','input','contact'].includes(lastVisibleBlock.typeName)||showNavAutopostPages.includes(currentPage)){return;}var doAutopost=blockState.lastUpdatedBlock&&blockState.lastUpdatedBlock===lastVisibleBlockId;if(doAutopost){if(isLastPage){this.handleSubmit();}else{this.setPage(true);}if(!showNavAutopostPages.includes(currentPage)){this.setState(function(prevState){return Object.assign({},prevState,{showNavAutopostPages:[].concat((0,_toConsumableArray2.default)(prevState.showNavAutopostPages),[currentPage])});});}}}},{key:"componentDidMount",value:function componentDidMount(){if(this.state.modalVisible&&!this.state.configWasLoaded){this.fetchConfig();}if(_reactNative.NativeModules.UIManager&&_reactNative.NativeModules.UIManager.setLayoutAnimationEnabledExperimental){_reactNative.NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);}_reactNative.BackHandler.addEventListener('hardwareBackPress',this.handleBackHandler);}},{key:"fetchConfig",value:function fetchConfig(){var _this2=this;var callback=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var form=this.props.form;if(this.state.configLoading){return;}this.setState({configLoading:true},(0,_asyncToGenerator2.default)(function*(){var json=yield(0,_api.getConfig)(form.formKey,form.domain);var blockState={updated:Date.now()};json.layout.forEach(function(block_id){var _json$blocks$block_id,_block$properties11,_block$properties12,_block$properties13,_block$properties14,_block$properties$ele3,_block$properties15;var block=(_json$blocks$block_id=json.blocks[block_id])!=null?_json$blocks$block_id:{};blockState[block.id]=Object.assign({value:((_block$properties11=block.properties)==null?void 0:_block$properties11.value)||'',id:Number(block.id),data_field:Number(block.data_field),showError:((_block$properties12=block.properties)==null?void 0:_block$properties12.required)&&!((_block$properties13=block.properties)!=null&&_block$properties13.value)||false,focusInvalid:false,isVisible:!((_block$properties14=block.properties)!=null&&_block$properties14.hide_on_init)},getSubFieldBlockProps(block,_this2.props.screenshot),getElementExtraProps((_block$properties$ele3=(_block$properties15=block.properties)==null?void 0:_block$properties15.elements_extra)!=null?_block$properties$ele3:{}),getScreenshotProps(block,_this2.props.screenshot));});json.text=(0,_utils.tryParse)(json.text);_reactNative.LayoutAnimation.configureNext({duration:425,create:{type:_reactNative.LayoutAnimation.Types.spring,property:_reactNative.LayoutAnimation.Properties.opacity,springDamping:0.7},update:{type:_reactNative.LayoutAnimation.Types.spring,springDamping:0.7}});var trackerConfig=Object.assign({},json,{screenSize:_this2.props.screenSize});if(_this2.track==null){_this2.track=new _Track.default(trackerConfig);}else{_this2.track.setConfig(trackerConfig);}var pages=[[]];json.layout.forEach(function(blockId){var block=json.blocks[blockId];if(block.typeName==='page_break'){pages[pages.length]=[];}else{pages[pages.length-1].push(blockId);}});_this2.setState(function(prevState){var messages=Object.assign(prevState.errorMessages,json.text.errors);return{formConfig:json,errorMessages:messages,configWasLoaded:true,configLoading:false,blockState:blockState,pages:pages};},function(){_this2.props.onFormLoaded({event:'shown',formKey:_this2.state.formConfig.surveyKey,formName:_this2.state.formConfig.properties.name});callback();});}));}},{key:"handleScroll",value:function handleScroll(e){this.scrollPosition=e.nativeEvent.contentOffset.y;}},{key:"setValue",value:function setValue(_ref7){var _ref7$block=_ref7.block,block=_ref7$block===void 0?{}:_ref7$block,value=_ref7.value,datafieldId=_ref7.datafieldId;var formConfig=this.state.formConfig;var rules=formConfig.blockRules[block.id];this.setState(function(prevState){return Object.assign({},prevState,{blockState:applyUpdate({state:prevState.blockState,block:block,value:value,rules:rules,datafieldId:datafieldId,layout:formConfig.layout})});},function(){});}},{key:"setScreenshot",value:function setScreenshot(_ref8){var _ref8$block=_ref8.block,block=_ref8$block===void 0?{}:_ref8$block,screenshot=_ref8.screenshot,screenshotType=_ref8.screenshotType;var formConfig=this.state.formConfig;this.setState(function(prevState){return Object.assign({},prevState,{blockState:Object.assign({},prevState.blockState,(0,_defineProperty2.default)({},block.id,Object.assign({},prevState.blockState[block.id],{screenshot:screenshot,screenshotType:screenshotType})))});},function(){});}},{key:"sendFormMetricsEvent",value:function sendFormMetricsEvent(metricsEvent){if(this.track!=null&&this.state.configWasLoaded){this.track.send(metricsEvent,{event_trigger:this.props.triggeredEvent,trigger_method:this.props.form.trigger,form_completion_percentage:this.state.formIsFullySubmitted?100:Math.round(Math.max(this.state.currentPage-1,0)/(0,_utils.objectKeys)(this.state.formConfig.pageMap).length*100),active_page:this.state.currentPage,page_count:(0,_utils.objectKeys)(this.state.formConfig.pageMap).length,form_type:this.state.formType,subdomain:this.props.form.domain,organisation_id:this.state.formConfig.properties.organisation_id,project_id:this.state.formConfig.properties.project_id});}}},{key:"webForm",value:function webForm(){var _this3=this;var _this$props=this.props,form=_this$props.form,_this$props$metaData=_this$props.metaData,metaData=_this$props$metaData===void 0?{}:_this$props$metaData;var _this$state3=this.state,formConfig=_this$state3.formConfig,formIsFullySubmitted=_this$state3.formIsFullySubmitted;var uri=`https://${form.domain}/survey/public/webview?key=${form.formKey}`;_logger.logger.log(uri);var handleFeedbackSent=function handleFeedbackSent(data){var parsed=(0,_utils.tryParse)(data);_this3.props.onFeedbackSent({event:'feedback_sent',formKey:_this3.state.formConfig.surveyKey,formName:_this3.state.formConfig.properties.name,feedback:parsed.feedback});};var handleWebviewEvent=function handleWebviewEvent(data){var parsed=(0,_utils.tryParse)(data);switch(parsed.event){case'feedback_sent':handleFeedbackSent(data);break;case'hidden':if(formConfig.properties.timeout&&typeof formConfig.properties.timeout==='number'){_this3.props.onClosed(formIsFullySubmitted);}break;default:_logger.logger.log('Ignoring unsupported webview event: '+parsed.event);}};var injectMetaData=`(function() {
			window.metaData = ${JSON.stringify(metaData)};
			try {
				document.addEventListener('mopinion_feedback_sent', function(e) {
					window.ReactNativeWebView.postMessage(JSON.stringify(e.detail));
				});
				document.addEventListener('mopinion_hidden', function(e) {
					window.ReactNativeWebView.postMessage(JSON.stringify(e.detail));
				});
			} catch(e) {
			}

			return true;
		})();`;return(0,_jsxRuntime.jsx)(_reactNativeWebview.WebView,{source:{uri:uri},scalesPageToFit:false,injectedJavaScript:injectMetaData,onMessage:function onMessage(e){return handleWebviewEvent(e.nativeEvent.data);}});}},{key:"formType",value:function formType(){var _formConfig$propertie;var formConfig=this.state.formConfig;return(_formConfig$propertie=formConfig.properties)!=null&&_formConfig$propertie.slider?'slide':'modal';}},{key:"formCompletionPercentage",value:function formCompletionPercentage(){return Math.round(this.state.currentPage/this.state.pages.length*100);}},{key:"feedbackData",value:function feedbackData(){var _this$props2=this.props,userAgent=_this$props2.userAgent,screenSize=_this$props2.screenSize,metaData=_this$props2.metaData;var _this$state4=this.state,formConfig=_this$state4.formConfig,blockState=_this$state4.blockState,feedbackId=_this$state4.feedbackId,customerId=_this$state4.customerId;var feedbackFromSendOptions=formConfig.sendOptions.data.reduce(function(allFeedback,sendOption){var field=sendOption.field,type=sendOption.type,label=sendOption.label;var _field$replace$split=field.replace(/([^1-9]+)/,'').split('_'),_field$replace$split2=(0,_slicedToArray2.default)(_field$replace$split,3),blockId=_field$replace$split2[0],extra1=_field$replace$split2[1],extra2=_field$replace$split2[2];var block=formConfig.blocks[blockId];var state=blockState[blockId];var value=getValue({block:block,state:state,extra1:extra1,extra2:extra2,type:type});var feedback={label:label,value:value,type:type.replace('image','mobile_image')};allFeedback.push(feedback);return allFeedback;},[]);var extraData=[];(0,_utils.objectKeys)(metaData).forEach(function(metaDataKey){var _metaData$metaDataKey;extraData.push({label:metaDataKey,value:(_metaData$metaDataKey=metaData[metaDataKey])!=null?_metaData$metaDataKey:'',type:'category'});});extraData.push({type:'agent',value:userAgent,label:'User Agent'});extraData.push({type:'viewport',value:screenSize,label:'Viewport'});extraData.push({type:'category',value:`Mopinion React Native SDK ${(0,_utils.getVersion)()}`,label:'SDK version'});extraData.push({value:formConfig.properties.name,type:'category',label:'Survey'});if(formConfig.sendOptions.force_customer!==false){extraData.push({value:customerId,type:'customer',label:formConfig.sendOptions.force_customer.label});}extraData.push({value:this.formCompletionPercentage(),type:'form_completion',label:'Form completion percentage'});extraData.push({value:feedbackId,type:'id',label:'Survey ID'});return[].concat((0,_toConsumableArray2.default)(feedbackFromSendOptions),extraData);}},{key:"handlePost",value:function(){var _handlePost=(0,_asyncToGenerator2.default)(function*(){var _this4=this;var completed=arguments.length>0&&arguments[0]!==undefined?arguments[0]:false;var _this$state5=this.state,formConfig=_this$state5.formConfig,didPost=_this$state5.didPost,feedbackId=_this$state5.feedbackId;var post={followup:didPost===feedbackId,surveyid:formConfig.properties.id,survey:false,data:this.feedbackData(),token:formConfig.sendOptions.token,domain:formConfig.sendOptions.domain};this.setState({postLoading:true});var success=yield(0,_api.postFeedback)(post);this.setState({postLoading:false});if(success&&!completed){this.setState(function(prevState){return Object.assign({},prevState,{didPost:prevState.feedbackId});});}if(success&&completed){var _formConfig$propertie2;this.sendFormMetricsEvent('Feedback sent');this.setState({formIsFullySubmitted:true,didPost:null,feedbackId:(0,_utils.createId)(10),customerId:(0,_utils.createId)(10)});var timeout=Number((_formConfig$propertie2=formConfig.properties)==null?void 0:_formConfig$propertie2.timeout);if(timeout){setTimeout(function(){_this4.toggleModal();},timeout);}}});function handlePost(){return _handlePost.apply(this,arguments);}return handlePost;}()},{key:"toggleModal",value:function toggleModal(force){var _this5=this;this.setState(function(prevState){return{modalVisible:typeof force!=='undefined'?force:!prevState.modalVisible};},function(){if(_this5.state.modalVisible&&!_this5.state.configWasLoaded){_this5.fetchConfig(function(){if(!_this5.props.form.webview){_this5.sendFormMetricsEvent('Form shown');}if(_this5.state.modalVisible){_this5.props.onOpen(Object.assign({formKey:_this5.props.form.formKey},_this5.state.formConfig.properties.name&&{formName:_this5.state.formConfig.properties.name}));}if(!_this5.state.modalVisible){_this5.props.onClose({event:'hidden',formKey:_this5.state.formConfig.surveyKey,formName:_this5.state.formConfig.properties.name});if(!_this5.props.form.webview){_this5.sendFormMetricsEvent('Form hidden');}}});}});}},{key:"pageValid",value:function pageValid(){var _this$state6=this.state,blockState=_this$state6.blockState,blockLayout=_this$state6.blockLayout,currentPage=_this$state6.currentPage,pages=_this$state6.pages,formConfig=_this$state6.formConfig;var pageBlocks=pages[currentPage-1];this.setState(function(prevState){return Object.assign({},prevState,{showErrorsPages:[].concat((0,_toConsumableArray2.default)(prevState.showErrorsPages),[currentPage])});});var firstInvalidBlockId;var valid=pageBlocks==null?void 0:pageBlocks.every(function(blockId){var state=blockState[blockId];var block=formConfig.blocks[blockId];if(!(state!=null&&state.isVisible)){return true;}if(block.typeName==='contact'){var contactValid=(0,_utils.objectKeys)(block.properties.elements).every(function(elementKey){var _state$element$data_f;var element=block.properties.elements[elementKey];if(element.subelements){return(0,_utils.objectKeys)(element.subelements).every(function(subElementKey){var _state$subElement$dat;var subElement=element.subelements[subElementKey];return!((_state$subElement$dat=state[subElement.data_field])!=null&&_state$subElement$dat.showError);});}return!((_state$element$data_f=state[element.data_field])!=null&&_state$element$data_f.showError);});if(!contactValid&&!firstInvalidBlockId){firstInvalidBlockId=Number(block.id);}return contactValid;}if(state.showError&&!firstInvalidBlockId){firstInvalidBlockId=Number(block.id);}return!state.showError;});if(!valid){var _blockLayout$firstInv;this.scrollTo((_blockLayout$firstInv=blockLayout[firstInvalidBlockId])==null?void 0:_blockLayout$firstInv.y);}return valid;}},{key:"setPage",value:function setPage(add){var _this6=this;var skipValidation=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(this.pageValid()||skipValidation){if(add){this.handlePost();}this.setState(function(prevState){var newPage=add?prevState.currentPage+1:prevState.currentPage-1;return{currentPage:newPage>0&&newPage<=prevState.pages.length?newPage:prevState.currentPage,direction:add?'next':'prev'};},function(){setTimeout(function(){return _this6.scrollTo(0);},500);_this6.sendFormMetricsEvent((add?'Next':'Previous')+' page');});}}},{key:"handleSubmit",value:function handleSubmit(){var postLoading=this.state.postLoading;if(!this.pageValid()||postLoading){return;}this.handlePost(true);}},{key:"setLayout",value:function setLayout(blockId,layoutData){this.setState(function(prevState){return Object.assign({},prevState,{blockLayout:Object.assign({},prevState.blockLayout,(0,_defineProperty2.default)({},blockId,layoutData))});});}},{key:"isSwiping",value:function isSwiping(_isSwiping){this.setState({isSwiping:_isSwiping});}},{key:"calcSliderHeight",value:function calcSliderHeight(){var _formConfig$propertie3,_formConfig$propertie4;var formConfig=this.state.formConfig;if(this.formType()==='modal'){return{};}var heightPerc=(_formConfig$propertie3=formConfig.properties)==null?void 0:(_formConfig$propertie4=_formConfig$propertie3.slider_props)==null?void 0:_formConfig$propertie4.max_height_perc;if(!heightPerc){return{height:'100%'};}return{height:heightPerc+'%'};}},{key:"getBlockState",value:function getBlockState(blockId){var _this$state$blockStat,_this$state7;return(_this$state$blockStat=(_this$state7=this.state)==null?void 0:_this$state7.blockState[blockId])!=null?_this$state$blockStat:{};}},{key:"render",value:function render(){var _this7=this;var form=this.props.form;var _this$state8=this.state,modalVisible=_this$state8.modalVisible,formConfig=_this$state8.formConfig,currentPage=_this$state8.currentPage,showErrorsPages=_this$state8.showErrorsPages,configWasLoaded=_this$state8.configWasLoaded,pages=_this$state8.pages,direction=_this$state8.direction,formIsFullySubmitted=_this$state8.formIsFullySubmitted,postLoading=_this$state8.postLoading,showNavAutopostPages=_this$state8.showNavAutopostPages,headerHeight=_this$state8.headerHeight;var modalStyle=[styles.modal,this.calcSliderHeight(),this.formType()==='slide'&&styles.slideStyle];if(!configWasLoaded){return null;}return(0,_jsxRuntime.jsx)(_styles.ThemeProvider,{theme:String(formConfig.theme),custom:formConfig.themeCustom,children:(0,_jsxRuntime.jsx)(_FormContext.FormContextProvider,{value:{formConfig:formConfig,currentPage:currentPage,direction:direction,pages:pages,formIsFullySubmitted:formIsFullySubmitted,showNavAutopostPages:showNavAutopostPages,formCompletionPercentage:this.formCompletionPercentage(),loading:postLoading,screenshot:this.props.screenshot,screenshotImageType:this.props.screenshotImageType,setScreenshot:function setScreenshot(props){return _this7.setScreenshot(props);},prevPage:function prevPage(){return _this7.setPage(false,true);},nextPage:function nextPage(skipValidation){return _this7.setPage(true,skipValidation);},submit:function submit(){return _this7.handleSubmit();},closeForm:function closeForm(){return _this7.toggleModal(false);},scrollTo:function scrollTo(y){return _this7.scrollTo(y);},setValue:function setValue(props){return _this7.setValue(props);},isSwiping:function isSwiping(active){return _this7.isSwiping(active);},setLayout:function setLayout(blockId,layoutData){return _this7.setLayout(blockId,layoutData);},getBlockState:function getBlockState(blockId){return _this7.getBlockState(blockId);},showErrors:showErrorsPages.includes(currentPage)},children:(0,_jsxRuntime.jsx)(_reactNative.View,{style:[styles.modalContainer,modalVisible&&styles.modalContainerShown],children:(0,_jsxRuntime.jsx)(_reactNative.SafeAreaView,{style:styles.safeArea,children:(0,_jsxRuntime.jsxs)(_ModalBox.default,{style:modalStyle,isOpen:modalVisible,swipeToClose:true,swipeArea:30,coverScreen:true,backdrop:true,backdropColor:"#000000",backdropOpacity:0.1,animationDuration:this.props.modalAnimationDuration,position:"bottom",backdropPressToClose:false,onClosed:function onClosed(){_this7.toggleModal(false);_this7.props.onClosed(_this7.state.formIsFullySubmitted);},children:[(0,_jsxRuntime.jsx)(_Header.default,{formIsOpen:this.state.modalVisible,onPressLeft:function onPressLeft(){return _this7.toggleModal(false);},title:!formIsFullySubmitted?formConfig.properties.title:formConfig.text.lastPageTitle?formConfig.text.lastPageTitle:formConfig.properties.title,formType:this.formType(),onLayout:function onLayout(event){var height=event.nativeEvent.layout.height;_this7.setState({headerHeight:height});}}),(0,_jsxRuntime.jsx)(_KeyboardScrollView.KeyboardScrollView,{style:styles.container,automaticallyAdjustContentInsets:true,additionalScrollHeight:headerHeight,keyboardShouldPersistTaps:"handled",contentContainerStyle:Object.assign({flexGrow:1,justifyContent:'flex-start'},_reactNative.Platform.OS==='android'&&{paddingBottom:24}),innerRef:function innerRef(ref){return _this7._scrollView=ref;},onScroll:this.handleScroll,scrollEventThrottle:50,scrollEnabled:!this.state.isSwiping,children:form!=null&&form.webview?this.webForm():(0,_jsxRuntime.jsx)(_FormContent.default,{})})]})})})})});}}]);}(_react.default.Component);MopinionForm.defaultProps={debug:false,domain:'app.mopinion.com',formKey:'',onClosed:function onClosed(){},modalAnimationDuration:400,metaData:{},onOpen:function onOpen(){},onFormLoaded:function onFormLoaded(){},onClose:function onClose(){},onFeedbackSent:function onFeedbackSent(){}};var styles=_reactNative.StyleSheet.create({container:{flex:1,backgroundColor:'#fff'},modalContainer:{position:'absolute',top:0,left:0,height:0,zIndex:0,elevation:0,display:'none'},modalContainerShown:{elevation:9999,zIndex:99999,display:'flex',height:_reactNative.Dimensions.get('window').height},modal:{height:'auto',zIndex:4,elevation:12,flex:1,elevation:10,overflow:'hidden',position:'absolute',top:0,bottom:0},slideStyle:{borderTopLeftRadius:20,borderTopRightRadius:20},safeArea:{flex:1}});