/**
 * 自定义导航器
 */
import React, { Component } from 'react'
import {
  Text,
  View,
  ViewPropTypes,
  DeviceInfo,
  StatusBar,
  StyleSheet,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'

const NAV_BAR_HEIGHT_IOS = 44//ios bar高度
const NAV_BAR_HEIGHT_ANDROID = 50//android bar高度
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20//状态栏高度
const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
}

export default class NavigationBar extends Component {
  static propTypes = {
    style: ViewPropTypes.style,//样式
    title: PropTypes.string,//标题
    titleView: PropTypes.element,//title dom
    titleLayoutStyle: ViewPropTypes.style,//title dom样式
    hide: PropTypes.bool,//是否隐藏
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,//右侧按钮
    leftButton: PropTypes.element,//左侧按钮
  }

  static defaultProps = {
    statusBar: {
      barStyle: 'line-content',
      hidden: false
    }
  }

  // 渲染按钮
  renderButtonElement = (data) => {
    return (
      <View style={styles.navBarButton}>
        {data ? data : null}
      </View>
    )
  }

  render () {
    const { style, title, titleView, titleLayoutStyle, hide, statusBar, rightButton, leftButton } = this.props

    let customStatusBar = !statusBar.hidden
      ? <View style={styles.statusBar}>
        <StatusBar {...statusBar}/>
      </View>
      : null

    let customTitleView = titleView
      ? titleView
      : <Text
        ellipsizeMode="tail"
        numberOfLines={1}
        style={styles.title}
      >{title}</Text>

    let content = hide ? null :
      <View style={styles.navBar}>
        {this.renderButtonElement(leftButton)}
        <View style={[styles.navBarTitleContainer, titleLayoutStyle]}>
          {customTitleView}
        </View>
        {this.renderButtonElement(rightButton)}
      </View>

    return (
      <View style={[styles.container, style]}>
        {customStatusBar}
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196f3'
  },
  navBarButton: {
    alignItems: 'center'
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
  },
  navBarTitleContainer: {
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
  }
})
