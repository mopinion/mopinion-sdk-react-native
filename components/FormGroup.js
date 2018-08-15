import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import TextBlock from './TextBlock';
import RadioCheckBlock from './RadioCheckBlock';
import SelectBlock from './SelectBlock';
import RatingBlock from './RatingBlock';
import SectionBlock from './SectionBlock';
import ContactBlock from './ContactBlock'
import ButtonBlock from './ButtonBlock';
import ScreenshotBlock from './ScreenshotBlock';
import withTheme from '../core/withTheme';

class FormGroup extends React.Component {

  static defaultProps = {
    isSwiping:() => {}
  };

  constructor(props) {
    super(props);
    this.state = {};

    this.setMeasurements = this.setMeasurements.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (nextProps.formGroupState.sub && this.props.formGroupState.sub) {

      let update = false;

      Object.keys(nextProps.formGroupState.sub).forEach((k) => {
        const nextSub = nextProps.formGroupState.sub[k];
        const thisSub = this.props.formGroupState[k];
        if (!thisSub || nextSub.showError !== thisSub.showError || nextSub.error !== thisSub.error) {
          update = true;
        }        
      });

      return update;

    } else if ( 
        !shallowEqual(nextProps.formGroupState,this.props.formGroupState)
    ) {
      return true;
    } else {
      return false;
   }

  }

  setMeasurements(event) {
    const { layout } = event.nativeEvent;
    setTimeout(() => {
      this.props.setElementProps({
        layout: layout,
        elementIndex: this.props.elementIndex
      },this.props.elementIndex)
    }, 1000 * (this.props.formGroupState.page - 1) );
  }

  onChildGroupValueChange(value,data) {
    this.props.updateFormState({value:value},data,this.props.elementIndex);
  }

  getBlock() { 

    const { data } = this.props;

    let blockProps = {
      data:data,
      onFormGroupValueChange:(value,data) => {this.onChildGroupValueChange(value,data)},
      formGroupState:this.props.formGroupState,
      elementIndex:this.props.elementIndex,
      isSwiping:(userSwiping) => {this.props.isSwiping(userSwiping)}
    };
    
    if (data.typeName == 'input' || data.typeName == 'textarea') {
      return (
        <TextBlock {...blockProps} />
      );

    } else if (data.typeName == 'radio' || data.typeName == 'checkbox') {

      if (!data.properties.show_as_buttons) {
        return (
          <RadioCheckBlock {...blockProps} />
        );
      } else {
        return (
          <ButtonBlock {...blockProps} />
        )
      }

    } else if (data.typeName == 'select') {
      return (
        <SelectBlock {...blockProps} />
      );
    
    } else if (data.typeName == 'rating' || data.typeName === 'nps' || data.typeName === 'ces') {
      return (
          <RatingBlock {...blockProps} />
      );

    } else if (data.typeName === 'section_break') {
      return (
        <SectionBlock data={data} />
      );

    } else if (data.typeName == 'contact') {
      return (
        <ContactBlock {...blockProps} />
      );

    } else if (data.typeName === 'category' || data.typeName === 'gcr' || data.typeName === 'thumbs') { 
      return (
        <ButtonBlock {...blockProps} />
      );

    } else if (data.typeName === 'screenshot') { 

      blockProps.screenshotCheckboxLabel = this.props.screenshotCheckboxLabel;
      
      return (
        <ScreenshotBlock {...blockProps}  />
      );
      
    } else if (data.typeName === 'page_break') {
    } else {
      return (<Text>No block found for this type</Text>);

    }
  }

  isRequired() {
    if (this.props.formGroupState.required) {
      let requiredStyle = {color:this.props.theme.requiredMarkColor};
      return (<Text style={requiredStyle}> *</Text>);
    }

    return null;
  }

  render() {

    const { data, theme, formGroupState } = this.props;

    let textStyle = [
      styles.text,
      data.typeName !== 'section_break' ? {color:theme.greyTextColor} 
      : [styles.headerText,{color:theme.darkTextColor}]
    ];

    let groupStyle = [
      styles.group,
      theme.groupsAsCards && data.typeName !== 'section_break'  ? styles.cards : null,
      formGroupState.isVisible ? {display:'flex'} : {display:'none'}
    ];
    return (
      <View 
        style={groupStyle} 
        onLayout={this.setMeasurements}
      >     
        <Text style={textStyle}>
          {this.props.data.title}
          {this.isRequired()}
        </Text>
        <View>
          {this.getBlock()}
        </View>
      </View>
    );
  }
} 


function shallowEqual(a, b) {
  for (let key in a) if (a[key]!==b[key]) return false;
  for (let key in b) if (!(key in a)) return false;
  return true;
}

const styles = StyleSheet.create({
  group: {
    flex: 1,
    paddingTop:20,
    paddingBottom:20,
    paddingHorizontal:10,
    overflow:'visible',
  },
  cards: {
    backgroundColor:'#fff',
    marginBottom:10,
    shadowColor:'#000',
    shadowOpacity:.075,
    shadowRadius:2,
    shadowOffset: {
      width:1,
      height:1
    },
    borderRadius:2
  },
  text: {
    marginBottom:10,
    marginBottom:10,
    fontWeight:'600',
    color:'#616161',
    fontSize:14
  },
  headerText: {
    fontWeight:'600',
    color:'#000',
    fontSize:16,
    marginBottom:5
  },
  tooltipStyle: {
    backgroundColor:'#616161',
    color:'#fff',
    fontSize:12,
    height:20,
    width:20,
    borderRadius:100
  }
});

export default withTheme(FormGroup);