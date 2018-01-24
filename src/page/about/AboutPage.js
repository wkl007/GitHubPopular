'use strict';
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ListView,
  Platform,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {MORE_MENU} from "../../common/MoreMenu";
import GlobalStyles from '../../assets/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import config from '../../assets/data/config'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.aboutCommon = new AboutCommon(props, (dic) => {
      this.updateState(dic)
    }, FLAG_ABOUT.flag_about, config);
    this.state = {
      projectModels: [],
      author: config.author
    }
  }

  componentDidMount() {
    this.aboutCommon.componentDidMount();
  }

  componentWillunmount() {
    this.aboutCommon.componentWillUnmount();
  }

  updateState(dic) {
    this.setState(dic);
  }

  onClick(tab) {
    let TargetComponent, parame = {menuType: tab};
    switch (tab) {
      case MORE_MENU.About_Author:
        TargetComponent = 'AboutMePage';
        break;
      case MORE_MENU.Website:
        TargetComponent = 'WebViewPage';
        parame.title = 'GitHubPopular';
        parame.url = 'https://gitee.com/wkl--007/GitHubPopular';
        break;
      case MORE_MENU.Feedback:
        let url = 'mailto://499657357@qq.com';
        Linking.canOpenURL(url).then(supported => {
          if (!supported) {
            console.log(`can\'t handle url:${url}`)
          } else {
            return Linking.openURL(url)
          }
        });
        break;
    }
    if (TargetComponent) {
      this.props.navigation.navigate(TargetComponent, parame)
    }
  }

  render() {
    let content = <View>
      {this.aboutCommon.renderRepository(this.state.projectModels)}
      {ViewUtils.getSettingItem(() => {
          this.onClick(MORE_MENU.Website)
        }, require('../../assets/images/ic_computer.png'), MORE_MENU.Website, {tintColor: '#2196f3'}
      )}
      <View style={GlobalStyles.line}/>
      {ViewUtils.getSettingItem(() => {
          this.onClick(MORE_MENU.About_Author)
        }, require('../my/images/ic_insert_emoticon.png'), MORE_MENU.About_Author, {tintColor: '#2196f3'}
      )}
      <View style={GlobalStyles.line}/>
      {ViewUtils.getSettingItem(() => {
          this.onClick(MORE_MENU.Feedback)
        }, require('../../assets/images/ic_feedback.png'), MORE_MENU.Feedback, {tintColor: '#2196f3'}
      )}
    </View>;
    return (
      this.aboutCommon.render(content, {
        name: 'GitHub Popular',
        description: '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
        avatar: this.state.author.avatar1,
        backgroundImg: this.state.author.backgroundImg1
      })
    )
  }
}
