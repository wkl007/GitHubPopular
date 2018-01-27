import React, {Component} from 'react';
import {
  DeviceEventEmitter
} from 'react-native';
import {ACTION_HOME} from './HomePage'

export default class BaseComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: this.props.theme
    }
  }

  componentDidMount() {
    this.baseListener = DeviceEventEmitter.addListener('ACTION_BASE', (action, params) => this.onBaseAction(action, params));
  }

  componentWillUnmount() {
    this.baseListener && this.baseListener.remove();
  }

  /**
   * 通知回调事件处理
   * @param action
   * @param params
   */
  onBaseAction(action, params) {
    if (ACTION_HOME.A_THEME === action) {
      this.onThemeChange(params)
    }
  }

  /**
   * 主题改变后更新主题
   * @param theme
   */
  onThemeChange(theme) {
    if (!theme) return;
    this.setState({
      theme: theme
    })
  }
}