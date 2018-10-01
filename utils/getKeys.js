export const getKeys = obj => {
	if (typeof obj === 'object') {
		 return Object.keys(obj)
	} else if (typeof obj === 'string') {
		return obj.split('').map((s,i) => { return String(i)})
	} else {
		return []
	}
}