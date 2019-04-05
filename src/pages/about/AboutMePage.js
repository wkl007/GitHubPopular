import React, { Component } from 'react'
import { View, Text, Linking, Clipboard } from 'react-native'
import Toast from 'react-native-easy-toast'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NavigationUtil from '../../utils/NavigationUtil'
import ViewUtil from '../../utils/ViewUtil'
import AboutCommon, { FLAG_ABOUT } from './AboutCommon'
import config from '../../assets/data/config'
import GlobalStyles from '../../assets/styles/GlobalStyles'
import BackPressComponent from '../../components/BackPressComponent'

export default class AboutMePage extends Component {
  constructor (props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.aboutCommon = new AboutCommon(
      {
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about_me
      },
      data => this.setState({ ...data })
    )
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false
    }
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }

  componentDidMount () {
    this.aboutCommon.componentDidMount()
  }

  componentWillUnmount () {
    this.aboutCommon.componentWillUnmount()
  }

  onBackPress = () => {
    NavigationUtil.goBack(this.props.navigation)
    return true
  }

  onClick = (tab) => {
    if (!tab) return
    const { theme } = this.params
    //网页
    if (tab.url) {
      NavigationUtil.goPage(
        { theme, title: tab.title, url: tab.url },
        'WebViewPage'
      )
      return
    }
    //邮箱
    if (tab.account && tab.account.indexOf('@') > -1) {
      let url = `mailto://${tab.account}`
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.log('Can\'t handle url: ' + url)
        } else {
          return Linking.openURL(url)
        }
      }).catch(err => console.error('An error occurred', err))
      return
    }
    //复制
    if (tab.account) {
      Clipboard.setString(tab.account)
      this.toast.show(`${tab.title}:${tab.account}已复制到剪贴板。`)
    }
  }

  // 渲染分类item
  renderSectionItem = (data, isShow, key) => {
    const { theme } = this.params
    return ViewUtil.getSetingItem(
      () => {
        this.setState({
          [key]: !this.state[key]
        })
      },
      data.name,
      theme.themeColor,
      Ionicons,
      data.icon,
      isShow ? 'ios-arrow-up' : 'ios-arrow-down'
    )
  }

  renderItems = (dic, isShowAccount) => {
    if (!dic) return null
    const { theme } = this.params
    let views = []
    for (let i in dic) {
      let title = isShowAccount ? `${dic[i].title}:${dic[i].account}` : dic[i].title
      views.push(
        <View key={i}>
          {ViewUtil.getSetingItem(
            () => {this.onClick(dic[i])},
            title,
            theme.themeColor
          )}
          <View style={GlobalStyles.line}/>
        </View>
      )
    }
    return views
  }

  render () {
    const { data, showTutorial, showBlog, showQQ, showContact } = this.state
    const content = <View>
      {/*课程*/}
      {/* {this.renderSectionItem(data.aboutMe.Tutorial, showTutorial, 'showTutorial')}
      <View style={GlobalStyles.line}/>
      {showTutorial ? this.renderItems(data.aboutMe.Tutorial.items) : null}*/}
      {/*博客*/}
      {this.renderSectionItem(data.aboutMe.Blog, showBlog, 'showBlog')}
      <View style={GlobalStyles.line}/>
      {showBlog ? this.renderItems(data.aboutMe.Blog.items) : null}
      {/*QQ*/}
      {/*{this.renderSectionItem(data.aboutMe.QQ, showQQ, 'showQQ')}
      <View style={GlobalStyles.line}/>
      {showQQ ? this.renderItems(data.aboutMe.QQ.items, true) : null}*/}
      {/*联系*/}
      {this.renderSectionItem(data.aboutMe.Contact, showContact, 'showContact')}
      <View style={GlobalStyles.line}/>
      {showContact ? this.renderItems(data.aboutMe.Contact.items, true) : null}
    </View>
    return <View style={{ flex: 1 }}>
      {this.aboutCommon.render(content, this.state.data.author)}
      <Toast
        ref={toast => this.toast = toast}
        position='center'
      />
    </View>
  }
}
