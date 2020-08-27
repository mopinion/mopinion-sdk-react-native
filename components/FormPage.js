import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, Text, StyleSheet, Animated, Easing,LayoutAnimation } from 'react-native';

import FormGroup from './FormGroup';
import ButtonGroup from './ButtonGroup';
import Branding from './Branding';
import ThankYouPage from './ThankYouPage';

import withTheme from '../core/withTheme';
import { getKeys } from '../utils/getKeys';

class FormPage extends React.Component {

  static defaultProps = {
    pageElements:{},
    currentPage:1,
    config:{pageMap:{}},
    blocks:{},
    formIsFullySubmmitted:false,
    breakBlocks:{},
    scrollPage:() => {},
    isSwiping:() => {},
    formStatus:''
  };

  constructor(props) {
    super(props);
    this.state = {};

    this.props.config.pageMap && getKeys(this.props.config.pageMap).forEach((k,i) => {
      const animValue = Number(k) == this.props.currentPage ? 1
        : Number(k) > this.props.currentPage ? 0
        : 2;
      this.state[k] = new Animated.Value(animValue);
    });

    this.customLayoutAnimation = {
      duration: 425,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,
        springDamping: 0.7,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
    }
  }

  updateFormState(value,data,index) {
    this.props.updateFormState(value,data,index);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.formIsFullySubmmitted){
      this.forceUpdate();
    } else {

      const isNext = this.props.currentPage < nextProps.currentPage;
      Animated.timing(this.state[this.props.currentPage], {
        toValue:isNext ? 2 : 0,
        duration:375,
        easing:Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false
      }).start();

      Animated.timing(this.state[nextProps.currentPage], {
        toValue:1,
        duration:425,
        easing:Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false
      }).start();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentPage !== this.props.currentPage) {
        setTimeout( ()=>{this.props.scrollPage()}, 300 ) 
    }
  }

  getPages() {

    const last = getKeys(this.props.config.pageMap).slice(-1).pop();

    return getKeys(this.props.config.pageMap).map((pageNum,i) => {

      const comparePage = Number(pageNum);
      const { currentPage } = this.props;
      const offset = Dimensions.get('window').width;

      let pageStyle = [
        {
          opacity:this.state[comparePage].interpolate({
            inputRange:[0,1,2],
            outputRange:[0,1,0]
          }),
          transform:[{translateX:this.state[comparePage].interpolate({
            inputRange:[0,1,2],
            outputRange:[offset,0,-offset]
          })}],
          position:'relative',
        },
        comparePage !== currentPage ? {position:'absolute'} : null
      ];

      return (
        <Animated.View key={i} style={pageStyle}>
          {this.getBlocks(pageNum)}
          {this.getButtons(pageNum)}
          <Branding/>
        </Animated.View>
      );
    })
  }

  getBlocks(fromPage) { 

    return this.props.elements.map((o,i) => {
      let block = this.props.blocks[o.label];

      let groupProps = {
        data:block,
        key:i,
        elementIndex:i,
        formGroupState:this.props.elements[i],
        currentPage:this.props.currentPage,
        updateFormState:(value,data,index) => {this.updateFormState(value,data,index)},
        isSwiping:(userSwiping) => {this.props.isSwiping(userSwiping)},
        setElementProps:(o,i) => {this.props.setElementProps(o,i)}
      };

      if (block.typeName === 'screenshot') {
        groupProps.screenshotCheckboxLabel = this.props.config.text.screenshotCheckboxLabel;
      }

      if (Number(o.page) === Number(fromPage)) {
        return (
          <FormGroup {...groupProps} />
        )
      } else {
        return null;
      }
    })
  }

  getButtons(fromPage) {

    const { breakBlocks } = this.props;

    const isFirst = Number(fromPage) === 1;
    const isLast = Number(getKeys(this.props.config.pageMap).slice(-1).pop()) === Number(fromPage);

    let nextLabel = breakBlocks.hasOwnProperty(fromPage) ? breakBlocks[fromPage].nextLabel : 'Next';
    let prevLabel = breakBlocks.hasOwnProperty(fromPage) ? breakBlocks[fromPage].prevLabel : 'Previous';

    const { setPage, config } = this.props;
    const buttons = 
      isFirst && isLast ? (
        <ButtonGroup
          text={{
            submit:config.text.btnSubmitText,
          }}
          buttons={['submit']}
          onSubmitPress={() => { 
           this.props.validateAndPost()
          }}
          formStatus={this.props.formStatus}
        />
      ) 
      : isFirst ? (
        <ButtonGroup
          text={{
            next:nextLabel
          }}
          buttons={['next']}
          onNextPress={() => { setPage() }}
        />
      )
      : isLast ? (
        <ButtonGroup
          text={{
            submit:config.text.btnSubmitText,
            prev:config.text.btnLastBackText
          }}
          buttons={['submit','prev']}
          onSubmitPress={() => { 
           this.props.validateAndPost()
          }}
          onPrevPress={() => { setPage(false) }}
          formStatus={this.props.formStatus}
        />
      ) : (
        <ButtonGroup
          text={{
            prev:prevLabel,
            next:nextLabel
          }}
          buttons={['next','prev']}
          onNextPress={() => { setPage() }}
          onPrevPress={() => { setPage(false) }}
        />
      )

    return ( <View style={{justifyContent:'flex-end'}}>{buttons}</View> );
  }

  render() {
    const { formIsFullySubmmitted, config, theme} = this.props;

    formIsFullySubmmitted && LayoutAnimation.configureNext(this.customLayoutAnimation);
    return (
      <View style={[
        styles.fill,
        theme.groupsAsCards ? {backgroundColor:theme.groupsAsCardsBgColor} : null
      ]}>
        {
          formIsFullySubmmitted ? 

          (<View style={{flex:1}}>
            <ThankYouPage text={config.properties.exit_content} />
            <Branding/>
          </View>) 
          : 
          this.getPages()
        }     
      </View>
    );
  }
} 

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    flexGrow:1,
    justifyContent:'space-between'
  },
  background: {
    backgroundColor:'#eee'
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
  }
});


export default withTheme(FormPage);