import React from 'react';
import propTypes from 'prop-types';

import Theme from './Theme';

const defaultProps = {
    theme: {},
    custom: {}
};

export const themeContextTypes = {
  theme: propTypes.object
};

export class ThemeProvider extends React.Component {

  static childContextTypes = themeContextTypes;

  getChildContext() {
    return {
      theme: Theme(this.props.theme,this.props.custom),
    };
  }

  render() {
    return this.props.children;
  }  
};
