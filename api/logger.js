var LOG = false;
var SUBJECT = "[Mopinion SDK RN]: ";
export const logger = {
	setLog(log) {
		LOG = log;
	},
	log(value) {
		if (LOG) {
			try {
				value = JSON.stringify(value);
			} catch(e) {

			}
			console.log(SUBJECT+value);
		}
	}
};