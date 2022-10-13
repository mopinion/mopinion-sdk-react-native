import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, Dimensions, NativeModules, View, ScrollView, StyleSheet, Text, ActivityIndicator, Platform, Animated, Keyboard, LayoutAnimation, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
//import * as Expo from 'expo';
import {feedback} from '../api/feedback';
import {logger} from '../api/logger';

import Modal from './ModalBox';
import Header from './Header';
import FormPage from './FormPage';
import { ThemeProvider } from '../core/ThemeProvider';

import { getKeys } from '../utils/getKeys';

import Track from '../utils/Track';

let CLICKED_ELEMENT = '';

export class Mopinion extends React.Component {

	static defaultProps = {
		debug:false,
		domain:'app.mopinion.com',
		formKey:'',
		callParentWhenClosed:() => {},
		modalAnimationDuration:400,
		metaData: {},
		formType:'modal',
		onOpen:() => {},
		onFormLoaded:() => {},
		onClose:() => {},
		onFeedbackSent:() => {}
	};

	constructor(props){
		super(props);
		logger.setLog(props.log);
		//this.modalVisible = props.modalVisible ? props.modalVisible : false;
		this.static = props.static ? props.static : false;
		logger.log("static: "+this.static);

		this.state = {
			form:props.form,
			configWasLoaded:false,
			modalVisible:props.modalVisible ? props.modalVisible : false,
			validateOnChange:false,
			elements:[],
			formConfig:{
				properties:{},
				blocks:{},
				text:{},
				layout:[],
				theme:'isLoading',
				themeCustom:{}
			},
			errorMessages: {
				deflt: 'Something went wrong',
        		required: 'This field is required',
		        required_multi: 'All fields are required',
		        invalid_number: 'This is not a valid number',
		        invalid_phone: 'This is not a valid phone number',
		        invalid_email: 'This is not a valid email address',
		        too_short: 'The answer is too short',
		        too_long: 'The answer is too long'
			},
			currentPage:1,
			keyboardHeight:new Animated.Value(0),
			isSwiping:false,
			modalStyle:'small',
			modalBackdrop:true,
			isFetchConfigInProgress:false,
			formIsFullySubmmitted:false,
			formStatus:'',
			formType:props.formType
		};

		this.handleScroll = this.handleScroll.bind(this);
		this.track = new Track();
	}

	UNSAFE_componentWillMount() {


		const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
		const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

		this.keyboardWillShowSub = Keyboard.addListener(showEvent, this.keyboardShown);
		this.keyboardWillHideSub = Keyboard.addListener(hideEvent, this.keyboardHidden);

		if (NativeModules.UIManager && NativeModules.UIManager.setLayoutAnimationEnabledExperimental) {
      		NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);
    	}

