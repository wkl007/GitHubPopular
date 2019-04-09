/**
 * 自定义Touchable组件
 */
import React, { Component } from 'react'
import { Platform, TouchableNativeFeedback, TouchableOpacity } from 'react-native'

export default class BaseTouchable extends Component {
  render () {
    const { children } = this.props
    return Platform.OS === 'ios'
      ? <TouchableOpacity
        {...this.props}
      >
        {children}
      </TouchableOpacity>
      : <TouchableNativeFeedback
        {...this.props}
      >
        {children}
      </TouchableNativeFeedback>
  }
}
