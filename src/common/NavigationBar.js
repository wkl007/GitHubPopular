/**
 * 自定义导航
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  View
} from 'react-native'

const NAV_BAR_HEIGHT_IOS = 44//ios bar高度
const NAV_BAR_HEIGHT_ANDROID = 50//android bar高度
const STATUS_BAR_HEIGHT = 20
const StatusBarShape = {
  barStyle: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  backgroundColor: PropTypes.string,
}

export default class NavigationBar extends Component {
  static propTypes = {
    // style: View.propTypes.style,//样式
    title: PropTypes.string,//标题
    titleView: PropTypes.element,//title dom
    // titleLayoutStyle: View.propTypes.style,//
    hide: PropTypes.bool,//是否隐藏
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,//右侧按钮
    leftButton: PropTypes.element,//左侧按钮
  }
  static defaultProps = {
    statusBar: {
      barStyle: 'line-content',
      hidden: false,
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      title: '',
      hide: false,
    }
  }

  getButtonElement (data) {
    return (
      <View style={styles.navBarButton}>
        {data ? data : null}
      </View>
    )
  }

  render () {
    let statusBar = !this.props.statusBar.hidden ? <View style={[styles.statusBar, this.props.statusBar]}>
      <StatusBar {...this.props.statusBar}/>
    </View> : null

    let titleView = this.props.titleView ? this.props.titleView : <Text ellipsizeMode="tail" numberOfLines={1}
                                                                        style={styles.title}>{this.props.title}</Text>

    let content = this.props.hide ? null :
      <View style={styles.navBar}>
        {this.getButtonElement(this.props.leftButton)}
        <View style={styles.titleViewContainer}>
          {titleView}
        </View>
        {this.getButtonElement(this.props.rightButton)}
      </View>

    return (
      <View style={[styles.container, this.props.style]}>
        {statusBar}
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196F3'
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
  },
  titleViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    top: 0,
    bottom: 0,
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  navBarButton: {
    alignItems: 'center',
  },
  statusBar: {
    height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
  },
})