import React from 'react';
import {StyleSheet, View, Text, Image, Animated} from 'react-native';
import PropTypes from 'prop-types';

export default class Branding extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {  
    return (
      <Animated.View style={[styles.flex,styles.center,styles.padding]}>
        <Text style={styles.powered}>Powered by</Text>
        <Image
          style={[{
            height:24,
            width:24,
          }]}
          source={{uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNjI4REM3OTEwRTUxMUU1QkQ1N0Y4MDQ1REUxODZGQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNjI4REM3QTEwRTUxMUU1QkQ1N0Y4MDQ1REUxODZGQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE2MjhEQzc3MTBFNTExRTVCRDU3RjgwNDVERTE4NkZCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE2MjhEQzc4MTBFNTExRTVCRDU3RjgwNDVERTE4NkZCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+5r19gwAABkFJREFUeNrUWVlMVFcY/mbmzsqADKhEwMKIiBYJ2MWkaW1Nk6YbjU1Xm8aHRhPsWxeTJm1MTPvSpg+tMWmTmr40tk2aPjRUWwpYNXFDaNUqKpvIMrLjzIDD7Lf/mTmXudx7wQsCyp98GeZy/nu+859/O2cMje4ScHESPiG8QlhF6CY0Ec4RzhIuESK4x2LghN2Ek4TcGcb2E/4hnOeL8BD6OBaVsI1PnjUH/Sihgy/iDN8R9vfEQhEWCF/MkaykX8KxnT8bJlzl5DsJPYQ2QvN8WXjkLgjPRhj5Rplb/UcYmIuFbIvkfm6ON/j3MOGibBdaCQ08uOMzEb5FcNyDgLcQHuWQSy/hNOFrHhdTxLjYUa5D8vkuMNLfahH24P6V3YQdSsL985MgDQul85nSh29OO1QUCezFGpPwz6jXh+joKA2LwGiywbxyBYx2Cgkxrk0wLibGR/wsdGIwGrmOI01bByjgabNlWsIGkwliJIpgd3eSdOo/sK0pTEwa7GwnknE4itdj2dYtMDkciIyMYryxEYG+LliWrYQ5J4feE6b3CYhPTCDouUHvMMFZXg5X6fO0MCsig8MYaziHwPWrMNszYcnPhxiLJA2VknI5YVXQxXw+CNnZ2PDrzzBYLZNWZgtp27kb4zdv4IGqd+F67llkbHkCZhorSaClBb7jJ9D7+ZcItDbDWbIREz3diAXGkffBh8h85mlkbn0KRpt9UmeivR3+02fQd+Ab+JvOIm1tKRk7Kif9oLxwbKLPf+WEI0NDZEk3Nl1sUu1P45pi5H20B7lVVTM6XpBINr9QCf/lS7BmuFDy4w/IrqycUSdOu9FcuQ3e2hrauY0Qo5O91i+ENyXC+TxxpxoE8jHr6nyUnztF22af8jzq98NWWKgrpoKdN9C0eTMqamrgfPghfYFILthYVIzo0Cj5do7kkpcJZVKWYOVxSFdZzMrSTZaJzV2Ix1pb9ZPlgVmwbx9C47fkWaSIt78Jwszug7PNSOMXLqCtajeubn8bHXv2IB4Oa44zuTJlvtqBjvfeT+i07tyFkEc7QS1//VU4C4oRowzEhW1zjhR0Uq9bqpfswKFDaN3xDiWlKMW8gBB9jp1qwMa/jkDIyNDU8dYfRfNL2xAK3oaZdCKkM1JdjbK6WjgrKqZWM3LDtE0VGK0+DFNGuvQ4U7IwZszFCgkPDqJtxy6YrA6kU2DY3UVwrSvD8NmTuLn/gLbOwACubHsNYiiKZeuSOpklZQgOD6Hr473TuJ+LMsWUA84qOWHd/YS3ppaybwiWvNzJKBYjEdgFO0V3vbZOXT0iAS/sRUWJsYmMQC5ks7sQHR5R5HrJzEblk2I54V69hH3HTmiUVZFcwYWwpw8xyiIqC/cNJIqlGItNjS+LGfFQGPFgUB17RlXZXi8nrLufCPX0wCRQGY0ryqhgSuTRqM+nJtzbS4Q1+gYDW0Scdiqm3RZMlVI5YZ1ZgvqAMT+MFqvW3MleIK6ePJZYhHH6Bkhf38QsbJLeouvQKDKrxmjlxulmMEBzdhHQy2oGYfW/aFaEk8Fg0A6S+W49tWWDRHgMS0NK5RaOLgHCZRJh1k17lwDhAqPsyD24BAhnyXPNwBIgnC0n7FkChB1Gxe1kMm1SCTVQLZc378lyaYJBEKgyacQny9GU7qwFBeoWMy2N+g+1TqJU0zwmp1Otk+7U0okIihuX1ARU4/sPfp8808V5saAJYuO36WXp6lTLxlEd8ny1H8JyyvFUchPnQCIUaGuDJSNbTYoOrmIohP7vDsJgsyXnkXSuXINZrXPeILvQfovwU+rUHMFEV7tUpiZP+7bVa+kAaVVbmXVXZOHg9Q5WwJE6QRpgWZkHs8ulavJT83QortNIZ0UuzHTCkemwLPaInPCThBP3qe96Ob9Lwn2cJVhM1RGqCfVSnRAUA4KLeP2qlDF+WcLujv8g1HA+quvWyd6cnzzci0iyi3Cc8Bt3x1t3PLkrvg8vMGF2dmzgljzKMavWT0nYo3HBfLfCbtaPEQ4TankbMGdREmbX9S/fJcFOvs3stz32Q8yp+Vy9kjDLw3vn8J4WHii/c2sumCgJXyO8SDhyBz027m/Cn9yKnYsVpYLGM2apxwmf8mtOJ085vTxIjsz3Ns9G/hdgAKWHO6KH/nMDAAAAAElFTkSuQmCC'}}
        />
        <Text style={styles.mopinion}>
          opinion
        </Text>
      </Animated.View>
    );
  }
} 

const styles = StyleSheet.create({
  padding: {
    padding:10
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  powered: {
    color:'#7b7b7b',
    fontWeight:'600',
    letterSpacing:.5,
    fontSize:12,
    marginRight:5
  },
  mopinion: {
    fontSize:14,
    color:'#303031',
    marginLeft:1
  }
})