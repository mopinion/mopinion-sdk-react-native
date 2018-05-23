import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, NativeModules, View, ScrollView, StyleSheet, Text, ActivityIndicator, Platform, Animated, Keyboard, LayoutAnimation, WebView } from 'react-native';
//import * as Expo from 'expo';

import {feedback} from '../api/feedback';
import {logger} from '../api/logger';

import Modal from './ModalBox'; 
import Header from './Header';
import FormPage from './FormPage';
import { ThemeProvider } from '../core/ThemeProvider';

export class Mopinion extends React.Component {

	static defaultProps = {
		debug:false,
		domain:'app.mopinion.com',
		formKey:'',
		callParentWhenClosed:() => {},
		modalAnimationDuration:400
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
			formIsFullySubmmitted:false,
			formStatus:''
		};

		this.handleScroll = this.handleScroll.bind(this);
	}

	componentWillMount() {

		const thisRef = this;
		this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', (e) => {
			this.keyboardWillShow(e,thisRef);
		});
		this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', (e) => {
			this.keyboardWillHide(e,thisRef);
		});

		if (NativeModules.UIManager && NativeModules.UIManager.setLayoutAnimationEnabledExperimental) {
      		NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);
    	}

		// Expo.Font.loadAsync({
		// 	'FontAwesome': require('../assets/Fonts/FontAwesome.ttf')
		// });
		this.setState({isReady: true});
	}

	componentWillUnmount() {
		this.keyboardWillShowSub.remove();
		this.keyboardWillHideSub.remove();
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.modalVisible !== this.state.modalVisible) {
	// 		this.setState({modalVisible:nextProps.modalVisible}, () => {
	// 			if (!this.state.configWasLoaded)this.fetchConfig();
	// 		});
	// 	}
	// }

	async componentDidMount() {
		if (this.state.modalVisible && !this.state.configWasLoaded) this.fetchConfig();
	}

 	//Fetch form data from API async and set state
 	async fetchConfig() {

		const config = `https://${this.props.form.domain}/survey/public/json-stream?key=${this.props.form.formKey}`;
		const thisRef = this;

		fetch(config, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})
		.then(function(response) { 
			// Convert to JSON
			return response.json();
		}).then(function(json){

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
				};

				if (block.typeName === 'screenshot' && thisRef.props.screenshot != null && thisRef.props.screenshot != "") {
					//if there's a screenshot, pass it along
					obj.screenshot = thisRef.props.screenshot;
				}

				if (block.typeName === 'contact') {

					obj.sub = {};
					Object.keys(block.properties.elements).forEach((k,i) => {

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
								Object.keys(blockObj.subelements).forEach( (k2,i2) => {
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

			thisRef.setState((prevState) => {
				let messages = Object.assign(prevState.errorMessages, json.text.errors);
				return {
					elements:elements,
					formConfig:json,
					errorMessages:messages,
					configWasLoaded:true,
					breakBlocks:breakBlocks
				}
			});
		})
  }

	keyboardWillShow(event,thisRef) {
		Animated.timing(thisRef.state.keyboardHeight, {
			duration: event.duration,
			toValue: event.endCoordinates.height,
		}).start();
	}

	keyboardWillHide(event,thisRef) {
		Animated.timing(thisRef.state.keyboardHeight, {
			duration: event.duration,
			toValue: 0,
		}).start();
	}

	handleScroll(e) {
		this.scrollPosition = e.nativeEvent.contentOffset.y;
	}

	//Function for validating form elements
	validateElement(block,data) {
		const valid = (v,d,skipValue) => {
			const checkPhone = (number) => {
				return number.length > 9 && number.match(/^[\(\)\s\-\+\d]{10,17}$/)
			};

			const checkEmail = (email) => {
				return email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
			};

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
	validateForm(post,data=false) {

		const isInvalidForm = this.state.elements.map((block,i) => {

			if (block.sub && Object.keys(block.sub).length) {
				//Subelements need to be handled differently - basically do the same one layer deeper
				let subInvalid = Object.keys(block.sub).map((k) => {
					let validatedElement = this.validateElement(block.sub[k],data);
					this.updateFormStateSubElements(validatedElement,data,i,false,k);
					return {isInvalid:validatedElement.showError,element:validatedElement};
				});
				//console.log(subInvalid);
				subInvalid = subInvalid.filter((o) => {return o.isInvalid});

				return {isInvalid:subInvalid.length > 0,element:block,elementIndex:i};

			} else {
				let validatedElement = this.validateElement(block,data);
				this.updateFormStateElements(validatedElement,data,i);
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
			this.scrollTo(this.state.elements[isInvalidForm[0].elementIndex].layout.y);
		}

		if (!this.state.validateOnChange) this.setState({validateOnChange:true});

		return isInvalidForm.length === 0
	}

	//Function for updating the form state of general elements
	updateFormStateElements(obj,data,index,callback) {

		if (data.isSub) {
			//return sub validation if function is called on a subelement
			return this.updateFormStateSubElements(obj,data,index,callback,data.type);
		}

		let updateObject = obj;
		//If the value changes and we want to validate input on change prevalidate input 
		//so we can set the object state one time
		if (this.state.validateOnChange && obj.hasOwnProperty('value')) {
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
			if (callback) callback();;
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
		});
	}

	//Function for posting feedback to api as formdata
	postFeedback() {

		const objectToFormData = (formData, obj, previousKey) => {
			if (obj instanceof Object) {
				Object.keys(obj).forEach((key) => {
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

					const currentSubKey = Object.keys(feedbackObj.sub).filter((subKey) => {
						return feedbackObj.sub[subKey].field == block.field
					})[0];
					feedbackValue = feedbackObj.sub[currentSubKey] ? feedbackObj.sub[currentSubKey].value : '';

				} else if (block.field.indexOf('checkbox') > -1) {

					feedbackValue = feedbackObj.value.filter((o) => {
						return o.field == block.field
					}).length ? true : false;

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
		let uri = `https://${this.state.form.domain}/survey/public/modal?key=${this.state.form.formKey}&domain=${this.state.form.domain}&version=1.3`;
		logger.log(uri);
		return (
			<WebView
				source={{uri: uri}}
				scalesPageToFit={false}
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

					const currentSubKey = Object.keys(feedbackObj.sub).filter((subKey) => {
						return feedbackObj.sub[subKey].field == block.field
					})[0];
					feedbackValue = feedbackObj.sub[currentSubKey] ? feedbackObj.sub[currentSubKey].value : '';

				} else if (block.field.indexOf('checkbox') > -1) {

					feedbackValue = feedbackObj.value.filter((o) => {
						return o.field == block.field
					}).length ? true : false;

				} else if (block.field.indexOf('screenshot') > -1) {
					//only send screenie if value checkbox is toggled
					feedbackValue = feedbackObj.value === 'send_screenshot' && this.props.screenshot != null && this.props.screenshot != "" ? this.props.screenshot : '';
				} else {
					feedbackValue = feedbackObj.value || '';
				}
			}

			feedback.push( {
				label:block.field,
				value:feedbackValue	,
				type:block.type !== 'screenshot' && block.type !== 'image'  ? block.type : 'mobile_image'
			});
			return feedback;
		},[]);


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
				setTimeout(() => {
					thisRef.setState({formIsFullySubmmitted:true}, () => {
						//if autoclose is set
						if (thisRef.state.formConfig.timeout && typeof thisRef.state.formConfig.timeout === 'number') {
							setTimeout(() => {this.toggleModal()},thisRef.state.formConfig.timeout)
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
	toggleModal() {
		if (this.static) {
			// native static form
			this.props.mopinionEvent(null);
		} else {
	  	this.setState((prevState) => {
	  		return {
	  			modalVisible:!prevState.modalVisible
	  		}
	  	}, () => {
	  		if (this.state.modalVisible && !this.state.configWasLoaded) this.fetchConfig();
	  		if (!this.state.modalVisible) setTimeout(()=>{this.props.callParentWhenClosed()},this.props.modalAnimationDuration);
	  	});
	  }
  }

  //Function for navigating pages
  setPage(add=true, toPage=false) {

  	if (this.validateForm(false) || !add) {
    	this.setState((prevState) => {
    		const newPage = add ? prevState.currentPage + 1 : prevState.currentPage - 1;
    		return {currentPage:newPage};
    	});
    }
  }

  scrollTo(y=0) {
  	this.refs._scrollView.scrollTo({x: 0, y: y, animated: true});
  }

  setElementProps(obj,index) {
  	//this.elementProps = Object.assign([...this.elementProps],{[index]: Object.assign({}, this.elementProps[index],obj) });
  	this.setState((prevState) => {
  		return {
  			elements:Object.assign([...prevState.elements],{[index]: Object.assign({}, prevState.elements[index],obj) })
  		}
  	})
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

		return (
			<ThemeProvider
				theme={String(this.state.formConfig.theme)}
				custom={this.state.formConfig.themeCustom}
				ref={'_theme'}
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
					<Header
						onPressLeft={() => this.toggleModal()}
						title={!this.state.formIsFullySubmmitted ? this.state.formConfig.properties.title : this.state.formConfig.text.lastPageTitle ? this.state.formConfig.text.lastPageTitle : this.state.formConfig.properties.title}
					/>
					<ScrollView 
						style={styles.container}
						automaticallyAdjustContentInsets={false}
						contentContainerStyle={{flexGrow:1,justifyContent:'flex-start'}}
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