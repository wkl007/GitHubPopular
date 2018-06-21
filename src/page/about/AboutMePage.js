import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Clipboard
} from 'react-native'
import GlobalStyles from '../../assets/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import config from '../../assets/data/config'
import Toast from 'react-native-easy-toast'
import WebViewPage from '../../page/WebViewPage'
import AboutCommon, { FLAG_ABOUT } from './AboutCommon'
import NavigatorUtil from '../../util/NavigatorUtil'

const FLAG = {
  BLOG: {
    name: '技术博客',
    items: {
      CSDN: {
        title: 'CSDN',
        url: 'http://blog.csdn.net/qq_35844177',
      },
      GITEE: {
        title: '码云',
        url: 'https://gitee.com/wkl--007',
      },
      GITHUB: {
        title: 'GitHub',
        url: 'https://github.com/wkl007',
      },
    }
  },
  CONTACT: {
    name: '联系方式',
    items: {
      QQ: {
        title: 'QQ',
        account: '499657357',
      },
      Email: {
        title: 'Email',
        account: '18404969231@163.com',
      },
    }
  },
}

export default class AboutMePage extends Component {
  constructor (props) {
    super(props)
    this.params = this.props.navigation.state.params
    console.log(this.params)
   /* this.aboutCommon = new AboutCommon({
      ...this.params,
      navigation: this.props.navigation
    }, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about_me, config)*/
    this.theme = this.params.theme
    this.state = {
      projectModels: [],
      author: config.author,
      showBlog: false,
      showContact: false
    }
  }

  componentDidMount () {
    // this.aboutCommon.componentDidMount()
  }

  componentWillUnmount () {
    // this.aboutCommon.componentWillUnmount()
  }

  updateState (dic) {
    this.setState(dic)
  }

  /**
   *获取item右侧图标
   * @param isShow
   * @returns {*}
   */
  getClickIcon (isShow) {
    return isShow ? require('../../assets/images/ic_tiaozhuan.png') : require('../../assets/images/ic_tiaozhuan_down.png')
  }

  onClick (tab) {
    let TargetComponent, params = {menuType: tab, ...this.params}
    switch (tab) {
      case FLAG.BLOG.items.CSDN:
      case FLAG.BLOG.items.GITHUB:
      case FLAG.BLOG.items.GITEE:
        // case FLAG.BLOG.items.PERSONAL_BLOG:
        TargetComponent = 'WebViewPage'
        params.title = tab.title
        params.url = tab.url
        break
      case FLAG.CONTACT.items.Email:
        let url = 'mailto://' + tab.account
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle url: ' + url)
          } else {
            return Linking.openURL(url)
          }
        }).catch(err => console.error('An error occurred', err))
        break
      // case FLAG.REPOSITORY:
      //   this.updateState({showRepository: !this.state.showRepository});
      //   break;
      case FLAG.BLOG:
        this.updateState({showBlog: !this.state.showBlog})
        break
      // case FLAG.QQ:
      //   this.updateState({showQQ: !this.state.showQQ});
      //   break;
      case FLAG.CONTACT:
        this.updateState({showContact: !this.state.showContact})
        break
      case FLAG.CONTACT.items.QQ:
        Clipboard.setString(tab.account)
        this.toast.show('QQ:' + tab.account + '已复制到剪切板。')
        break
      // case FLAG.QQ.items.MD:
      // case FLAG.QQ.items.RN:
      //   Clipboard.setString(tab.account);
      //   this.toast.show('群号:' + tab.account + '已复制到剪切板。');
      //   break;
    }
    if (TargetComponent) {
      NavigatorUtil.goToMenuPage(params, TargetComponent)
    }
  }

  /**
   * 显示列表数据
   * @param dic
   * @param isShowAccount
   */
  renderItems (dic, isShowAccount) {
    if (!dic) return null
    let views = []
    for (let i in dic) {
      let title = isShowAccount ? `${dic[i].title}:${dic[i].account}` : dic[i].title
      views.push(
        <View key={i}>
          {ViewUtils.getSettingItem(() => this.onClick(dic[i]), '', title, this.theme.styles.tabBarSelectedIcon)}
          <View style={GlobalStyles.line}/>
        </View>
      )
    }
    return views
  }

  render () {
    let content = <View>
      {ViewUtils.getSettingItem(() => {
          this.onClick(FLAG.BLOG)
        }, require('../../assets/images/ic_computer.png'), FLAG.BLOG.name, this.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showBlog)
      )}
      <View style={GlobalStyles.line}/>
      {this.state.showBlog ? this.renderItems(FLAG.BLOG.items) : null}
      {/*{ViewUtils.getSettingItem(() => {*/}
      {/*this.onClick(FLAG.REPOSITORY)*/}
      {/*}, require('../../assets/images/ic_code.png'), FLAG.REPOSITORY, this.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showRepository)*/}
      {/*)}*/}
      {/*<View style={GlobalStyles.line}/>*/}
      {/*{this.state.showRepository ? this.aboutCommon.renderRepository(this.state.projectModels) : null}*/}
      {/*{ViewUtils.getSettingItem(() => {
          this.onClick(FLAG.QQ)
        }, require('../../assets/images/ic_computer.png'), FLAG.QQ.name, this.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showQQ)
      )}*/}
      {/*<View style={GlobalStyles.line}/>*/}
      {/*{this.state.showQQ ? this.renderItems(FLAG.QQ.items, true) : null}*/}
      {ViewUtils.getSettingItem(() => {
          this.onClick(FLAG.CONTACT)
        }, require('../../assets/images/ic_contacts.png'), FLAG.CONTACT.name, this.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showContact)
      )}
      <View style={GlobalStyles.line}/>
      {this.state.showContact ? this.renderItems(FLAG.CONTACT.items, true) : null}
    </View>
    return (
      <View style={styles.container}>
        <Text>
          222
        </Text>
       {/* {this.aboutCommon.render(content, this.state.author)}*/}
        <Toast ref={e => this.toast = e}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})






