import React, { Component } from 'react'
import { View, Text, Linking } from 'react-native'
import NavigationUtil from '../../utils/NavigationUtil'
import ViewUtil from '../../utils/ViewUtil'
import { MORE_MENU } from '../../utils/MoreMenu'
import AboutCommon, { FLAG_ABOUT } from './AboutCommon'
import config from '../../assets/data/config'
import GlobalStyles from '../../assets/styles/GlobalStyles'

const THEME_COLOR = '#678'

export default class AboutPage extends Component {
  constructor (props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about
      },
      data => this.setState({ ...data })
    )
    this.state = {
      data: config
    }
  }

  onClick = (menu) => {
    const { theme } = this.params
    let RouteName, params = { theme }
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage'
        params.title = '教程'
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=89'
        break
      case MORE_MENU.About_Author:
        RouteName = 'AboutMePage'
        break
      case MORE_MENU.Feedback:
        const url = 'mailto://18404969231@163.com'
        Linking.canOpenURL(url).then(support => {
          if (!support) {
            console.log('Can\'t handle url: ' + url)
          } else {
            Linking.openURL(url)
          }
        }).catch(err => {
          console.error('An error occurred', err)
        })
        break
    }

    if (RouteName) {
      NavigationUtil.goPage(params, RouteName)
    }
  }

  // 渲染item
  renderItem = (menu) => {
    const { theme } = this.params
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor)
  }

  render () {
    const content = <View>
      {this.renderItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line}/>
      {this.renderItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line}/>
      {this.renderItem(MORE_MENU.Feedback)}
    </View>
    return this.aboutCommon.render(content, this.state.data.app)
  }
}
