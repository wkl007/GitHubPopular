import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import NavigationUtil from '../utils/NavigationUtil'

export default class WelcomePage extends Component {
  componentDidMount () {
    const { navigation } = this.props
    this.timer = setTimeout(() => {
      NavigationUtil.resetToHomePage({ navigation })
    }, 200)
  }

  componentWillUnmount () {
    this.timer && clearTimeout(this.timer)
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>欢迎页面</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
