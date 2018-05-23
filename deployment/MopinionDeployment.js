import React from 'react';
import PropTypes from 'prop-types';
import {
	Dimensions,
	View, 
	Platform,   
	AppState,
	AsyncStorage,
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
			screenshot:''
		};
		this.eventHandler = this.eventHandler.bind(this);
		this._handleAppStateChange = this._handleAppStateChange.bind(this);
	}
	async componentDidMount() {
		if (!this.state.deployment.length) this.fetchDeployment();
		AppState.addEventListener('change', this._handleAppStateChange);
	}
	componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
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

							forms[obj.rule_id] = {open:false};
					});
					this.setState({
						deployment:deployment,
						events:events,
						forms:forms
					},() =>{console.log(this.state)});
				}
			}
		})	
		.catch(e => console.log(e))
	}
	updateOpenState(rule_id,show,f) {
		this.setState((prevState) => {
			return {
				...prevState,
				forms: {
					...prevState.forms,
					[rule_id]: {open:show}
				}
			}
		},() => {
			typeof f === 'function' && f()
		});
	}
	eventHandler(ev) {
		const { events } = this.state;
		const update = (uri,rule) => {
			this.setState({screenshot:uri}, () => {
				this.updateOpenState(rule, true,	() => { this.refs[rule].toggleModal() })
			});
		};
		if (events.hasOwnProperty(ev)) {
			events[ev].forEach(async (o) => {

				if ( await testRuleConditions(o, ev) ) {
					//update(r)
					captureScreen({
						format: 'png',
						quality: 0.8,
						result:'base64'
					})
					.then(
						uri => update(uri,o.rule_id),
						error => update('',o.rule_id)
					);

				}
			});
		}
	}
	getForms() {
		const { deployment } = this.state;
		return deployment.map((o,i) => {
			let wrapperStyle = {
				position:'absolute',
				top:0,	
				left:0,
				width:'100%',
				height:'100%',
				zIndex:99999,
				display: this.state.forms[o.rule_id].open ? 'flex' : 'none'
			};
			return (
				<View style={wrapperStyle} key={i}>
					<Mopinion 
						form={{
							formKey:o.formKey,
							domain:o.domain,
							webview:o.webview
						}} 
						screenSize={`${Dimensions.get('window').width}x${Dimensions.get('window').height}`}
						userAgent={this.state.userAgent}
						screenshot={this.state.screenshot}
						ref={o.rule_id}
						callParentWhenClosed={()=> {this.updateOpenState(o.rule_id, false, () => {console.log(this.state)});}}						
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