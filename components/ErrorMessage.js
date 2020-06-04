import React from 'react';
import {View, Text, Animated} from 'react-native';
import PropTypes from 'prop-types';
import withTheme from '../core/withTheme';

class ErrorMessage extends React.Component {

  static defaultProps = {
    show:false
  };

  constructor(props) {
    super(props);
    this.state = {
      animation:new Animated.Value(0)
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this._animate(nextProps.show);
  }

  render() {  

    const { theme } = this.props;

    let errorStyle = {
      position:'absolute',
      bottom:0,
      opacity:this.state.animation,
      transform:[{translateX:this.state.animation.interpolate({
        inputRange: [0 ,1],
        outputRange: [-100, 0]
      })},{translateY:12}],
      backgroundColor:'transparent'
    };

    let errorTextstyle = {
      color:theme.errorColor,
      fontSize:12
    };

    return (
      <Animated.View style={errorStyle}>
        <Text style={errorTextstyle}>
          {this.props.text}
        </Text>
      </Animated.View>
    );
  }

  _animate(show) {
    Animated.spring(this.state.animation,{
      toValue: show ? 1 : 0,                   
      duration: 225,              
    }).start();
  }

}

export default withTheme(ErrorMessage); 