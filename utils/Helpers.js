import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../api/logger';
import { version as sdkVersion }  from '../package.json';

/* eslint-disable indent */

// returns either a cookie value or null if the cookie expired
export const getCookie = async (cookieKey) => {
    return AsyncStorage.getItem(cookieKey)
      .then(value => {
        try {
          if(value != null) {
            const cookieobject=JSON.parse(value);
            let nowDate = new Date();
            let expiryDate = new Date(cookieobject.expires)
  
            if(cookieobject && expiryDate > nowDate ) {
              // cookie is valid, returning cookie
              return Promise.resolve(cookieobject.value);
            } else {
              // cookie is invalid or expired
            }        
          }
          return Promise.resolve(null);
        } catch(e) {
          logger.log('Error reading cookie: ' + e); // can be from bad json
          return Promise.reject(e);
        }
      })
};

export const setCookie = async (cookieKey,value,days) => {
    let expiryDate = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expiryDate = date;
    }
    const cookieobject = {
      value:value,
      expires:expiryDate
    }
    try {
      const jsonValue = JSON.stringify(cookieobject)
      await AsyncStorage.setItem(cookieKey, jsonValue)
    } catch (e) {
      // async save failed for some reason
      logger.log('Form Metrics: Error setting cookie: ' + e);
    }
};


export const appendScript = (url,{doc=document,text='',onLoad}={}) => {

  let id = url ? `srv-${url.split('/').pop().replace('.js','')}` : '';
  let head  = doc.getElementsByTagName("head")[0];
  let element = doc.getElementById(id);

  if (element) return;

  // create new script element
  let newScript   = doc.createElement('script');
  newScript.type  = 'text/javascript';
  newScript.id    = id;
  if (text) {
    newScript.textContent = text;
  } else {
    newScript.src   = url;
  }
  head.appendChild(newScript);

  if (typeof onLoad === 'function') {
    let done = false;
    newScript.onload = newScript.onreadystatechange = () => {
        if ( !done && (!newScript.readyState || newScript.readyState === "loaded" || newScript.readyState === "complete") ) {
          done = true;
          try {
              onLoad();
          } catch(e){}
        }
    };
  }
};

export function createRandomId(len=35,bits=36) { 
  let outStr = '', newStr;
  while (outStr.length < len) {
    newStr = Math.random().toString(bits).slice(2);
    outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
  }
  return outStr;
}

export function getVersion() {
  return sdkVersion ?? null;
}