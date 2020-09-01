import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Text, View, StyleSheet, Image, LayoutAnimation } from 'react-native';
import Control from './Control';
import ErrorMessage from './ErrorMessage';

export default class ScreenshotBlock extends React.Component {

  static defaultProps = {
    screenshotCheckboxLabel:'Send screenshot with feedback?'
  };

  constructor(props) {
    super(props);
    this.state = {
      imageWidth:0,
      imageHeight:0,
      sizeSet:false
    };

    this.state[this.props.data.typeName] = {
      selected:this.props.formGroupState.value == 'send_screenshot',
      value:'send_screenshot'
    };
  }

  async UNSAFE_componentWillMount() {
    this.getSetImageSize()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.formGroupState.screenshot && !this.state.sizeSet) {
      this.getSetImageSize();
    }
  }

  getSetImageSize() {

    const { formGroupState } = this.props;

    if (!this.state.sizeSet && typeof formGroupState.screenshot === 'string' && formGroupState.screenshot.length) {
      Image.getSize(`data:image/png;base64,${formGroupState.screenshot}`, (width,height) => {

        let maxWidth = Dimensions.get('window').width * .8;
        let maxHeight = Dimensions.get('window').height * .6;

        let imageSize = {};

        if (height > maxHeight) {
          imageSize.width = width * (maxHeight / height);
          imageSize.height = maxHeight;
        } else if(width > maxWidth) {
          imageSize.width = maxWidth;
          imageSize.height = height * (maxWidth / width);
        } else {
          imageSize.width = width;
          imageSize.height = height;     
        }

        // LayoutAnimation.configureNext({
        //   duration: 425,
        //   create: {
        //     type: LayoutAnimation.Types.spring,
        //     property: LayoutAnimation.Properties.opacity,
        //     springDamping: 0.7,
        //   },
        //   update: {
        //     type: LayoutAnimation.Types.spring,
        //     springDamping: 0.7,
        //   }
        // });

        this.setState({
          imageWidth:imageSize.width,
          imageHeight:imageSize.height,
          sizeSet:true
        })
      });
    }
  }

  pressHandler(key,value,data) {
    const updateParentState = () => {
      const value = this.state[this.props.data.typeName].selected ? this.state[this.props.data.typeName].value : '';
      this.props.onFormGroupValueChange(value, data);
    };

    this.setState((prevState) => {
      return {
        [key]: {
          ...prevState[key],
          selected:!prevState[key].selected
        }
      }
    },() => {
      updateParentState();
    });
  }

  blocks() {

    const { data, formGroupState } = this.props;

    let controlProps = {
      checked:this.state[data.typeName].selected,
      label:this.props.screenshotCheckboxLabel,
      value:'send_screenshot',
      onPress:this.pressHandler.bind(this,data.typeName,'send_screenshot',data),
      type:'checkbox'
    };

    let screenshotContainerStyle = {
      ...Platform.select({
        ios: {
          shadowColor:'#000',
          shadowOffset:{width:0,height:2},
          shadowOpacity:0.3,
          shadowRadius:5,    
        },
        android: {
          elevation: 4,
          backgroundColor: 'white'
        },
      }),
      height:this.state.imageHeight,
      width:this.state.imageWidth
    };

    let imageStyle = {
      flex: 1,
      height:this.state.imageHeight,
      width:this.state.imageWidth
    };

    return (
      <View 
      >
        <View style={screenshotContainerStyle}>
          {
            this.state.sizeSet ?
            (<Image
              source={{uri:`data:image/png;base64,${formGroupState.screenshot}`}}
              style={imageStyle}
              resizeMode={'contain'}
            />)
            : null
          }
        </View>
        <Control {...controlProps} />
      </View>
    );    
  }

  render() {
    const { formGroupState } = this.props;
    return (
      <View>
        {this.blocks()}
        <ErrorMessage 
          text={formGroupState.error}
          show={formGroupState.showError}
        />
      </View>
    );
  }
} 