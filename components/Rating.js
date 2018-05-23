import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions, 
  View,
  StyleSheet,
  Image,
  Text,
  TouchableHighlight,
  PanResponder,
  Animated,
  Easing
} from 'react-native';
import FontAwesome, { Icons } from './Icon';
import withTheme from '../core/withTheme';
import { base64Images } from './Images';


class Rating extends Component {

  static defaultProps = {
    maxStars: 5,
    rating: -1,
    starWidth: 30,
    valueChanged: (index) => {},
    unselectedBackground:'#ffffff',
    selectedBackground:'#2196f3',
    emojis:[
      {label:'Hate', img:base64Images.emojis.angry,imgActive:base64Images.emojis.angryActive},
      {label:'Dislike', img:base64Images.emojis.sad,imgActive:base64Images.emojis.sadActive},
      {label:'Neutral', img:base64Images.emojis.neutral,imgActive:base64Images.emojis.neutralActive},
      {label:'Like', img:base64Images.emojis.like,imgActive:base64Images.emojis.likeActive},
      {label:'Love', img:base64Images.emojis.love,imgActive:base64Images.emojis.loveActive}
    ],
    stars: {
      unselected:base64Images.stars.unselected,
      selected:base64Images.stars.selected
    },
    ces: ['--','-','0','+','++'],
    redToGreen: ['#e51c23','#ff5722','#FFC107','#8bc34a','#259b24'],
    isSwiping:() => {},
    elementProps:{}
  };

  constructor(props) {
    super(props);
    this.state = {
      maxStars: this.props.scale,
      rating: this.props.rating,
      selectedBackground:this.props.theme.selectedControlColor || this.props.selectedBackground,
      unselectedBackground:this.props.unselectedBackground,
      values:this.scoresAsArray(),
      animations:this.scoresAsArray().map((score,i) => { return {value:new Animated.Value(0),labelValue:new Animated.Value(0)}; }),
      labelHeight:[]
    };


    this.state.starSize = (Dimensions.get('window').width - 20 ) / (this.props.includeZero ? this.props.scale + 1 : this.props.scale);

    if (this.state.starSize > 60 && this.props.data.properties.type === 'stars') {
      this.state.starSize = 50;
    }


    if (this.state.starSize > 40 && this.state.starSize < 65) {
      this.state.starHeight = this.state.starSize;
    } else {
      this.state.starHeight = this.props.data.properties.type === 'emoji' ? 55
        : this.props.data.properties.type === 'stars' ? 40
        : 45
    }

   // this.setLabelHeight = this.setLabelHeight.bind(this);

    this.labelRefs = [];
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this._updateChangeValue(evt);
        this.props.isSwiping(true);
      },
      onPanResponderMove: (evt, gestureState) => {
        this._updateChangeValue(evt);
      },
      onPanResponderRelease: (evt, gestureState) => {
        this._updateChangeValue(evt,true);
        this.props.isSwiping(false);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this.props.isSwiping(false);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }

  componentDidMount() {
    setTimeout(() =>  {
      this.labelRefs.forEach( (ref,i) => {
        this.refs[ref]._component.measure((ox, oy, width, height, px, py) => {
          this.setState((prevState) => {
            return {
              labelHeight:Object.assign([...prevState.labelHeight],{[i]:height})
            }
          })
        })
      })
    });
  }

  scoresAsArray() {
    const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);
    const start = this.props.includeZero ? 0 : 1;

    const scores = () => {
      if (this.props.reverseScore) {
        return range(start, this.props.scale+1).reverse();
      } else {
        return range(start, this.props.scale+1)
      }
    };


