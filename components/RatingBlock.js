import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';

import Rating from './Rating';
import ErrorMessage from './ErrorMessage';

export default class RatingBlock extends React.Component {

  constructor(props) {
    super(props);
  }

  bubbleUpValueChange(value,data) {
    this.props.onFormGroupValueChange(value,data);
  }

  getRating() {
    const { data } = this.props;
    const { properties } = data;

    let scale = data.typeName === 'nps' ? 10
      : properties.type === 'bar' || data.typeName === 'ces' || properties.type === 'emoji'  ? 5
      : properties.scale;

    let zero = properties.type === 'numeric' || properties.type === 'stars' ? properties.includeZero
      : data.typeName === 'nps' ? true
      : false

    let ratingProps = {
      scale: scale,
      data:data,
      includeZero:zero,
      reverseScore: properties.reverseScore ? true : false,
      valueChanged: (value) => {this.bubbleUpValueChange(value,data)},
      isSwiping: (userSwiping) => {this.props.isSwiping(userSwiping)},
    };

    return (<Rating {...ratingProps} />)
  }

  render() {
      const data = this.props.data;

      return (
        <View>
          {this.getRating()}
          <ErrorMessage 
            text={this.props.formGroupState.error}
            show={this.props.formGroupState.showError}
          />
        </View>
      );
  }
} 