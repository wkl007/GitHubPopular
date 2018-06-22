/**
 * 更多菜单
 */
import React from 'react'
import PropTypes from 'prop-types'
import {
  TouchableOpacity,
  Text,
  View,
  Linking,
  ViewPropTypes
} from 'react-native'
import Popover from '../common/Popover'
import MenuDialog from '../common/MenuDialog'
import BaseComponent from '../page/BaseComponent'
import NavigatorUtil from '../util/NavigatorUtil'
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'

export const MORE_MENU = {
  Custom_Language: {name: '自定义语言', icon: require('../assets/images/ic_custom_language.png')},
  Sort_Language: {name: '语言排序', icon: require('../assets/images/ic_swap_vert.png')},
  Custom_Theme: {name: '自定义主题', icon: require('../assets/images/ic_view_quilt.png')},
  Custom_Key: {name: '自定义标签', icon: require('../assets/images/ic_custom_language.png')},
  Sort_Key: {name: '标签排序', icon: require('../assets/images/ic_swap_vert.png')},
  Remove_Key: {name: '标签移除', icon: require('../assets/images/ic_remove.png')},
  About_Author: {name: '关于作者', icon: require('../assets/images/ic_insert_emoticon.png')},
  About: {name: '关于', icon: require('../assets/images/ic_trending.png')},
  Website: {name: 'Website', icon: require('../assets/images/ic_computer.png')},
  Feedback: {name: '反馈', icon: require('../assets/images/ic_feedback.png')},
  Share: {name: '分享', icon: require('../assets/images/ic_share.png')},
}

export default class MoreMenu extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
      // isVisible: false,//显示隐藏
      buttonRect: {},
      theme: this.props.theme,
    }
  }

  static propTypes = {
    contentStyle: ViewPropTypes.style,//样式
    menus: PropTypes.array.isRequired,//数组，必填
    anchorView: PropTypes.func,//位置
  }

  //打开更多菜单
  open () {
    this.showPopover()
  }

  showPopover () {
    this.dialog.show()
    /*if (!this.props.anchorView) return
    let anchorView = this.props.anchorView()
    anchorView.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonRect: {x: px, y: py, width: width, height: height}
      })
    })*/
  }

  //关闭更多菜单
  closePopover () {
    // this.setState({isVisible: false})
    this.dialog.dismiss()
  }

  //菜单选择
  onMoreMenuSelect (tab) {
    this.closePopover()
    if (typeof (this.props.onMoreMenuSelect) == 'function') this.props.onMoreMenuSelect(tab)
    let TargetComponent, params = {menuType: tab, theme: this.state.theme}
    switch (tab) {
      case MORE_MENU.Custom_Language:
        TargetComponent = 'CustomKeyPage'
        params.flag = FLAG_LANGUAGE.flag_language
        break
      case MORE_MENU.Custom_Key:
        TargetComponent = 'CustomKeyPage'
        params.flag = FLAG_LANGUAGE.flag_key
        break
      case MORE_MENU.Remove_Key:
        TargetComponent = 'CustomKeyPage'
        params.isRemoveKey = true
        params.flag = FLAG_LANGUAGE.flag_key
        break
      case MORE_MENU.Sort_Language:
        TargetComponent = 'SortKeyPage'
        params.flag = FLAG_LANGUAGE.flag_language
        break
      case MORE_MENU.Sort_Key:
        TargetComponent = 'SortKeyPage'
        params.flag = FLAG_LANGUAGE.flag_key
        break
      case MORE_MENU.Custom_Theme:

        break
      case MORE_MENU.About_Author:
        TargetComponent = 'AboutMePage'
        break
      case MORE_MENU.About:
        TargetComponent = 'AboutPage'
        break
      case MORE_MENU.Feedback:
        let url = '499657357@qq.com'
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log(`can\'t handle url:${url}`)
          } else {
            return Linking.openURL(url)
          }
        }).catch(err => {
          console.log(`An error occurred ${err}`)
        })
        break
      case MORE_MENU.Share:

        break
    }
    if (TargetComponent) {
      NavigatorUtil.goToMenuPage(params, TargetComponent)
    }
  }

  renderMoreView () {
    const {theme, menus} = this.props
    /* let view = <Popover
       isVisible={this.state.isVisible}
       fromRect={this.state.buttonRect}
       placement="bottom"
       contentMarginRight={20}
       onClose={() => this.closePopover()}
       contentStyle={{opacity: 0.82, backgroundColor: '#343434'}}
       style={{backgroundColor: 'red'}}>
       <View style={{alignItems: 'center'}}>
         {this.props.menus.map((result, i, arr) => {
           return <TouchableOpacity key={i} onPress={() => this.onMoreMenuSelect(arr[i])}
                                    underlayColor='transparent'>
             <Text
               style={{fontSize: 18, color: 'white', padding: 8, fontWeight: '400'}}>
               {arr[i]}
             </Text>
           </TouchableOpacity>
         })
         }
       </View>
     </Popover>*/
    return <MenuDialog
      ref={dialog => this.dialog = dialog}
      menus={menus}
      theme={theme}
      onSelect={(tab) => this.onMoreMenuSelect(tab)}
    />
  }

  render () {
    return this.renderMoreView()
  }
}