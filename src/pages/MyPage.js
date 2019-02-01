import React, { Component } from 'react'
import { Button, Platform, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import actions from '../redux/action'
import NavigationBar from '../components/NavigationBar'

const THEME_COLOR = '#678'

class MyPage extends Component {
  render () {
    const { navigation, onThemeChange } = this.props
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar = <NavigationBar
      title='我的'
      statusBar={statusBar}
      style={{ backgroundColor: THEME_COLOR }}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <Button
          title='更改主题色'
          onPress={() => {
            onThemeChange('blue')
            /*navigation.setParams({
              theme: {
                tintColor: 'blue',
                updateTime: new Date().getTime()
              }
            })*/
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
