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
  Clipboard
} from 'react-native';
import GlobalStyles from '../../assets/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import config from '../../assets/data/config'

const FLAG = {
  REPOSITORY: '开源项目',
  BLOG: {
    name: '技术博客',
    items: {
      PERSONAL_BLOG: {
        title: '个人博客',
        url: 'http://jiapenghui.com',
      },
      CSDN: {
        title: 'CSDN',
        url: 'http://blog.csdn.net/fengyuzhengfan',
      },
      JIANSHU: {
        title: '简书',
        url: 'http://www.jianshu.com/users/ca3943a4172a/latest_articles',
      },
      GITHUB: {
        title: 'GitHub',
        url: 'https://github.com/crazycodeboy',
      },
    }
  },
  CONTACT: {
    name: '联系方式',
    items: {
      QQ: {
        title: 'QQ',
        account: '1586866509',
      },
      Email: {
        title: 'Email',
        account: 'crazycodeboy@gmail.com',
      },
    }
  },
  QQ: {
    name: '技术交流群',
    items: {
      MD: {
        title: '移动开发者技术分享群',
        account: '335939197',
      },
      RN: {
        title: 'React Native学习交流群',
        account: '165774887',
      }
    },
  },
};

export default class AboutMePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectModels: [],
      author: config.author,
      showRepository: false,
      showBlog: false,
      showQQ: false,
      showContact: false
    }
  }

  render() {
    let content = <View>
      关于我
    </View>

    return <View>关于我</View>
  }
}








