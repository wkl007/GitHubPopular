import React, { Component } from 'react'
import { Button, Platform, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import actions from '../redux/action'
import NavigationBar from '../components/NavigationBar'

const THEME_COLOR = '#678'

class FavoritePage extends Component {
  render () {
    const { navigation, onThemeChange } = this.props
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar = <NavigationBar
      title='收藏'
      statusBar={statusBar}
      style={{ backgroundColor: THEME_COLOR }}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <Button
          title='更改主题色'
          onPress={() => {
            onThemeChange('red')
            /* navigation.setParams({
               theme: {
                 tintColor: 'red',
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
)(FavoritePage)

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
