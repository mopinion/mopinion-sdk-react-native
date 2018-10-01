import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import ErrorMessage from './ErrorMessage';
import withTheme from '../core/withTheme';
import { getKeys } from '../utils/getKeys';

class SelectBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected1: this.props.formGroupState.value
    };
  }

  onValueChange(value) {
    this.setState({
      selected1: value
    });
    this.props.onFormGroupValueChange(value,this.props.data);
  }

  data() {
    const { elements } = this.props.data.properties;
    return getKeys(elements).map((key, i) => {
      let obj = elements[key];
      return {value:obj.label || obj}
    }); 
  }

  render() {
    let { placeholder } = this.props.data.properties;
    let selectProps = {
      label:placeholder || '',
      data:this.data(),
      value:this.state.selected1,
      onChangeText:this.onValueChange.bind(this),
      labelHeight:placeholder ? 12 : 0,
      rippleInsets: {top:placeholder ? -4 : -16}
    };
    return (
      <View>  
        <Dropdown 
          {...selectProps}
        />        
        <ErrorMessage 
          text={this.props.formGroupState.error}
          show={this.props.formGroupState.showError}
        />
      </View>
    );
  }
} 

export default withTheme(SelectBlock);