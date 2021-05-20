import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import { TextField } from 'rn-material-ui-textfield';
import ErrorMessage from './ErrorMessage';
import withTheme from '../core/withTheme'

class TextBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value:this.props.formGroupState.value
    };
    this.bubbleUpValueChange = this.bubbleUpValueChange.bind(this);
  }


  bubbleUpValueChange(value,data) {
    this.setState({value:value}, () => {
        this.props.onFormGroupValueChange(value,data);      
    })
  }

  render() {  

    const { data, theme } = this.props;

    let placeholder = data.properties.placeholder ? data.properties.placeholder : '';
    let textProps = {
      value:this.state.value,
      onChangeText:(value) => {this.bubbleUpValueChange(value,data)},
      label:placeholder,
      labelHeight:placeholder ? 12 : 0,
      labelPadding:0,
      textColor:theme.darkTextColor || null,
      tintColor:theme.selectedControlColor,
    };

    // if (this.props.formGroupState.showError) {
    //   properties.error = ' ';
    // } 

    if (data.typeName === 'textarea') {
      textProps.multiline = true;
      textProps.height = 55;
    }

    return (
      <View>
        <TextField 
          {...textProps}
        />            
        <ErrorMessage 
          text={this.props.formGroupState.error}
          show={this.props.formGroupState.showError}
        />
        </View>
    );
  }
}

export default withTheme(TextBlock);