    return scores();
  }

  _label(labelText,i) {

    const { data } = this.props;

    this.labelRefs.push(`label${i}`);

    let labelContainerStyle = {
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'center',
      position:'absolute',
      overflow:'visible',
      bottom:-this.state.labelHeight[i],
      transform: [
        {
          translateY:this.state.animations[i].labelValue.interpolate({
            inputRange: [0,1],
            outputRange: [0, data.properties.type === 'emoji' ? 10 : 0]
          })
        }
      ]
    };

    let labelTextStyle = [
      {
        fontSize:this.state.animations[i].labelValue.interpolate({
          inputRange: [0,1],
          outputRange: [10,12]
        }),
        color:this.state.animations[i].labelValue.interpolate({
          inputRange: [0,1],
          outputRange: [
            this.props.theme.greyTextColor,
            this.props.data.properties.type !== 'ces' ? this.props.theme.darkTextColor : 
              this.props.reverseScore ? [].concat(this.props.redToGreen).reverse()[i]
              : this.props.redToGreen[i]
          ]
        }),
        textAlign:'center',
        fontWeight:'600',
      },
      data.properties.type !== 'emoji' ?
        {
          transform: [
            {
              translateY:this.state.animations[i].labelValue.interpolate({
                inputRange: [0,1],
                outputRange: [-10,0]
              })
            }
          ],
          opacity:this.state.animations[i].labelValue.interpolate({
            inputRange: [0,1],
            outputRange: [0,1]
          })
        }
        :  null
    ];

    return(
      <Animated.View
        style={labelContainerStyle}
        ref={`label${i}`}
      >
        <Animated.Text 
          style={labelTextStyle}
        >
          {labelText}
        </Animated.Text>
      </Animated.View>
    );
  }

  getScores() {

    const { data, reverseScore, redToGreen } = this.props;

    return this.state.values.map( (score,i) => {

      let baseStyle = {
        transform:[
          {
            scale:this.state.animations[i].value.interpolate({
              inputRange: [0, .5  ,1],
              outputRange: [1, 0.667 ,1]
            })
          }
        ],
        zIndex:this.state.animations[i].value.interpolate({
          inputRange: [0,1],
          outputRange: [1,10]
        }),
        overflow:'visible'        
      };

      let textStyle = [
        styles.text,
        {
          color:this.state.animations[i].value.interpolate({
            inputRange: [0, 1],
            outputRange: [
              'rgba(0,0,0,.54)', 
              data.typeName === 'ces' ?  reverseScore ? [].concat(redToGreen).reverse()[i] : redToGreen[i]
              : '#fff'
            ]
          })
        }
      ];

      if (data.properties.type === 'numeric' || data.typeName === 'nps') {


        let barStyle = {
          width: this.state.starSize, 
          height: this.state.starHeight,
          alignItems:'center',
          justifyContent:'center',
          backgroundColor:this.state.animations[i].value.interpolate({
            inputRange: [0, 1],
            outputRange: [this.state.unselectedBackground, this.state.selectedBackground]
          }),
          borderColor:this.state.animations[i].value.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0,0,0,.12)', this.state.selectedBackground]
          }),
          borderTopWidth:1,
          borderBottomWidth:1,         
          borderLeftWidth:i == 0 ? 1 : 0,
          borderRightWidth:this.state.values.length - 1 === i ? 1 : 0,

          borderTopLeftRadius:i == 0 ? 2 : 0,
          borderBottomLeftRadius:i == 0 ? 2 : 0,

          borderTopRightRadius:this.state.values.length - 1 === i ? 2 : 0,
          borderBottomRightRadius:this.state.values.length - 1 === i ? 2 : 0,
        };

        return (
          <Animated.View 
            key={i}
            style={[baseStyle,barStyle]}
          >
            <Animated.Text style={textStyle}>{score}</Animated.Text>
          </Animated.View>
        );


      } else if (data.properties.type === 'stars') {

        let starStyle = {
          width: this.state.starSize, 
          height: this.state.starHeight,
          alignItems:'center',
          justifyContent:'center',
          zIndex:10
        };

        let starSize = this.state.starSize > this.state.starHeight ? this.state.starHeight : this.state.starSize;

        let inactiveStar = {
          opacity:this.state.animations[i].value.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          }),
          width:starSize, 
          height: starSize,
          transform:[{scale:.9}]
        };

        let activeStar = {
          opacity:this.state.animations[i].value.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
          }),
          zIndex:10,
          width:starSize, 
          height:starSize,
          position:'absolute',
          transform:[{scale:.9}]
        };

        let label = data.properties.showCaptions ? this._label(data.properties.elements[i+1].label,i) : null;

        return (
          <View key={i}>
            <Animated.View style={[baseStyle,starStyle]}>
              <Animated.Image source={{uri:this.props.stars.unselected}} style={[inactiveStar]} />
              <Animated.Image source={{uri:this.props.stars.selected}} style={[activeStar]} />
            </Animated.View>
            {label}
          </View>
        )

        // let starStyle = {
        //   width: this.state.starSize,
        //   height: this.state.starHeight,
        //   fontSize: this.state.starHeight * .9,
        //   alignItems:'center',
        //   justifyContent:'center',
        //   color:this.state.animations[i].value.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: ['#ddd','#fcc83d']
        //   }),
        //   textAlign:'center'
        // };        
        // let label = data.properties.showCaptions ? this._label(data.properties.elements[i+1].label,i) : null;

        // return (
        //   <View key={i}>
        //     <Animated.Text
        //       style={[baseStyle,starStyle]}
        //     >
        //       <FontAwesome>{Icons.star}</FontAwesome>
        //     </Animated.Text>
        //     {label}
        //   </View>
        // );


      } else if (this.props.data.properties.type === 'emoji') {


        let emojiStyle = {
          width: this.state.starSize, 
          height: this.state.starHeight,
          alignItems:'center',
          justifyContent:'center',
          zIndex:10
        };

        let emojiSize = this.state.starSize > this.state.starHeight ? this.state.starHeight : this.state.starSize;

        let inActiveEmoji = {
          opacity:this.state.animations[i].value.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
          }),
          width:emojiSize, 
          height: emojiSize,
          transform:[{scale:.8}]
        };

        let activeEmoji = {
          opacity:this.state.animations[i].value.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
          }),
          zIndex:10,
          width:emojiSize, 
          height:emojiSize,
          position:'absolute'
        };

        let emoji = this.props.emojis[i];
        let label = data.properties.showCaptions ? this._label(data.properties.emoji[i+1].label,i) : null;

        return (
          <View key={i}>
            <Animated.View style={[baseStyle,emojiStyle]}>
              <Animated.Image source={{uri:emoji.img}} style={[inActiveEmoji]} />
              <Animated.Image source={{uri:emoji.imgActive}} style={[activeEmoji]} />
            </Animated.View>
            {label}
          </View>
        )


      } else if (data.properties.type == 'bar') { 


        let barStyle = {
          width: this.state.starSize, 
          height: this.state.starHeight,
          alignItems:'center',
          justifyContent:'center',
          backgroundColor:this.props.redToGreen[i],
          opacity:this.state.animations[i].value.interpolate({
            inputRange: [0, 1],
            outputRange: [.15, 1]
          }),
          borderTopLeftRadius:i == 0 ? 2 : 0,
          borderBottomLeftRadius:i == 0 ? 2 : 0,
          borderTopRightRadius:this.state.values.length - 1 === i ? 2 : 0,
          borderBottomRightRadius:this.state.values.length - 1 === i ? 2 : 0,
        };

        return (
          <Animated.View
            key={i}
            style={[baseStyle,barStyle]}
          ></Animated.View>
        );


      } else if (data.typeName === 'ces') {

        let rtgColor = reverseScore ? [].concat(redToGreen).reverse()[i] : redToGreen[i];
        let cesStyle = {
          width: this.state.starSize, 
          height: this.state.starHeight,
          alignItems:'center',
          justifyContent:'center',
          borderBottomColor:this.state.animations[i].value.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0,0,0,.54)', rtgColor]
          }),
          borderBottomWidth:3,
        };

        let label = data.properties.showCaptions ? this._label(reverseScore ? data.properties.elements[score].label : data.properties.elements[i+1].label, i) : null;

        return (
          <View key={i}>
            <Animated.View style={[baseStyle,cesStyle]}>
              <Animated.Text style={textStyle}>
                {reverseScore ? [].concat(this.props.ces).reverse()[i] : this.props.ces[i]}
              </Animated.Text>
            </Animated.View>
            {label}
          </View>
        );
      }

  
    });
  }

  render() {

    const { data } = this.props;

    let wrapperStyle = [
      styles.wrapper,
      data.properties.type === 'numeric' || data.typeName === 'nps' ? styles.radius : {}
    ];

    let containerStyle = [
      styles.container,
      data.properties.showCaptions ? styles.labelPadding : {}
    ];

    return (
      <View style={wrapperStyle}>
        <View
          style={containerStyle}
          {...this._panResponder.panHandlers}
        >
          {this.getScores()}
        </View>
      </View>
    )
  }

  _updateChangeValue(evt,shouldUpdateState) {

    const starWidth = this.state.starSize;
    const elementPosition = Math.ceil((evt.nativeEvent.pageX)/starWidth) - 1;
    const fitPosition = elementPosition < 0 ? 0 : elementPosition > this.state.maxStars ? this.state.maxStars : elementPosition;
    const ratingValue = this.state.values[fitPosition];
    const cb = () => {
      if (shouldUpdateState) {
        this.setState({
          rating: ratingValue,
        });
        this.props.valueChanged(ratingValue);
      }
    };
    this._animate(elementPosition,cb);
  }

  _animate(elementPosition,callback) {
    let isEmoji = this.props.data.properties.type === 'emoji';
    this.state.animations.forEach((o,i) => {

      let to = i <= elementPosition && !isEmoji ? true : i == elementPosition;
      let toLabel = i == elementPosition;

      Animated.spring(o.value, {
        toValue:to ? 1 : 0,
        duration:225
      }).start(callback);

      Animated.spring(o.labelValue, {
        toValue:toLabel ? 1 : 0,
        duration:225
      }).start();
    });
  }
};

const styles = StyleSheet.create({
  wrapper: {
    overflow:'visible'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex:10,
  },
  border: {
    borderRadius:2,
    borderColor:'rgba(0,0,0,.12)',
    borderWidth:1,
    borderRadius:3,
    overflow:'hidden'
  },
  radius: {
    borderRadius:2
  },
  text: {
    fontSize:14,
    fontWeight:'600'
  },
  labelPadding: {
    paddingBottom:15
  }
});

export default withTheme(Rating);