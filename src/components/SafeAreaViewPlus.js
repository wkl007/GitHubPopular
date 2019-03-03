import React, { Component, } from 'react'
import { DeviceInfo, SafeAreaView, StyleSheet, View, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'

export default class SafeAreaViewPlus extends Component {
  static propTypes = {
    ...ViewPropTypes,
    topColor: PropTypes.string,
    bottomColor: PropTypes.string,
    enablePlus: PropTypes.bool,
    topInset: PropTypes.bool,
    bottomInset: PropTypes.bool,
  }

  static defaultProps = {
    topColor: 'transparent',
    bottomColor: '#f8f8f8',
    enablePlus: true,
    topInset: true,
    bottomInset: false,
  }

  // 顶部安全区域
  renderTopArea = (topColor, topInset) => {
    return !DeviceInfo.isIPhoneX_deprecated || !topInset ? null
      : <View style={[styles.topArea, { backgroundColor: topColor }]}/>
  }

  // 底部安全区域
  renderBottomArea = (bottomColor, bottomInset) => {
    return !DeviceInfo.isIPhoneX_deprecated || !bottomInset ? null
      : <View style={[styles.bottomArea, { backgroundColor: bottomColor }]}/>
  }

  // 系统安全区域
  renderSafeAreaView = () => {
    return <SafeAreaView style={[styles.container, this.props.style]} {...this.props}>
      {this.props.children}
    </SafeAreaView>
  }

  // 自定义安全区域
  renderSafeAreaViewPlus = () => {
    const { children, topColor, bottomColor, topInset, bottomInset } = this.props
    return <View style={[styles.container, this.props.style]}>
      {this.renderTopArea(topColor, topInset)}
      {children}
      {this.renderBottomArea(bottomColor, bottomInset)}
    </View>
  }

  render (): React.ReactNode {
    const { enablePlus } = this.props
    return enablePlus ? this.renderSafeAreaViewPlus() : this.renderSafeAreaView()
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topArea: {
    height: 44,
  },
  bottomArea: {
    height: 34,
  }
})