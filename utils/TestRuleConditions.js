import React from 'react';
import { Platform, AsyncStorage } from 'react-native';
import { getKeys } from '../utils/getKeys';

export async function testRuleConditions(rule,event) {
	const conditions = {
		operators: {
			earlier(x,y) {return x < y},
			exactly(x,y) {return  x == y},
			later(x,y) {return x > y},
			between(x,y,z) {return (conditions.operators.later(z,x) && conditions.operators.earlier(z,y))}
		},
		// async trigger(type) {
		//     return AsyncStorage.getItem(`${rule.rule_id}.${event}`)
		// 	    .then((v) => {
		// 	    	let o = JSON.parse(v);
		// 	    	console.log(o);
		// 	    	let show = type === 'passive' ? type === 'passive' : !o.shown;
		// 	    	return show;
		// 	    });
		// },
		percentage(perc) {
			const nth = (n) => { return Math.floor(Math.random() * n) + 1 };
			let n = Math.floor(100/perc);
			return n === nth(n)
		},
		target(targetArr) {
			const testTarget = (target) => {
				let OS = Platform.OS === target.os;
				let version = !target.version.length || target.version.length && target.version.indexOf( String(Platform.Version) ) > -1;
				return OS && version;	
			};
			return targetArr.filter((o) => {return testTarget(o)}).length;
		},
		date(date) {	
			const formatString = (s) => {
				//String needs to be formatted to yyyy-mm-dd from dd-mm-yyyy
				let arr = s.split('/').reverse().join('-');
				return arr;
			};
			const formatDate = (d) => { return new Date( d.setHours(0,0,0,0) ).getTime() };
			const formatAll = (s) => { return formatDate( new Date(formatString(s)) ) }
			if (date.operator !== 'between') {
				return conditions.operators[date.operator](formatDate(new Date()),formatAll(date.date));
			} else {
				let compareDate2 = formatAll(date.date2);
				return conditions.operators[date.operator](formatAll(date.date),formatAll(date.date2),formatDate(new Date()));
			}
		},
		clock(clock) {
			let now = new Date();
			now = ('0'+now.getHours()).slice(-2) + ':' + ('0'+now.getMinutes()).slice(-2);
			if (clock.operator !== 'between') {
				return conditions.operators[clock.operator](now,clock.time);
			} else {
				return conditions.operators[clock.operator](clock.time,clock.time2,now);
			}
		},
		session(session, o) {
			const inDays = (d) => {
				return Math.ceil(d / (1000 * 3600 * 24)); 
			};
			let now = inDays(new Date().getTime());
			let prev = typeof o === 'object' && o.date ? inDays( new Date(o.date).getTime() ) : 0;

			return rule.trigger === 'passive' ? rule.trigger === 'passive' : (now - prev) > Number(session)
		}
	};

	return AsyncStorage.getItem(`${rule.rule_id}.${event}`)
	.then((v) => {
		let o;
		try {
			o = JSON.parse(v);
		} catch(e) {}
		o = o || {};

		let show = getKeys(rule).every((k) => {
			if (conditions.hasOwnProperty(k) && rule[k] && (getKeys(rule[k]).length > 0 || !isNaN(parseInt(rule[k],10))) ) {
				console.log('Checking condition -- :',k,'value',rule[k]);
				return conditions[k](rule[k],o);
			} else {
				return true;
			}
		});
		if (show) {

			AsyncStorage.setItem(`${rule.rule_id}.${event}`, JSON.stringify({
				shown:true,
				date:new Date(),
				trigger:rule.trigger,
				event:event
			}));
		}
		return show;
	})
	.catch((e) => {console.log(e)})
}