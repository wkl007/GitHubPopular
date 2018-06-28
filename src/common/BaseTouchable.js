import React, { Component } from 'react'
import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback
} from 'react-native'

export default class BaseTouchable extends Component {
  render () {
    const {children} = this.props
    let content = Platform.OS === 'ios'
      ? <TouchableOpacity {...this.props}>
        {children}
      </TouchableOpacity>
      : <TouchableNativeFeedback {...this.props}>
        {children}
      </TouchableNativeFeedback>
    return content
  }
}