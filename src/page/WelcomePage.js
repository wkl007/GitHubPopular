import React, { Component } from 'react'
import {
  StyleSheet
} from 'react-native'
import NavigatorUtil from '../util/NavigatorUtil'
import ThemeDao from '../expand/dao/ThemeDao'
import SplashScreen from 'react-native-splash-screen'

export default class WelcomePage extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    new ThemeDao().getTheme().then((data) => {
      this.theme = data
    })
    this.timer = setTimeout(() => {
      SplashScreen.hide()
      NavigatorUtil.resetToHomePage({
        navigation: this.props.navigation,
        theme: this.theme
      })
    }, 500)
  }

  componentWillUnmount () {
    this.timer && clearTimeout(this.timer)
  }

  render () {
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tips: {
    fontSize: 29
  }
})