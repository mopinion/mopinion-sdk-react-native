import React from 'react';
import PropTypes from 'prop-types';
import {
	Dimensions,
	View,
	AppState,
} from 'react-native';
import { MopinionSDK } from './MopinionSDK';
import { testRuleConditions } from '../utils/TestRuleConditions';
import { Mopinion } from '../components/mopinionForm';
import { logger } from '../api/logger';
import { feedback } from '../api/feedback';
import { UserAgent } from '../utils/UserAgent';
import { captureScreen } from 'react-native-view-shot';
export default class MopinionDeployment extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deployment:[],
			events: {},
			forms:[],
			appState:AppState.currentState,
			userAgent:'',
			screenshot:'',
			wrapperHeight:Dimensions.get('window').height
		};
		this.eventHandler = this.eventHandler.bind(this);
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
	}
	async componentDidMount() {
		if (!this.state.deployment.length) this.fetchDeployment();
		this.changeAppStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
	}
	componentWillUnmount() {
		this.changeAppStateSubscription?.remove();
	}
	_handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      logger.log('App has come to the foreground!')
    }
		if (this.state.appState != nextAppState) {
			logger.log('app state changed to: ', nextAppState);
			// repost unsent feedback
			feedback.repostFeedback();
			// set event for active
			if (nextAppState == 'active') {
				this.fetchDeployment();
			} else if (nextAppState == 'background') {
				//api.emptyCache();
			}
		}
	}
	async fetchDeployment() {
		const { onDeploymentLoaded=()=>{}, fireWhenReady=[] } = this.props;
		let deploymentURL = `https://mjolnir.mopinion.com/pastease/mobile/compact/${this.props.deploymentID}`;
		fetch(deploymentURL, {
			method: 'GET',
			headers: {'Accept': 'application/json','Content-Type': 'application/json'}
		})
		.then((response) => response.json())
		.then((response) => {
			if (response.code == 200) {
				let deployment = response.deployment;
				if (deployment && Array.isArray(deployment)) {
					let events = {}, forms = {};
					deployment.forEach( (obj) => {
							//map events to rules
							obj.events.forEach( (ev) => {
								if (events.hasOwnProperty(ev)) {
									events[ev] = [...events[ev], obj];
								} else {
									events[ev] = [obj];
								}
								MopinionSDK.subscribe(ev, () => {this.eventHandler(ev)})
							});

							forms[obj.rule_id] = {open:false,instance:rnd()};
					});
					this.setState({
						deployment:deployment,
						events:events,
						forms:forms
					},() => {
						onDeploymentLoaded(this.state);
						fireWhenReady.forEach(ev => this.eventHandler(ev));
					});
				}
			}
		})
		.catch(e => console.log(e))
	}
	updateOpenState(rule_id,show,f, triggeredEvent, isFullySubmitted) {
		this.setState((prevState) => {
			return {
				...prevState,
				forms: {
					...prevState.forms,
					[rule_id]: { open:show,
						instance: isFullySubmitted ? rnd() : prevState.forms[rule_id].instances,
						triggeredEvent:triggeredEvent ? triggeredEvent : prevState.forms[rule_id].triggeredEvent
					}
				}
			}
		},() => {
			typeof f === 'function' && f()
		});
	}
	eventHandler(ev) {
		const { events } = this.state;
		const update = (uri,imageType,rule) => {
			this.setState({screenshot:uri, screenshotImageType:imageType}, () => {
				this.updateOpenState(rule, true,	() => { 
					this.refs[rule].toggleModal(true);
				}, ev)
			});
		};
		if (events.hasOwnProperty(ev)) {
			events[ev].map(async (o) => {
				if ( await testRuleConditions(o, ev) ) {

					try {
						captureScreen({
							format: 'png',
							quality: 0.8,
							result:'base64'
						})
						.then(
							// KvW: first run after added log, the problem was gone, but then back again
							uri => { update(uri, 'image/png', o.rule_id) } ,
							error => { update('', '', o.rule_id) }
						);
					} catch(e) {
						update('', '', o.rule_id);
					}

				}
			});
		}
	}
	handleOpen = (data) => {
		if (typeof this.props.onOpen === 'function') this.props.onOpen(data);
	}
	handleFormLoaded = (data) => {
		if (typeof this.props.onFormLoaded === 'function') this.props.onFormLoaded(data);
	}
	handleClose = (data) => {
		if (typeof this.props.onClose === 'function') this.props.onClose(data);
	}
	handleFeedbackSent = (data) => {
		if (typeof this.props.onFeedbackSent === 'function') this.props.onFeedbackSent(data);
	}
	getForms() {
		const { deployment } = this.state;
		return deployment.map((o,i) => {

			let form = this.state.forms[o.rule_id];

			if(!form.open){
				return null;
			}

			let wrapperStyle = {
				position:'absolute',
				top:0,
				left:0,
				width:'100%',
				height:form.open ? this.state.wrapperHeight : 0,
				zIndex:form.open ? 99999 : 0,
				display: form.open ? 'flex' : 'none',
				elevation:form.open  ? 9999 : 0
			};
			return (
				<View 
					style={wrapperStyle} 
					key={o.rule_id + form.instance}
					onLayout={() => this.setState({wrapperHeight:Dimensions.get('window').height})}
				>
					<Mopinion
						form={{
							formKey:o.formKey,
							domain:o.domain,
							trigger:o.trigger,
							webview:o.webview
						}}
						screenSize={`${Math.round(Dimensions.get('window').width)}x${Math.round(Dimensions.get('window').height)}`}
						userAgent={this.state.userAgent}
						screenshot={this.state.screenshot}
						ref={o.rule_id}
						callParentWhenClosed={ (isFullySubmitted) => {
								this.updateOpenState(o.rule_id, false, () => {}, undefined, isFullySubmitted);
							}
						}
						triggeredEvent={form.triggeredEvent}
						onOpen={this.handleOpen}
						onFormLoaded={this.handleFormLoaded}
						onClose={this.handleClose}
						onFeedbackSent={this.handleFeedbackSent}
						{...this.props}
					/>
					{!this.state.userAgent ? (this.getUserAgent()) : null}
				</View>
			);
		});
	}
	getUserAgent() {
		return (
			<UserAgent
				setUserAgent={(ua) => { this.setState({userAgent:ua},() => {console.log(this.state)}) }}
			/>
		)
	}
	render() {
		return this.getForms()
	}
}

function rnd() {
	return Math.random().toString(36)
}
