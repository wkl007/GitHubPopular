'use strict'

import React from 'react';
import {
  Image,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

export default class ViewUtils {
  /**
   *
   * @param callback 单击item的回调
   * @param icon 左侧图标
   * @param text 显示的文本
   * @param tintStyle 图标着色
   * @param expandableIco 右侧图标
   */
  static getSettingItem(callback, icon, text, tintStyle, expandableIco) {
    return (
      <TouchableOpacity
        onPress={callback}
      >
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          {icon ?
            <Image source={icon} resizeMode='stretch'
                   style={[{opacity: 1, width: 16, height: 16, marginRight: 10,}, tintStyle]}/> :
            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10}}>
              <Text>{text}</Text>
            </View>
          }
          <Image source={expandableIco ? expandableIco : require('../assets/images/ic_tiaozhuan.png')}
                 style={[{marginRight: 10, height: 22, width: 22, alignSelf: 'center', opacity: 1}, tintStyle]}
          />
        </View>
      </TouchableOpacity>
    )
  }

  /**
   * 获取左侧按钮
   * @param callback
   * @returns {*}
   */
  static getLeftButton(callback) {
    return <TouchableOpacity
      style={{padding: 8}}
      onPress={callback}
    >
      <Image
        style={{width: 26, height: 26}}
        source={require('../assets/images/ic_arrow_back_white_36pt.png')}
      />
    </TouchableOpacity>
  }

  /**
   * 获取右侧按钮
   * @param title
   * @param callback
   * @returns {*}
   */
  static getRightButton(title, callback) {
    return <TouchableOpacity
      style={{alignItems: 'center'}}
      onPress={callback}
    >
      <View style={{marginRight: 10}}>
        <Text style={{fontSize: 20, color: '#fff'}}>{title}</Text>
      </View>
    </TouchableOpacity>
  }

  /**
   * 获取更多按钮
   * @param callback
   * @returns {*}
   */
  static getMoreButton(callback) {
    return <TouchableOpacity
      underlayColor='transparent'
      ref='moreMenuButton'
      style={{padding: 5}}
      onPress={callback}
    >
      <View style={{paddingRight: 8}}>
        <Image
          style={{width: 24, height: 24}}
          srouce={require('../assets/images/ic_more_vert_white_48pt.png')}
        />
      </View>
    </TouchableOpacity>
  }

  /**
   *获取分享按钮
   * @param callback
   * @returns {*}
   */
  static getShareButton(callback) {
    return <TouchableOpacity
      underlayColor='transparent'
      ref='moreMenuButton'
      style={{padding: 5}}
      onPress={callback}
    >
      <Image
        style={{width: 20, height: 20, opacity: 0.9}}
        srouce={require('../assets/images/ic_share.png')}
      />
    </TouchableOpacity>
  }
}