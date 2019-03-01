import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import NavigationUtil from '../utils/NavigationUtil'
import actions from '../redux/action'

class WelcomePage extends Component {
  componentDidMount () {
    const { navigation, onThemeInit } = this.props
    onThemeInit()
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

const mapDispatchToProps = dispatch => ({
  onThemeInit: () => dispatch(actions.onThemeInit())
})

export default connect(null, mapDispatchToProps)(WelcomePage)

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
