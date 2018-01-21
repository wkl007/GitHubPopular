'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Text,
  View,
  Linking,
} from 'react-native'
import Popover from '../common/Popover'

export const MORE_MENU = {
  Custom_Language: '自定义语言',
  Sort_Language: '语言排序',
  Custom_Theme: '自定义主题',
  Custom_Key: '自定义标签',
  Sort_Key: '标签排序',
  Remove_Key: '标签移除',
  About_Author: '关于作者',
  About: '关于',
  Website: 'Website',
  Feedback: '反馈',
  Share: '分享',
};

export default class MoreMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      buttonRect: {}
    }
  }

  static propTypes = {
    contentStyle: View.propTypes.style,
    menus: PropTypes.array.isRequired,
    anchorView: PropTypes.func,
  };

  //打开更多菜单
  open() {

  }

  renderMoreView() {
    let view = <Popover>

    </Popover>;
    return view;
  }

  render() {
    return this.renderMoreView();
  }

}