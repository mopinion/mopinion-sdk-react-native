import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';

import Button from './Button';

import ErrorMessage from './ErrorMessage';
import withTheme from '../core/withTheme';
import { getKeys } from '../utils/getKeys';

class ButtonBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    const initValue = [].concat(this.props.formGroupState.value);
    const { properties } = this.props.data;

    getKeys(properties.elements).map((key,i) => {

      const element = properties.elements[key];

      this.state[this.props.data.typeName+'_'+this.props.data.id+'_'+(i+1)] = {
        selected:initValue.indexOf(element.label) > -1,
        value:element.value ? element.value : element.label,
        label:element.label,
        index:i+1
      };
    });
  }


  pressHandler(key,value,data) {

    const updateParentState = () => {
      const values = getKeys(this.state).reduce((selectedValues,key) => {
        let o = this.state[key];
        if (o.selected && data.typeName === 'checkbox') {
          selectedValues.push({
            value:o.value,
            field:key
          });
        } else if (o.selected && data.typeName !== 'checkbox') {
          selectedValues.push(o.value)
        }
        return selectedValues;
      },[]);
      this.props.onFormGroupValueChange(data.typeName !== 'checkbox' ? values.toString() : values, data);
    };

    this.setState((prevState) => {
      return {
        [key]: {
          ...prevState[key],
          selected:!prevState[key].selected
        }
      }
    },() => {
      if (data.typeName !== 'checkbox' && this.state[key].selected) {
        const hasSelected = getKeys(this.state).filter((k) => {          
          return this.state[k].selected && k !== key
        });

        if (hasSelected.length) {
          hasSelected.forEach((k) => {
            let o = this.state[k];
            if (o.selected && k !== key) {
              this.setState((prevState) => {
                return {
                  [k]: {
                    ...prevState[k],
                    selected:false
                  }
                }
              },()=>{updateParentState()})
            }
          });
        } else {
          updateParentState();
        }
      } else {
        updateParentState()
      }
    });
  }

  blocks() {

    const { data } = this.props;

    return getKeys(this.state).map((key, i) => {
      let obj = this.state[key];

      let formattedIcon = '';
      let element = data.properties.elements[obj.index];
      if (element.icon) {
        formattedIcon = element.icon.replace('fa fa-','').replace(/(\-\w)/g, (s) =>{ return s[1].toUpperCase();});
      }

      let buttonProps = {
        text: data.typeName !== 'thumbs' ? obj.label : '',
        raised:false,
        onPress:this.pressHandler.bind(this,key,obj.value,data),
        isToggle:true,
        selected:obj.selected,
        border:true,
        buttonType:'toggle',
      };

      if (formattedIcon) {
        buttonProps.icon = formattedIcon;
      }

      return (
        <View 
          key={i} 
          style={{padding:2}}
        >
          <Button {...buttonProps} />
        </View>
      );
    })    
  }

  render() {
    return (
      <View>
        <View  style={styles.row}>
          {this.blocks()}
        </View>
          <ErrorMessage 
            text={this.props.formGroupState.error}
            show={this.props.formGroupState.showError}
          />
      </View>
    );
  }
} 

const styles = StyleSheet.create({
  row: {
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap'
  }
});

export default withTheme(ButtonBlock);