import React, { Component } from 'react'
import { View, Animated, StyleSheet, Text, Image } from 'react-native'
import PropTypes from 'prop-types'
import { Ripple } from './Ripple'
import withTheme from '../core/withTheme'
import { base64Images } from './Images';

class Control extends Component {

  static defaultProps = {
    size: 18,
    innerColor: '#03a9f4',
    outerColor: '#03a9f4',
    labelColor: '#212121',
    isSelected: false,
    onPress: () => null,
    borderWidth:2
  };
  
  constructor(props) {
    super(props);
    this.state = {
      focus:false,
      circle:new Animated.Value(0),
      inside:new Animated.Value(0)
    };
  }

  componentWillReceiveProps(nextProps) {
    Animated.timing(this.state.inside, {
      toValue:nextProps.checked ? 1 : 0,
      duration:125
    }).start() 
  }

  _focus(press) {
  //  this.setState({focus:press}, () => {
      Animated.timing(this.state.circle, {
        toValue:press ? 1 : 0,
        duration:175
      }).start()
  //  });
  }

  _centerElement() {

    const { checked, size, type, borderWidth, theme } = this.props;

    let innerColor = theme.selectedControlColor;

    let animatedStyle = {
      position:'absolute',
      left:-borderWidth ,
      top:-borderWidth ,
      borderRadius:size/2,
      width:size,
      height:size,
      opacity:this.state.circle.interpolate({
        inputRange: [0 ,1],
        outputRange: [0, .2]
      }),
      backgroundColor:innerColor,
      transform:[
        {scale:this.state.circle.interpolate({
          inputRange: [0 ,1],
          outputRange: [0, 2.25]
        })}
      ],
      zIndex:10
    };

    if (type === 'radio') {

      let innerStyle = {
        width: size / 2,
        height: size / 2,
        borderRadius: (size/2) / 2,
        backgroundColor: this.state.inside.interpolate({
          inputRange: [0 ,1],
          outputRange: ['transparent', innerColor]
        }),
        transform:[{scale:this.state.inside.interpolate({
          inputRange: [0 ,1],
          outputRange: [0, 1]
        })}],
        position:'absolute',
        top: (size/4) - borderWidth,
        left: (size/4) - borderWidth,
      };

       return (
          <View>
            <Animated.View
              style={animatedStyle}
            />
            <Animated.View style={innerStyle} />
          </View>
        );

    } else if (type === 'checkbox') {
      
      let innerStyle = {
        width: size,
        height: size,
        position:'absolute',
        top:-borderWidth,
        left:-borderWidth,
        opacity:this.state.inside.interpolate({
          inputRange: [0 ,1],
          outputRange: [0, 1]
        }),
        transform:[{scale:this.state.inside.interpolate({
          inputRange: [0 ,1],
          outputRange: [0, 1]
        })}],
      };

      return ( 
        <View style={{position:'relative'}}>
          <Animated.View
            style={animatedStyle}
          />
          <Animated.Image style={innerStyle} source={{uri:base64Images.icons.ic_check_white}} />
        </View>
       );
    }
  }

  render () {
    const { type, size, checked, onPress, borderWidth, theme } = this.props;
    const outerColor = theme.selectedControlColor;

    let outerStyle = {
      borderColor: checked ? outerColor : 'rgba(0,0,0,.54)',
      width: size,
      height: size,
      borderRadius: type === 'radio' ? (size) / 2 : 3,
      borderWidth: borderWidth
    };

    if (type == 'checkbox' && checked) {
      outerStyle.backgroundColor = outerColor;
    } 

    let labelStyle = {color:theme.textColorDark};
    return (
      <Ripple 
        style={styles.ripple} 
        onPressIn={() => {
          this._focus(true)
        }} 
        onPressOut={() => {
          this._focus(false);
          onPress();
        }}
      >
        <View style={[outerStyle,styles.selectable]}>
          {this._centerElement()}
        </View>
        <Text style={[styles.label,labelStyle]}>
          {this.props.label}
        </Text>
      </Ripple>
    )
  }
}

const styles = StyleSheet.create({
  ripple: {
    justifyContent:'flex-start',
    flex:1,
    flexDirection:'row',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:5,
    borderRadius:2,
    alignItems:'center'
  },
  label: {
    alignSelf:'center',
    textAlign:'left',
    marginLeft:10,
    fontSize:13
  },
  selectable: {
    alignSelf: 'flex-start',
    zIndex:10
  }
});

export default withTheme(Control);