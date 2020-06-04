import React, { Component } from 'react'
import { View, Animated, StyleSheet, Text, Image, Easing, ActivityIndicator, LayoutAnimation } from 'react-native'
import PropTypes from 'prop-types'
import { Ripple } from './Ripple'
import withTheme from '../core/withTheme'

import FontAwesome, { Icons } from './Icon';

class Button extends Component {

  static defaultProps = {
    onPressIn:() => {},
    onPress:() => {},
    initialBackground:'rgba(0,0,0,.06)',
    initialBackground:'#fff',
    activeBackground:'#03a9f4',
    initialColor:'#212121',
    activeColor:'#fff',
    isToggle:false,
    raised:true,
    buttonType:'toggle',
    status:false,
    border:false,
    formStatus:'none',
    icon:false
  };

  constructor(props) {
    super(props);
    if (this.props.isToggle) {
      this.state = {
        colors:new Animated.Value(0),
        initialBackground:this.props.initialBackground,
        initialColor:this.props.theme.darkTextColor,
        activeColor:this.props.activeColor,
        activeBackground:this.props.theme.selectedControlColor,
        isSubmitting:false,
        doneSubmitting:false,
      };
    } else {
      const isAction = ['next','submit'].indexOf(this.props.buttonType) > -1;
      this.state = {
        initialBackground:isAction  ? this.props.theme.actionButtonBgColor : this.props.theme.previousButtonBgColor,
        initialColor:isAction ? this.props.activeColor : this.props.initialColor,
        colors:new Animated.Value(0)
      };
    }

    this.customLayoutAnimation = {
      duration: 225,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isToggle) {
      this._animateToggle(nextProps.selected);
    }

    if (nextProps.formStatus === 'posting') {
      LayoutAnimation.configureNext(this.customLayoutAnimation);
      this.setState({isSubmitting:true})
    }

    if (nextProps.formStatus === 'done-posting') {
      LayoutAnimation.configureNext(this.customLayoutAnimation);
      this.setState({doneSubmitting:true})     
    }
  }

  _animateFocus() {

  }

  _animateToggle(selected) {
    Animated.timing(this.state.colors, {
      toValue:selected ? 1 : 0,
      duration:225,
      easing:Easing.bezier(0.4, 0.0, 0.2, 1)
    }).start()
  }

  _buttonElement() {
    const { initialBackground, activeBackground, initialColor, activeColor, border, buttonType } = Object.assign({},this.props,this.state);
    
    let backgroundStyle = {
      backgroundColor:this.state.colors.interpolate({
        inputRange: [0, 1],
        outputRange: [initialBackground, activeBackground]
      }),
      overflow:'hidden',
      borderRadius:2
    };

    let borderStyle = {
      borderWidth:1,
      borderColor:'rgba(0,0,0,.12)',
      overflow:'hidden'
    };

    let innerButtonStyle = [
      styles.button,
      backgroundStyle,
      border ? borderStyle : null
    ];

    let innerTextStyle = [
      styles.text,
      {
        color:this.state.colors.interpolate({
          inputRange: [0 ,1],
          outputRange: [initialColor, activeColor]
        })
      }
    ];


    const icon = (pre) => {

      if (this.props.icon) {
        if (React.isValidElement(this.props.icon)) {
          return element;
        } else if (typeof this.props.icon === 'string' && this.props.icon.length > 1) {

          let iconStyle = this.props.iconSize ? {fontSize:this.props.iconSize} : null;

          return (<FontAwesome style={iconStyle}> {Icons[this.props.icon]} </FontAwesome>)
        } else {
          return null
        }
      } else {
        return null
      }
    };

    const statusElement = () => {
       if (this.props.buttonType === 'submit' && this.props.formStatus === 'posting') {
        return (<ActivityIndicator size='small' color='rgba(255,255,255,.75)' />);
       
      } else if (this.props.buttonType === 'submit' && this.props.formStatus === 'done-posting') { 
        return (
          <Animated.Text style={innerTextStyle}>
            <FontAwesome>{Icons.check}</FontAwesome>
          </Animated.Text>
        )
      } else {
        return (
          <Animated.Text style={innerTextStyle}>
            {buttonType === 'toggle' || buttonType === 'prev' ? icon() : null}
            {this.props.text}
            {buttonType !== 'toggle' && buttonType !== 'prev' ? icon() : null}
          </Animated.Text>
        );
       }
    };

   return (
      <Animated.View style={innerButtonStyle}>
        {statusElement()}
      </Animated.View>
    );
  }

  render () {

    const { buttonType, raised } = this.props;

    let buttonStyle = [
      styles.rippleButton,
      buttonType === 'prev' ? {marginTop:6} : null,
      raised ? styles.shadow : null
    ];

    return (
      <Ripple 
        style={buttonStyle}
        onPressIn={() => {
          this._animateFocus(true);
          this.props.onPressIn()
        }}
        onPressOut={() => {
          this._animateFocus(false);
          this.props.onPress();
        }}
      >
        {this._buttonElement()}
      </Ripple>
    )
  }


}

const styles = StyleSheet.create({
  rippleButton: {
    zIndex:10,
  },
  shadow: {
    shadowColor:'#000',
    shadowOpacity:.225,
    shadowRadius:1,
    shadowOffset: {
      width:0,
      height:1
    },
    borderRadius:2
  },
  button: {
    height:36,
    zIndex:-1,
    paddingHorizontal:16,
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
  },
  text: {
    alignSelf:'center',
    textAlign:'center',
    fontSize:13,
    color:'#fff'
  },
});

export default withTheme(Button);