		this.setState({isReady: true});
	}

	handleBackHandler = () => {
		if (this.state.modalVisible) {
			this.toggleModal();
			return true
		}
		return false
	}

	componentWillUnmount() {
		this.keyboardWillShowSub.remove();
		this.keyboardWillHideSub.remove();

		BackHandler.removeEventListener('hardwareBackPress', this.handleBackHandler)
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.modalVisible !== this.state.modalVisible) {
	// 		this.setState({modalVisible:nextProps.modalVisible}, () => {
	// 			if (!this.state.configWasLoaded)this.fetchConfig();
	// 		});
	// 	}
	// }

	async componentDidMount() {
		if (this.state.modalVisible && !this.state.configWasLoaded) {
			this.fetchConfig( () => {
				if(this.static) {
					// static forms open immediately without first calling toggleModal , so send metrics here.
					// now after the callback from fetchConfig the .track object is set and loaded
					this.sendFormMetricsEvent("Form shown");
				}
			});
		}

		BackHandler.addEventListener('hardwareBackPress', this.handleBackHandler);
	}

 	//Fetch form data from API async and set state
 	async fetchConfig(callbackConfigWasLoaded) {

		const config = `https://${this.props.form.domain}/survey/public/json-stream?key=${this.props.form.formKey}`;
		const thisRef = this;

		fetch(config, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})
		.then(r => r.json())
		.then(json => {

			let page = 1;
			let breakBlocks = {};
			const elements = json.layout.reduce((allElements, block_id) =>  {
				const block = json.blocks[block_id];
				const obj = {
					field:block.typeName + '_' + block.id,
					label:block.id,
					data_field:block.data_field,
					value:block.properties.value ? block.properties.value :  '',
					type:block.typeName,
					error:'',
					required:block.properties && block.properties.required,
					page:page,
					isVisible:!block.properties.hide_on_init,
					normalizedLogic: json.blockRules.hasOwnProperty(block.id) ? json.blockRules[block.id].map((rule) => {

						if (typeof rule === 'object') {
							if (rule.condition.elements) {
								rule.condition.testValue = rule.condition.elements.map((elementAsIndex, i) => {

									if ( ['gcr','radio','checkbox','select','thumbs','category'].indexOf(block.typeName) > -1  || (block.typeName === 'rating' && block.properties.labelsAsValue) ) {

										let propPath = block.typeName === 'rating' && block.properties.type === 'emoji' ? block.properties.emoji : block.properties.elements;
										for (var k in propPath) {
											if (k == elementAsIndex) {
												return String(propPath[k].value ? propPath[k].value : propPath[k].label);
											}
										}

									} else {

										return String(elementAsIndex);
									}

								});
							} else if (rule.condition.trigger_element){
								rule.condition.testValue = [rule.condition.trigger_element];
							}

							return rule
						} else {
							return {}
						}
					}) : [],
				};

				if (block.typeName === 'screenshot' && thisRef.props.screenshot != null && thisRef.props.screenshot != "") {
					//if there's a screenshot, pass it along
					obj.screenshot = thisRef.props.screenshot;
				}

				if (block.typeName === 'contact') {

					obj.sub = {};
					getKeys(block.properties.elements).forEach((k,i) => {

						let blockObj = block.properties.elements[k];
						if (blockObj.show) {
							if (k !== 'name' || blockObj.combine) {
								obj.sub[k] = {
									field:block.typeName + '_' + block.id + '_' + k,
									data_field:blockObj.data_field,
									value:'',
									error:'',
									isEmail:k === 'email',
									isPhone:k === 'phone' || k === 'phone2',
									required:blockObj.required,
									page:page,
									isSub:true
								};
							} else {
								getKeys(blockObj.subelements).forEach( (k2,i2) => {
									obj.sub[k2.replace('last','')] = {
										field:block.typeName + '_' + block.id + '_' + k2.replace('last',''), /* Last is just name... */
										data_field:blockObj.subelements[k2].data_field,
										value:'',
										error:'',
										required:blockObj.required,
										page:page,
										isSubSub:true
									};
								});
							}
						}
					});
				}

				if (block.typeName === 'checkbox') {
					obj.options = block.properties.elements;
				}

				if (block.typeName !== 'page_break') {
					allElements.push(obj)
				} else if (block.typeName === 'page_break') {
					breakBlocks[page] = {
						page:page,
						prevLabel:block.properties.prevLabel,
						nextLabel:block.properties.nextLabel
					};
					page++
				}

				return allElements;
			},[]);

			json.text = JSON.parse(json.text);

			LayoutAnimation.configureNext({
		      duration: 425,
		      create: {
		        type: LayoutAnimation.Types.spring,
		        property: LayoutAnimation.Properties.opacity,
		        springDamping: 0.7,
		      },
		      update: {
		        type: LayoutAnimation.Types.spring,
		        springDamping: 0.7,
		      },
		    });

			//init tracker with surveykey and name
			const trackerConfig = {
				...json,
				screenSize:thisRef.props.screenSize
			}
			if(thisRef.track == null) {
				thisRef.track = new Track(trackerConfig);
			} else {
				thisRef.track.setConfig(trackerConfig); // instead of this.state.formConfig
			}

			thisRef.setState((prevState) => {
				let messages = Object.assign(prevState.errorMessages, json.text.errors);
				return {
					elements:elements,
					formConfig:json,
					errorMessages:messages,
					configWasLoaded:true,
					breakBlocks:breakBlocks
				}
			}, () => {
				this.props.onFormLoaded({
					event:'shown',
					formKey:this.state.formConfig.surveyKey,
					formName:this.state.formConfig.properties.name
				});

				if(typeof(callbackConfigWasLoaded) === 'function') {
					callbackConfigWasLoaded();
				}
			});
		})
  }

	keyboardShown = event => {
		Animated.timing(this.state.keyboardHeight, {
			duration: 175,
			toValue: event.endCoordinates.height,
			useNativeDriver: false
		}).start(() => this.scrollTo(this.scrollPosition + event.endCoordinates.height));
	}

	keyboardHidden = event => {
		Animated.timing(this.state.keyboardHeight, {
			duration: 175,
			toValue: 0,
			useNativeDriver: false
		}).start();
	}

	handleScroll(e) {
		this.scrollPosition = e.nativeEvent.contentOffset.y;
	}

	//Function for validating form elements
	validateElement(block,parentBlock={}) {
		const valid = (v,d,skipValue) => {
			const checkPhone = (number) => {
				return number.length > 9 && number.match(/^[\(\)\s\-\+\d]{10,17}$/)
			};

			const checkEmail = (email) => {
				return email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
			};

			if (!d.isVisible && !d.isSub) {
				return {showError:false,error:''};
			}

			if (getKeys(parentBlock).length && !parentBlock.isVisible) return {showError:false,error:''};

			if (!String(v) && !skipValue) {
				return {showError:true,error:this.state.errorMessages['required']};
			}

			if (v && d.isEmail) {
				return {showError:!checkEmail(v),error:this.state.errorMessages['invalid_email']};
			} else if (v && d.isPhone) {
				return {showError:!checkPhone(v),error:this.state.errorMessages['invalid_phone']};
			} else {
				return {showError:false,error:''};
			}
		};

		if (block.page !== this.state.currentPage || //skip if not on currently active page
			(!block.required && !block.isEmail && !block.isPhone) ) {
			return Object.assign({},block,{showError:false});
		} else if (!block.required && (block.isPhone || block.isEmail) ) {
			return Object.assign({},block,valid(block.value,block,true));
		} else {
			return Object.assign({},block,valid(block.value,block));
		}
	}


	//Function for validating the entire form or page
	validateForm(post) {

		const isInvalidForm = this.state.elements.map((block,i) => {

			if (block.sub && getKeys(block.sub).length) {
				//Subelements need to be handled differently - basically do the same one layer deeper
				let subInvalid = getKeys(block.sub).map((k) => {
					let validatedElement = this.validateElement(block.sub[k],block);
					this.updateFormStateSubElements(validatedElement,{fromValidator:true},i,false,k);
					return {isInvalid:validatedElement.showError,element:validatedElement};
				});
				//console.log(subInvalid);
				subInvalid = subInvalid.filter((o) => {return o.isInvalid});

				return {isInvalid:subInvalid.length > 0,element:block,elementIndex:i};

			} else {
				let validatedElement = this.validateElement(block);
				this.updateFormStateElements(validatedElement,{fromValidator:true},i);
				return {isInvalid:validatedElement.showError,element:validatedElement,elementIndex:i};
			}
		}).filter((o) => {
			return o.isInvalid
		});

		if (!isInvalidForm.length && post) {
			this.setState({
				formStatus:'posting'
			}, () => {
				this.saveData();
			})

		}

		if (isInvalidForm.length) {
			try {
				this.scrollTo(this.state.elements[isInvalidForm[0].elementIndex].layout.y);
			} catch(e) {
				console.log(e,this.state.elements[isInvalidForm[0].elementIndex]);
			}
		}

		if (!this.state.validateOnChange) this.setState({validateOnChange:true});

		return isInvalidForm.length === 0
	}

	//Function for updating the form state of general elements
	updateFormStateElements(obj,data={},index,callback) {

		if (!data.hasOwnProperty('isLogicUpdate') && !data.fromValidator) {
			CLICKED_ELEMENT = this.state.elements[index].field;
		}

		if (data.isSub) {
			//return sub validation if function is called on a subelement
			return this.updateFormStateSubElements(obj,data,index,callback,data.type);
		}

		let updateObject = obj;
		//If the value changes and we want to validate input on change prevalidate input
		//so we can set the object state one time
		if (this.state.validateOnChange && obj.hasOwnProperty('value') && !data.hasOwnProperty('isLogicUpdate')) {
			const preValidateBlock = Object.assign({},this.state.elements[index], obj);
			updateObject = Object.assign(
				{},
				this.validateElement(preValidateBlock, data),
				obj
			);
		}

		this.setState((prevState) => {
			return {
				elements: Object.assign(
					[...prevState.elements],
					{ [index] : Object.assign({}, prevState.elements[index], updateObject) }
				)
	       	}
		},() => {
			if (callback) callback();
			if (this.state.elements[index].normalizedLogic.length && !data.fromValidator) this.logic(this.state.elements[index]);
		});
	}

	//Function for updating the form state of sub elements
	//Try to fuse with general reducer?
	updateFormStateSubElements(obj,data,index,callback,key) {
		let updateObject = obj;
		if (this.state.validateOnChange && obj.hasOwnProperty('value')) {
			const preValidateBlock = Object.assign({},this.state.elements[index].sub[key], obj);
			updateObject = Object.assign(
				{},
				this.validateElement(preValidateBlock, data),
				obj
			);
		} else {
			updateObject = Object.assign({},this.state.elements[index].sub[key], obj);
		}

		this.setState((prevState) => {
			return {
				elements: Object.assign(
					[...prevState.elements],
					{
						[index]: {
							...prevState.elements[index],
							sub: {
								...prevState.elements[index].sub,
								[key]:updateObject
							}
						}
					}
				)
	       	}
		},() => {
			if (callback) callback();
			if (this.state.elements[index].normalizedLogic.length) this.logic(this.state.elements[index]);

		});
	}

	logic(element) {

		const operatorFn = {
			//equals
			'==='(x,y) {return x == y},
			//does not equal
			'!=='(x,y) {return x != y},
			//contains
			'*'(x,y) {return x.indexOf(y) > -1},
			//does not contain
			'!*'() {return x.indexOf(y) == -1}
		};

		let { elements, formConfig: {blocks}} = this.state;

		const checkRule = (rule={}) => {
			let { action, condition } = rule;

			if (typeof action === 'object' && typeof condition === 'object' && Array.isArray(condition.testValue) ) {

				//if (['input','keydown','keyup'].indexOf(rule.trigger) > -1 && event !== 'input') return;
				//if (['blur','focus'].indexOf(rule.trigger) > -1 && event !== 'change') return;

				let show = action.action == 'show';
				let operator = operatorFn.hasOwnProperty(condition.operator) ? operatorFn[condition.operator] : () => {};
				action.targets.forEach((target) => {
					//let elementIndex = this.state.elements.findIndex(el => el.field == target);
					let elementIndex = this.state.elements.findIndex( el => el.field == target);

					if (elementIndex == -1) {
						elementIndex = this.state.elements.findIndex( el => el.hasOwnProperty(target));

						if (elementIndex == -1) return
					}
					// let findElement = elements.filter(el => el.field == target)[0];
					// let elementIndex = findElement ? findElement.elementIndex : -1;

					let fromBlock =  blocks[element.id];
					let conditionsTrue = condition.testValue.filter(v => {
						if (Array.isArray(element.value)) {

							return element.value.filter(x => operator(x.value,v)).length > 0;

						} else {
							return operator( element.value, v)
						}
					})
					let showElement;
					if (condition.concat !== '&&') {
						showElement = conditionsTrue.length ? show : !show;
					} else {
						showElement = conditionsTrue.length == condition.testValue.length ? show : !show;
					}
					let update = {
						isVisible:showElement,
						fromClickedElement:''
					};

					if (!showElement) {
						if (this.state.elements[elementIndex].value) update.prevValue = this.state.elements[elementIndex].value;
						update.value = '';
					} else if (showElement) {
						if (this.state.elements[elementIndex].prevValue) {
							update.value = this.state.elements[elementIndex].prevValue;
							update.prevValue = '';
						}
					}

					if (element.field === CLICKED_ELEMENT) {
						update.fromClickedElement = element.field;
					}

					if (!showElement && element.field !== CLICKED_ELEMENT && this.state.elements[elementIndex].fromClickedElement === CLICKED_ELEMENT) {
						return
					}

					this.updateFormStateElements(update, {isLogicUpdate:true}, elementIndex)
				});
			}
		};

		element.normalizedLogic.forEach(rule => checkRule(rule));
	}

	// internal helper to send a formMetrics event with implicit eventProps
	sendFormMetricsEvent(metricsEvent) {
		// formConfig must have been loaded in advance 
		if(this.track != null && this.state.configWasLoaded) {
			this.track.send(metricsEvent, {
				event_trigger:this.props.triggeredEvent,
				trigger_method:this.props.form.trigger,
				form_completion_percentage: this.state.formIsFullySubmmitted ? 100 : Math.round(( Math.max(this.state.currentPage-1,0) / Object.keys(this.state.formConfig.pageMap).length) * 100),
				active_page:this.state.currentPage,
				page_count:Object.keys(this.state.formConfig.pageMap).length,
				form_type:this.state.formType,
				subdomain:this.props.form.domain,
				organisation_id:this.state.formConfig.properties.organisation_id,
				project_id:this.state.formConfig.properties.project_id
			});
		}
	}

	//Function for posting feedback to api as formdata
	postFeedback() {

		const objectToFormData = (formData, obj, previousKey) => {
			if (obj instanceof Object) {
				getKeys(obj).forEach((key) => {
					const value = obj[key];
					if (value instanceof Object && !Array.isArray(value)) {
						return objectToFormData(formData, value, key);
					}
					if (previousKey) {
						key = `${previousKey}[${key}]`;
					}
					if (Array.isArray(value)) {
						value.forEach((val,i) => {
							return objectToFormData(formData,val,`${key}[${i}]`);
						});
					} else {
						formData.append(key, value);
					}
				});
				return formData
			}
		};

		const domain = this.state.formConfig.sendOptions.domain;
		const url = `https://${domain}/survey/public/send`;

		const feedback = this.state.formConfig.sendOptions.data.reduce( (feedback,block) => {
			const feedbackObj = this.state.elements.filter( (o) => {
				return block.field.indexOf(o.field) > -1
			})[0];

			let feedbackValue = '';
			if (typeof feedbackObj === 'object') {
				if (feedbackObj.sub && block.field.indexOf('contact') > -1) {

					const currentSubKey = getKeys(feedbackObj.sub).filter((subKey) => {
						return feedbackObj.sub[subKey].field == block.field
					})[0];
					feedbackValue = feedbackObj.sub[currentSubKey] ? feedbackObj.sub[currentSubKey].value : '';

				} else if (block.field.indexOf('checkbox') > -1) {

					try {
						feedbackValue = feedbackObj.value.filter((o) => {
							return o.field == block.field
						}).length ? true : false;
					} catch(e) {
						feedbackValue = false;
					}

				} else {
					feedbackValue = feedbackObj.value || '';
				}
			}

			feedback.push( {
				label:block.field,
				value:feedbackValue	,
				type:block.type
			});
			return feedback;
		},[]);

		const data = {
			token: this.state.formConfig.sendOptions.token,
			domain: domain,
			surveyId: this.state.formConfig.properties.id,
			ip:this.state.formConfig.cip,
			data: {feedback:feedback}
		};

		const formData = objectToFormData(new FormData(), data);
		const thisReference = this;

		//console.log('Posting formdata',formData);

		fetch(url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
				'token': this.state.formConfig.sendOptions.token
			}),
			body: formData
		}).then(function(response) {
			logger.log(response);
			// Convert to JSON
			return response.json();
		}).then(function(json){
			if (json.code == 200) {
				thisReference.setState({formStatus:'done-posting'}, () => {
					setTimeout(() => {thisReference.setState({formIsFullySubmmitted:true})},300)
				})
			}

		}).catch(function(err) {
			//console.log(err); //:(
		});
	}

  	mopinionEvent(id) {
		this.props.mopinionEvent(id);
	}

	webForm() {
		const uri = `https://${this.state.form.domain}/survey/public/webview?key=${this.state.form.formKey}&domain=${this.state.form.domain}`;
		const { metaData={} } = this.props;

		logger.log(uri);

		const handleFeedbackSent = data => {

			let parsed = {};
			try {
				parsed = JSON.parse(data);
			} catch(e) {}

			this.props.onFeedbackSent({
				event:'feedback_sent',
				formKey:this.state.formConfig.surveyKey,
				formName:this.state.formConfig.properties.name,
				feedback:parsed.feedback
			});
		}

		const handleWebviewEvent = data => {
			let parsed = {};
			try {
				parsed = JSON.parse(data);

				switch(parsed.event) {
					case 'feedback_sent':
						handleFeedbackSent(data);
						break;
					case 'hidden':
						//if autoclose is set
						if (this.state.formConfig.properties.timeout && typeof this.state.formConfig.properties.timeout === 'number') {
							this.props.callParentWhenClosed(this.state.formIsFullySubmmitted);
						}
						break;
					default:
						logger.log('Ignoring unsupported webview event: ' + parsed.event);
				}
			} catch(e) {
				logger.log('Error parsing webview event: ' + e)
			}
			
		}

		const injectMetaData = `(function() {
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
		})();`;

		return (
			<WebView
				source={{uri: uri}}
				scalesPageToFit={false}
				injectedJavaScript={injectMetaData}
				onMessage={e => handleWebviewEvent(e.nativeEvent.data)}
			/>
		);
	}

	saveData() {

		let data = this.state.formConfig.sendOptions.data.reduce( (feedback,block) => {
			let feedbackObj = this.state.elements.filter( (o) => {
				return block.field.indexOf(o.field) > -1
			})[0];

			let feedbackValue = '';
			if (typeof feedbackObj === 'object') {
				if (feedbackObj.sub && block.field.indexOf('contact') > -1) {

					const currentSubKey = getKeys(feedbackObj.sub).filter((subKey) => {
						return feedbackObj.sub[subKey].field == block.field
					})[0];
					feedbackValue = feedbackObj.sub[currentSubKey] ? feedbackObj.sub[currentSubKey].value : '';

				} else if (block.field.indexOf('checkbox') > -1) {

					try {
						feedbackValue = feedbackObj.value.filter((o) => {
							return o.field == block.field
						}).length ? true : false;
					} catch(e) {
						feedbackValue = false;
					}

				} else if (block.field.indexOf('screenshot') > -1) {
					//only send screenie if value checkbox is toggled
					if (feedbackObj.value === 'send_screenshot') {
						feedbackValue = feedbackObj.screenshot ? feedbackObj.screenshot : this.props.screenshot
						if (feedbackValue == null) { 
							feedbackValue = '';
						}
					} else {
						feedbackValue = '';
					}
				} else {
					feedbackValue = String(feedbackObj.value) || '';
				}
			}

			feedback.push( {
				label:block.label,
				value:feedbackValue,
				type:block.type !== 'screenshot' && block.type !== 'image'  ? block.type : 'mobile_image'
			});
			return feedback;
		},[]);

		const { metaData } = this.props;
		getKeys(metaData).forEach(metaDataKey => {
			data.push({
				label:metaDataKey,
				value:metaData[metaDataKey] ?? '',
				type:'category'
			});
		});
		// logger.log("data");
		// logger.log(this.state.formConfig.sendOptions.data);
		// user agent
		data.push({
			type: 'agent',
			value: this.props.userAgent,
			label: 'User Agent'
		});
		// screen size
		data.push({
			type: 'viewport',
			value: this.props.screenSize,
			label: 'Viewport'
		});

		// make complete API post
		let post = {
			followup: false,
			surveyid: this.state.formConfig.properties.id,
			survey: false,
			data: data,
			token: this.state.formConfig.sendOptions.token,
			domain: this.state.formConfig.sendOptions.domain,
		};

		const thisRef = this;
		feedback.saveFeedback(post, () => {
			thisRef.setState({formStatus:'done-posting'}, () => {

				this.props.onFeedbackSent({
					event:'feedback_sent',
					formKey:this.state.formConfig.surveyKey,
					formName:this.state.formConfig.properties.name,
					feedback:data
				});

				setTimeout(() => {
					thisRef.setState({formIsFullySubmmitted:true}, () => {
                        this.sendFormMetricsEvent("Feedback sent");

						//if autoclose is set; -1 is don't show, null or 0 is don't close
						if(thisRef.state.formConfig.properties.timeout!=0) {							
							if (thisRef.state.formConfig.properties.timeout && typeof thisRef.state.formConfig.properties.timeout === 'number') {
								setTimeout(() => {this.toggleModal()},thisRef.state.formConfig.properties.timeout)
							}
						}
					})
				},300)
			})
		});
		// finito
		//this.postFinished();
	}
	// postFinished() {
	// 	this.props.mopinionEvent(null);
	// }

	//Function for toggeling modal visibility
	toggleModal(force) {
		if (this.static) {
			// native static form
			this.props.mopinionEvent(null);
			if (this.state.modalVisible) {
				this.props.onClose({
				  event:'hidden',
				  formKey:this.state.formConfig.surveyKey,
				  formName:this.state.formConfig.properties.name
			  });

			  this.sendFormMetricsEvent("Form hidden");
			}

		} else {

            this.setState((prevState) => {
                return {
                    modalVisible:typeof(force) !== 'undefined' ? force : !prevState.modalVisible                }
            }, () => {
				if (this.state.modalVisible && !this.state.configWasLoaded) {

					if(!this.state.isFetchConfigInProgress) {
						this.setState( {
							isFetchConfigInProgress: true
						}, () => {
							this.fetchConfig( () => {
								// now after the callback from fetchConfig the .track object is set and loaded
								if(!this.props.form.webview) {
									this.sendFormMetricsEvent("Form shown");
								}
								this.setState( {
									isFetchConfigInProgress: false
								})
							});	
						})
					}
				}

				// no need to check this.static as a static form is already open and hence won't call the onOpen here
				if (this.state.modalVisible) {
					this.props.onOpen({
							formKey:this.props.form.formKey,
							...(this.state.formConfig.properties.name && {
								formName:this.state.formConfig.properties.name
							})
						});
				}

				if (!this.state.modalVisible) {
					this.props.onClose({
						event:'hidden',
						formKey:this.state.formConfig.surveyKey,
						formName:this.state.formConfig.properties.name
					});

					if(!this.props.form.webview) {
						this.sendFormMetricsEvent("Form hidden");
					}

					setTimeout(()=>{this.props.callParentWhenClosed(this.state.formIsFullySubmmitted)},this.props.modalAnimationDuration);
				}

			});
		}
	}

  //Function for navigating pages
  setPage(add=true, toPage=false) {

  	if (this.validateForm(false) || !add) {
    	this.setState((prevState) => {
    		const newPage = add ? prevState.currentPage + 1 : prevState.currentPage - 1;
    		return {currentPage:newPage};
    	},() => {
			this.sendFormMetricsEvent((add ? 'Next' : 'Previous') + " page");
		});
    }
  }

  scrollTo = (y=0) => {
  	this.refs._scrollView && this.refs._scrollView.scrollTo({x: 0, y: y, animated: true});
  }

  setElementProps(obj,index) {
  	//this.elementProps = Object.assign([...this.elementProps],{[index]: Object.assign({}, this.elementProps[index],obj) });
  	this.setState((prevState) => {
  		return {
  			elements:Object.assign([...prevState.elements],{[index]: Object.assign({}, prevState.elements[index],obj) })
  		}
  	},(s) => {console.log(obj)})
  }

  getPage() {

  	let pageProps = {
  		elements:this.state.elements,
  		config:this.state.formConfig,
  		blocks:this.state.formConfig.blocks,
  		currentPage:this.state.currentPage,
  		formIsFullySubmmitted:this.state.formIsFullySubmmitted,
  		formStatus:this.state.formStatus,
  		breakBlocks:this.state.breakBlocks,
  		setPage:(i) => {this.setPage(i)},
  		scrollPage:(y) => {this.scrollTo(y)},
  		updateFormState:(value,data,index) => {this.updateFormStateElements(value,data,index)},
  		validateAndPost:() => {this.validateForm(true)},
  		setElementProps:(obj,index) => {this.setElementProps(obj,index)},
  		isSwiping:(swipeActive) => {this.isSwiping(swipeActive)},
  	};

		return (
			<FormPage {...pageProps} />
		);
  }

  isSwiping(swipeActive) {
  	this.setState({
  		isSwiping:swipeActive
  	})
  }

  loading() {

  	let loaderContainerStyle = {
			backgroundColor:'#fff',
			alignItems:'center',
		  justifyContent:'center',
		  flex:1,
		  position:'absolute',
		  height:Dimensions.get('window').height,
		  width:Dimensions.get('window').width,
		  zIndex:100
  	};

  	let loaderTextStyle = {
  		marginTop:20,
  		color:'rgba(0,0,0,.3)',
  		fontSize:12
  	};

	  return (
    	<View style={loaderContainerStyle}>
    		<ActivityIndicator size='large' color='rgba(0,0,0,.3)' />
    		<Text style={loaderTextStyle}>Loading...</Text>
    	</View>
    );
  }

	render() {

		const { form } = this.props;

		//console.log(this.refs._scrollView)

		return (
			<ThemeProvider
				theme={String(this.state.formConfig.theme)}
				custom={this.state.formConfig.themeCustom}
			>
				<Modal
					ref={"mopinion"}
					backdrop={true}
					style={styles.modal}
					isOpen={this.state.modalVisible}
					swipeToClose={false}
					swipeArea={30}
					keyboardTopOffset={0}
					coverScreen={this.state.modalStyle == 'fill'}
					backdrop={this.state.modalBackdrop}
					backdropColor={'#000'}
					backdropOpacity={.3}
					startOpen={this.static}
					animationDuration={this.static ? 0 : this.props.modalAnimationDuration}
				>
					<SafeAreaView style={{flex:1}}>
						<Header
							onPressLeft={() => this.toggleModal()}
							title={!this.state.formIsFullySubmmitted ? this.state.formConfig.properties.title : this.state.formConfig.text.lastPageTitle ? this.state.formConfig.text.lastPageTitle : this.state.formConfig.properties.title}
						/>
						<ScrollView
							style={styles.container}
							automaticallyAdjustContentInsets
							contentInsetAdjustmentBehavior="automatic"
							contentContainerStyle={{
								flexGrow:1, 
								justifyContent:'flex-start', 
								...(Platform.OS === 'android' && {paddingBottom:24})
							}}
							ref='_scrollView'
							onScroll={this.handleScroll}
							scrollEventThrottle={50}
							scrollEnabled={!this.state.isSwiping}

						>
							<Animated.View
								style={{
									flex:1,
									paddingBottom:this.state.keyboardHeight
								}}
							>
								{
									typeof form === 'object' && form.webview ? this.webForm()
									: this.state.configWasLoaded ? this.getPage() : this.loading()
								}
							</Animated.View>
						</ScrollView>
					</SafeAreaView>
				</Modal>
			</ThemeProvider>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	modal: {
		position: "absolute",
		zIndex: 4,
		elevation: 4,
		top:0,
		bottom:0,
		left:0,
		right:0
	},
	toolbar: {
		flex:1
	}
});
