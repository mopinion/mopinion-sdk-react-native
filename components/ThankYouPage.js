import React from 'react';
import {StyleSheet, View, Text, Image, Animated, Easing} from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome, { Icons } from './Icon';
import withTheme from '../core/withTheme';

class ThankYouPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      check:new Animated.Value(0),
      text:new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.timing(this.state.check, {
      toValue: 1,
      duration: 425,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1)
    }).start(Animated.timing(this.state.text, {
      toValue: 1,
      duration: 525,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1)
    }).start());
  }

  render() {  

    const { theme } = this.props;
 
    let containerStyle = {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft:10,
      marginRight:10
    };

    let checkStyle = {
      fontSize:96,
      color:theme.darkTextColor,
      marginBottom:36,      
      opacity:this.state.check,
      backgroundColor:'transparent',
      transform:[
        {
          translateY:this.state.check.interpolate({
            inputRange: [0 ,1],
            outputRange: [100, 0]
          })
        },{
          rotateY : this.state.check.interpolate({
            inputRange: [0 ,1],
            outputRange: ['-180deg', '0deg']
          })
        },{
          rotateX : this.state.check.interpolate({
            inputRange: [0 ,1],
            outputRange: ['90deg', '0deg']
          })
        },{
          scale : this.state.check.interpolate({
            inputRange: [0 ,1],
            outputRange: [.5, 1]
          })
        }
      ]
    };

    let textStyle = {
      fontSize:16,
      color:theme.darkTextColor,
      opacity:this.state.text,
      transform:[
        {
          translateY:this.state.text.interpolate({
            inputRange: [0 ,1],
            outputRange: [100, 0]
          })
        }
      ]
    };

    return (
      <View style={containerStyle}>

        <Animated.Text style={checkStyle}>
          <FontAwesome>{Icons.check}</FontAwesome>
        </Animated.Text>

        <Animated.Text style={textStyle}>
          {this.props.text}
        </Animated.Text>

      </View>
    );
  }
}

export default withTheme(ThankYouPage);