import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import withTheme from '../core/withTheme';

class SectionBlock extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
      const { theme, data } = this.props;
      return (
        <View>
          <Text style={{color:theme.greyTextColor}}>{data.properties.description}</Text>
        </View>
      );
  }
}

export default withTheme(SectionBlock);