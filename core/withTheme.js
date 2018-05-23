import React from 'react';
import { themeContextTypes } from './ThemeProvider';

export default function withTheme(WrappedComponent) {
  const Wrapper = (props, { theme }) => (
    <WrappedComponent
      theme={ theme }
      { ...props }
    />
  );

  Wrapper.contextTypes = themeContextTypes;

  return Wrapper;
}
