import { getCookie, setCookie, appendScript, createRandomId } from './Helpers';
import {logger} from '../api/logger';


export default class Track {

	constructor(config) {
		if(typeof(config) !== 'undefined' && config != null ) {
			this.setConfig(config);
		} else {
			this.surveyKey = null;
			this.surveyName = null;
			this.metrics = false;
		}
	}

	setConfig(config) {
		const { 
			advanced, 
			advanced: { 
				analytics_integration={}, 
				logMetrics
			} 
		} = config.properties;

		this.surveyKey = config.surveyKey;
		this.surveyName = config.properties.name;
		this.screenSize = config.screenSize;

		if (logMetrics) {
			this.metrics = true;
			logger.log('Tracking Metrics');
		}

	}


	//General
	send = (event,eventProps) => {
		if (this.metrics) {
			this.sendMetrics(event,eventProps);
		}
	}

	//Queso metrics
	sendMetrics = (event,eventProps) => {

		let sessionCookie = 'NOSESSION';

		if(this.surveyKey == null) {
			logger.log("Form metrics not ready yet for event " + event);  // error: use before init
			return;
		}

		// session ID in 'cookie', valid for 30 mins
		getCookie('SQsession')
		.then(sessionID => {
			if(!sessionID) {
				sessionCookie = createRandomId();
				setCookie('SQsession', sessionCookie, 0.5/24); // cookie for 30 mins
			} else {
				sessionCookie = sessionID;
			}

			const data = {
				project_token:this.surveyKey,
				datetime: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
				session: sessionCookie,
				url: "",
				url_title: "",
				url_referrer: "",
				host: "",
				user_agent: Platform.OS,
				browser_language: "",
				viewport: this.screenSize,
				Dextra: {
					eventName: event,
					eventProps: { ...eventProps }
				}
			};

			logger.log('Send Metrics');

			fetch('https://metrics.mopinion.com/datapoints', {
				method:'post',
				headers: {
					'Content-Type':'application/json'
				},
				body: JSON.stringify(data)
			})
			.then(r => { 
				logger.log('Metrics sent OK.'); 
				// logger.log(r)
				} )
			.catch(e => logger.log(e))
	
		})
		.catch(	err => {
			logger.log("Form Metrics: Error getting cookie");
		});

	}

}