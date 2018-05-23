import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import withTheme from '../core/withTheme';

class ButtonGroup extends React.Component {

  static defaultProps = {
    onPrevPress:()=>{},
    onNextPress:()=>{},
    onSubmitPress:() => {},
    text:{
      prev:'Previous',
      next:'Next',
      submit:'Submit'
    }
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  getButtons() {

    const buttonTypes = ['prev','next','submit'];
    return this.props.buttons.filter((o) => {
      return buttonTypes.indexOf(o) > -1
    }).map((o,i) => {
      if (o === 'prev') {
        return (
          <Button 
            key={i}
            raised={true}
            text={this.props.text.prev}
            buttonType={o}
            onPress={() => {this.props.onPrevPress()}}
            icon={'angleLeft'}
          />
        );
      } else if (o === 'next') {
        return (
          <Button 
            key={i}
            raised={true}
            text={this.props.text.next}
            buttonType={o}
            onPress={() => {this.props.onNextPress()}}
            icon={'angleRight'}
          />
          );
      } else if (o === 'submit') {
        return(
          <Button 
            key={i}
            text={this.props.text.submit}
            buttonType={o}
            onPress={() => {
              if (!this.props.formStatus) { 
                this.props.onSubmitPress()
              }
            }}
            icon={'paperPlaneO'}
            formStatus={this.props.formStatus}
          />
        )
      }
    })
  }

  render() {
    return (
      <View style={styles.group}>     
        <View>
          {this.getButtons()}
        </View>
      </View>
    );
  }
} 

const styles = StyleSheet.create({
  group: {
    flex: 1,
    paddingTop:10,
    paddingBottom:10,
    overflow:'visible',
    marginLeft:10,
    marginRight:10,
  }
});

export default withTheme(ButtonGroup);