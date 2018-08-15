import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import Control from './Control';
import ErrorMessage from './ErrorMessage';

export default class RadioCheckBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    const initValue = [].concat(this.props.formGroupState.value);
    const properties = this.props.data.properties;

    Object.keys(properties.elements).map((key,i) => {

      const element = properties.elements[key];

      this.state[this.props.data.typeName+'_'+this.props.data.id+'_'+(i+1)] = {
        selected:initValue.indexOf(element.label) > -1,
        value:element.label
      };
    });
  }


  pressHandler(key,value,data) {

    const updateParentState = () => {
      const values = Object.keys(this.state).reduce((selectedValues,key) => {
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

      this.props.onFormGroupValueChange(data.typeName === 'radio' ? values.toString() : values, data);
    };

    this.setState((prevState) => {
      return {
        [key]: {
          ...prevState[key],
          selected:!prevState[key].selected
        }
      }
    },() => {
      if (data.typeName === 'radio' && this.state[key].selected) {
        const hasSelected = Object.keys(this.state).filter((k) => {          
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
    return Object.keys(this.state).map((key, i) => {
      let obj = this.state[key];
      let controlProps = {
        checked:obj.selected,
        label:obj.value,
        value:obj.label,
        onPress:this.pressHandler.bind(this,key,obj.label,Object.assign({},this.props.data, {key:key}) )
      };
      return (
        <View 
          key={i} 
        >
          <Control
            {...controlProps}
            type={this.props.data.typeName}
          />
        </View>
      );
    })    
  }

  render() {
    return (
      <View>
        {this.blocks()}
        <ErrorMessage 
          text={this.props.formGroupState.error}
          show={this.props.formGroupState.showError}
        />
      </View>
    );
  }
} 