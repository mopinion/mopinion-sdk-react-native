import React from 'react';
import { Alert, Dimensions, Modal, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Control from './Control';
import ErrorMessage from './ErrorMessage';
import Button from './Button';

import * as ImagePicker from 'react-native-image-picker';
class ImagePickerControl extends React.Component {
      
  static defaultProps = {
    pickLabel:'Pick',
    undoLabel:'Undo',
    maxImageWidth:320,
    maxImageHeight:480,
    visible:false
  };

  constructor(props) {
	super(props);
	
	this.state = {
		enableUndo:false,
		imagePickerResponse:null
	};

  }

	updateParentState() {
		// callback to pass the selected image type and uri 
		if (typeof this.props.onImagePicked === 'function') {
			if(this.state.imagePickerResponse != null) {
				this.props.onImagePicked(this.state.imagePickerResponse.type, 
										this.state.imagePickerResponse.uri, 
										this.state.imagePickerResponse.base64);
			} else {
				this.props.onImagePicked(null, null, null);
			}
		}
	}
	
	setImagePickerResponse(response) {
	    this.setState((prevState) => {
      return {
          ...prevState,
          imagePickerResponse:response
      }
    },() => {
      this.updateParentState();
    });
	}

	// update the button state after the user picked an image or did undo
	toggleButtonFace() {
	    this.setState((prevState) => {
		  return {
			  ...prevState,
			  enableUndo:!prevState.enableUndo
		  }
		});
	}
	
	validatePickedImage(response) {
		if(response && response.uri !== "" ) {
			switch(response.type) {
				case 'image/jpg':
					response.type = 'image/jpeg';	// convert to MIME standard
					break;
				case 'image/jpeg':
				case 'image/png':
					break;
				default:
					Alert.alert('Unsupported Image', `Format '${response.type}' is not supported. Please select a JPG or PNG image.`);
					return false;
			}
		}
		return true;
	}
	
  // handle the pick/undo button
  pressHandler(key,value,data) {
	// the button is either in undo or imagepicker mode
    if(this.state.enableUndo) {
      // Undo, revert to the default screenshot and toggle button face
      this.toggleButtonFace();
      this.setImagePickerResponse(null);
    } else {

      ImagePicker.launchImageLibrary(
        {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: this.props.maxImageHeight,
        maxWidth: this.props.maxImageWidth,
        },
        (response) => {
          // process the response for the right type
          if(response && response.uri !== ""  && response.didCancel !== true && this.validatePickedImage(response) ) {
          this.toggleButtonFace();

          this.setImagePickerResponse(response);
          }
        },
      );

    }
  }
  
  render() {
	const { data } = this.props;
	const styles = StyleSheet.create({
	  button: {
		height:36,
		paddingHorizontal:3,
		alignItems:'center',
		justifyContent:'center',
		flexDirection:'row',
		marginTop:10
	  },
	});

      let obj = this.state;
	  let buttonProps = {
		text: obj.enableUndo ? this.props.undoLabel : this.props.pickLabel,
		raised:false,
	    onPress:this.pressHandler.bind(this, 'picked_image', obj.enableUndo,data),
		border:true,
		buttonType:'toggle',
		icon: obj.enableUndo ? 'undo' : 'pictureO'
	  };

	return (
	  this.props.visible ?
	  (
		<View style={styles.button}>
			<Button {...buttonProps} />
		</View>
	  )
	  : null
	);
  }
}

export default class ScreenshotBlock extends React.Component {

  static defaultProps = {
    screenshotCheckboxLabel:'Send screenshot with feedback?',
    screenshotImageType:'image/png'
  };

  constructor(props) {
    super(props);
    this.thumbnailRatio = 0.25; // in relation to the height of the display
    this.overlayImageRatio = 0.9;  // in relation to display width or height

    let maxWidth = Dimensions.get('window').width * this.thumbnailRatio;
    let maxHeight = Dimensions.get('window').height * this.thumbnailRatio;

    this.state = {
      imageWidth:0,
      imageHeight:0,
      thumbnailWidth:maxWidth,
      thumbnailHeight:maxHeight,
      sizeSet:false,
      overlayVisible:false,
		defaultScreenshotImageType: this.props.screenshotImageType,
		defaultScreenshotData: this.props.formGroupState.screenshot,
		defaultThumbnailWidth:maxWidth
    };

    this.state[this.props.data.typeName] = {
      selected:this.props.formGroupState.value == 'send_screenshot',
      value:'send_screenshot'
    };
  }

  componentDidMount() {
    const { formGroupState } = this.props;

    if (formGroupState.screenshot && !this.state.sizeSet) {
	  const imageType = formGroupState.screenshotImageType ? formGroupState.screenshotImageType : this.state.defaultScreenshotImageType;

      this.initImageSizes(`data:${imageType};base64,${formGroupState.screenshot}`);
    }
  }

  initImageSizes(imageURI) {

    if (typeof imageURI === 'string' && imageURI !== '') {

      Image.getSize(imageURI, (width,height) => {
        let maxWidth = Dimensions.get('window').width * this.overlayImageRatio;
        let maxHeight = Dimensions.get('window').height * this.overlayImageRatio;

        let imageSize = {};
        let thumbNailSize = {};

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

        // determine the scale of the thumbnail in relation the image
        thumbNailSize.width =  imageSize.width * this.thumbnailRatio / this.overlayImageRatio;
        thumbNailSize.height =  imageSize.height * this.thumbnailRatio / this.overlayImageRatio;
        // keep the height of the thumbnail constant, so adjust the width only by the new height
        if(this.state.thumbnailWidth>0 && thumbNailSize.height>0) {
          thumbNailSize.width = thumbNailSize.width * this.state.thumbnailHeight / thumbNailSize.height;
        }

        this.setState({
          imageWidth:imageSize.width,
          imageHeight:imageSize.height,
          thumbnailWidth:thumbNailSize.width,
          // thumbnailHeight:thumbNailSize.height,
          sizeSet:true
        })
      });
    }
  }

  setOverlayVisible = (visible) => {
    this.setState({ overlayVisible: visible });
  }

  renderOverlay = () => {
    const { data, formGroupState } = this.props;
    const { overlayVisible } = this.state;
    const scaleAsPercentage=100*this.overlayImageRatio;

	const styles = StyleSheet.create({          
	  overlayImage: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		width: `${scaleAsPercentage.toFixed(0)}%`,
		height: `${scaleAsPercentage.toFixed(0)}%`,
		resizeMode: 'contain'
	  }, 
	  modalBackgroundView: {
		 margin: 20, 
		 flex: 1, width: '100%', height: '100%', alignItems: "center", justifyContent:"center",
		 backgroundColor: "#40404080"
	  },
	  centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 30
	  }
	});

	const imageType = formGroupState.screenshotImageType ? formGroupState.screenshotImageType : this.state.defaultScreenshotImageType;

	return (
	  this.state.sizeSet ?
	  (
	  <Modal transparent={true} supportedOrientations={['landscape', 'portrait']}
			  visible={overlayVisible} animationType='fade'
			  onRequestClose={() => {
				this.setOverlayVisible(false);
			  }}
	  >
		<View style={styles.centeredView}>
		  <View style={styles.modalBackgroundView}>
			<Image
			  source={{uri:`data:${imageType};base64,${formGroupState.screenshot}`}}
			  style={styles.overlayImage}
			/>
		  </View>
		</View>
	  </Modal>
	  )
	  : null
	);
    
  };

  renderThumbnail() {
    const { data, formGroupState } = this.props;

	const imageType = formGroupState.screenshotImageType ? formGroupState.screenshotImageType : this.state.defaultScreenshotImageType;
	
    let thumbnailStyle = {
      flex: 1
    };

    return(
      this.state && this.state.sizeSet ?
      (
        <TouchableOpacity style={thumbnailStyle} 
        onPressIn={() => {
          this.setOverlayVisible(true);
        }}
        onPressOut={() => {
          this.setOverlayVisible(false);
        }}
        >
      <Image
        source={{uri:`data:${imageType};base64,${formGroupState.screenshot}`}}
        style={thumbnailStyle}
        resizeMode={'contain'}
      />
      </TouchableOpacity>
      )
      : null
    );
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

	// when an image has been picked or reset to default screenshot
	onImagePicked(imageType, imageURI, imageDataBase64){
		const updateParentState = () => {
		  const value = imageDataBase64 ? imageDataBase64 : this.state.defaultScreenshotData;
		  const newImageType = imageType ? imageType : this.state.defaultScreenshotImageType;
		  this.props.onFormGroupValueChange({screenshot:value, screenshotImageType:newImageType}, this.props.data);
		};

		if(imageURI) {
	      this.initImageSizes(imageURI);
		} else {
		  this.setState({ thumbnailWidth:this.state.defaultThumbnailWidth });
		}	

		this.setState((prevState) => {
		  return {
			  ...prevState,
			  userPickedImageType:imageType,
			  userPickedImageURI:imageURI
		  }
		},() => {
		  updateParentState();
		});
	}

  screenshotContainer() {
    let screenshotContainerStyle = {
      ...Platform.select({
        ios: {
          shadowColor:'#000',
          shadowOffset:{width:0,height:2},
          shadowOpacity:0.3,
          shadowRadius:5,    
        },
        android: {
          elevation: 3,
          backgroundColor: 'white'
        },
      }),
      height:this.state.thumbnailHeight,
      width:this.state.thumbnailWidth
    };

    let buttonContainerStyle = {
      flexDirection: 'column',
      alignSelf: 'flex-start',
    };

	const { data, formGroupState } = this.props;

    let controlProps = {
		data: this.props.data,
		formGroupState: this.props.formGroupState,
		onImagePicked: this.onImagePicked.bind(this),
		maxImageWidth: Dimensions.get('screen').width,
		maxImageHeight: Dimensions.get('screen').height,
		visible: data.properties.allow_upload !== 'undefined' ? data.properties.allow_upload : false
    };
	
	// only add these imagepickerlabel props if they exist
    if (data.properties.pickLabel !== 'undefined') {
      Object.assign(controlProps, {pickLabel:data.properties.pickLabel})
    }
    if (data.properties.undoLabel !== 'undefined') {
      Object.assign(controlProps, {undoLabel:data.properties.undoLabel})
    }

  return(
  	<View>
      <View style={screenshotContainerStyle}>
        { this.renderThumbnail() }
        { this.renderOverlay() }
      </View>
      <View style={buttonContainerStyle}>
        <ImagePickerControl {...controlProps}></ImagePickerControl>
      </View>
    </View>
    );
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

    return (
      <View>
        { this.screenshotContainer() }
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