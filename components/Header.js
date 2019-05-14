import React from 'react';
import {SafeAreaView,Dimensions, Button, View, Text, StatusBar, StyleSheet, Image, TouchableHighlight, Platform, Keyboard, Animated} from 'react-native';
import PropTypes from 'prop-types';
import withTheme from '../core/withTheme'
import { Ripple } from './Ripple';
import { base64Images } from './Images';

class Header extends React.Component {

  static defaultProps = {
    backArrow:base64Images.icons.ic_arrow_back_white,
    size:20,
    onPressLeft:()=> {}
  };

  constructor(props) {
    super(props);
    this.state = {
      paddingTop:new Animated.Value(30)
    }
  }

  statusBar() {
    const statusBarStyle = {
      backgroundColor:this.props.theme.headerBgColor,
    };
    return (
      <View style={statusBarStyle}>
        <StatusBar translucent backgroundColor={this.props.theme.headerBgColor} />
      </View>
    );
  }

  leftElement() {

    const { size, leftElement, theme, backArrow } = this.props;

    const headerHasWhiteBg = theme.headerBgColor.indexOf('#fff') > -1 || theme.headerBgColor.replace(' ','').indexOf('255,255,255') > -1;
    const left = (el) => {
      if (el && React.isValidElement(el)) {
        return el
      } else { 
        const iconSource = headerHasWhiteBg ? base64Images.icons.ic_arrow_back_black : backArrow;
        return (
          <Image 
            source={{uri:iconSource}} 
            style={{
              width:size,
              height:size,
              alignSelf:'center'
            }}
          />
        );
      }   
    }

    let buttonStyle = {
      alignSelf:'center',
      position:'absolute',
      left:0,
      width:size*2,
      height:size*2,
      borderRadius:size,
      zIndex:20,
      justifyContent:'center',
      overflow:'hidden'
    };

    return (
      <Ripple 
        style={buttonStyle}
        rippleColor={headerHasWhiteBg ? '#000' : '#fff'}
        onPress={() => {this.props.onPressLeft()}}
      >
        <View>{left(leftElement)}</View>
      </Ripple>
    );
  }

  render() {

    const { theme } = this.props;

    let headerBg = theme.headerBgColor ? {backgroundColor:theme.headerBgColor} : {};
    let headerTextColor = theme.headerTextColor ? {color:theme.headerTextColor} : {};

    let containerStyle = [
      styles.container,
      headerBg
    ];

    let innerHeaderStyle = [
      styles.header,
      headerBg
    ];

    let headerTextStyle = [
      styles.text,
      headerTextColor
    ];

    let safeViewStyle = [
      styles.safeView,
      {backgroundColor:this.props.theme.headerBgColor},
      (Platform.OS === 'android' ? {
        paddingTop:StatusBar.currentHeight
      } : {}) 
    ]

    return (
      <SafeAreaView style={safeViewStyle}>
        <Animated.View 
          style={containerStyle}
          onLayout={this.onLayout}
        >
          <View style={innerHeaderStyle}>
            {this.leftElement()}
            {this.props.title ? 
              (<Text style={headerTextStyle}>{this.props.title}</Text>) 
              : null
            }
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignSelf:'stretch',
    flexDirection:'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#03a9f4',
    paddingHorizontal:0,
    zIndex:10,
    position:'relative'
  },  
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row',
    backgroundColor: '#03a9f4',
    height:50,
    flex:1
  },
  safeView: {
    shadowColor:'#000',
    shadowRadius:3,
    shadowOpacity:.3,
    shadowOffset: {
      height:1,
      width:0
    },
    zIndex:11,
    elevation:1
  },
  text: {
    fontSize:16,
    flex:1,
    paddingHorizontal:30,
    textAlign:'center'
  }
});

export default withTheme(Header);