import { AsyncStorage } from 'react-native';

export const feedback = {
	saveFeedback(feedback, callback) {
		console.log('saving feedback')
		console.log(feedback);
		AsyncStorage.getItem('feedback').then((feedbackJson) => {
			// post to API
			let success = this.postFeedback(feedback);
			if (!success) {
				console.log('not sent, save feedback in local storage');
				if (feedbackJson) {
					var feedbackArray = JSON.parse(feedbackJson);
					feedbackArray.push(feedback);
				} else {
					var feedbackArray = [feedback];
				}
				console.log('save to storage:');
				console.log(JSON.stringify(feedbackArray));
				AsyncStorage.setItem('feedback', JSON.stringify(feedbackArray));
			} else {
				console.log('feedback sent to API (not saved in storage)');
			}

			typeof callback === 'function' && callback();
		});
	},
	repostFeedback() {
		console.log('reposting feedback');
		AsyncStorage.getItem('feedback').then((feedbackJson) => {
			if (feedbackJson) {
				let feedbackArray = JSON.parse(feedbackJson);
				feedbackArray.forEach(feedback => {
					let success = this.postFeedback(feedback);
				});
			}
		});
	},
	postFeedback(feedback) {
		const url = 'https://survey.collect.mopinion.com/api/1/data';
		let data = {
			method: 'POST',
			body: JSON.stringify(feedback),
			headers: {
				token: feedback.token,
				domain: feedback.domain
			}
		};
		return fetch(url, data)
			.then(response => response.json())
			.then((response) => {
				console.log(JSON.stringify(response));
				if ('code' in response && response.code == 200) {
					return true;
				} else {
					return false;
				}
			});
	}
}

// module.exports = feedback;
