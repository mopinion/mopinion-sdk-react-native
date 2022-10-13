import AsyncStorage from '@react-native-async-storage/async-storage';

const STORE = false;

var api = {
	emptyCache() {
		AsyncStorage.removeItem('deployment');
	},
	getConfig(mopinionKey, debug) {
		if (!STORE) {
			this.emptyCache();
		}
		return AsyncStorage.getItem('deployment')
			.then((deployment) => {
				if (deployment) {
					console.log('deployment config from storage');
					// console.log(deployment);
					return JSON.parse(deployment);
				}
				this.getDeployment(mopinionKey, debug).then((deployment) => {
					if (STORE) {
						this.saveConfig(deployment);
					}
				});
				deployment = this.getDeployment(mopinionKey);
				return deployment;
			});
	},
	saveConfig(deployment) {
		console.log('saving deployment config')
		// console.log(deployment);
		// const confArray = JSON.parse(config);
		AsyncStorage.setItem('deployment', JSON.stringify(deployment));
		return true;
	},
	getDeployment(mopinionKey) {
		const url = 'https://mjolnir.mopinion.com/pastease/mobile/compact/'+mopinionKey;
		return fetch(url)
			.then((response) => response.json())
			.then((json) => {
				if ('code' in json && json.code == 200 && 'deployment' in json) {
					const deployment = json.deployment;
					// console.log(deployment);
					return deployment;
				} else {
					return [];
				}
			});
	}
};

module.exports = api;
