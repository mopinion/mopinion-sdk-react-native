import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import TextBlock from './TextBlock';
import RadioCheckBlock from './RadioCheckBlock';
import SelectBlock from './SelectBlock';
import ErrorMessage from './ErrorMessage';

export default class ContactBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  bubbleUpValueChange(value,data) {
    this.props.onFormGroupValueChange(value,data);
  }

  checkBlockType() {

    const { data, formGroupState } = this.props;

    const showElements = Object.keys(data.properties.elements).filter((key) => {
      return data.properties.elements[key.replace('last')].show
    });

    return showElements.map((key,i) => {

      let obj = data.properties.elements[key];
      let subProps = {
        data:{...obj, 
          type:key, 
          isSub:true, 
          properties: {
            placeholder:obj.placeholder ? obj.placeholder : {},
            elements:obj.options ? obj.options : {}
          },
        },
        onFormGroupValueChange:(value,data) => {this.bubbleUpValueChange(value,data)},
        formGroupState:formGroupState.sub[key],
        placeholder:obj.placeholder
      };

      let viewProps = {
        key:i,
        style:i !== (showElements.length - 1) ? styles.bottomSpacing : {}
      };

      if (key == 'title') {
        return (
          <View {...viewProps}>
            <SelectBlock {...subProps} />
          </View>
        );

      } else if (key == 'name'|| key === 'email' || key === 'phone' || key === 'phone2') {

        if (key !== 'name' || key === 'name' && obj.combine) {
          return (
            <View {...viewProps}>
              <TextBlock {...subProps} />
            </View>
          );
        } else if (key === 'name' && !obj.combine) {

          let firstNameSubProps = Object.assign({}, subProps, {
            data: {
              ...subProps.data,
              type:'firstname',
              properties:{
                placeholder:obj.subelements['firstname'].placeholder
              },
            },
            type:'firstname',
            formGroupState:formGroupState.sub['firstname'],
            
          });

          let lastNameSubProps = Object.assign({}, subProps, {
            data: {
              ...subProps.data,
              properties:{
                placeholder:obj.subelements['lastname'].placeholder
              }
            },
            type:'name',
            formGroupState:formGroupState.sub['name'],
          });

          let subViewProps = {
            style:i !== (showElements.length - 1) ? styles.bottomSpacing : {}
          };

          return (
            <View key={i}>
              <View {...subViewProps}>
                <TextBlock {...firstNameSubProps} />
              </View>
              <View {...subViewProps}>
                <TextBlock {...lastNameSubProps} />
              </View>
            </View>
          )
        }
      }
    })
  }

  render() {  
    return (
      <View> 
        {this.checkBlockType()}  
      </View>
    );
  }
} 

const styles = StyleSheet.create({
  bottomSpacing: {
    marginBottom:6
  }
})