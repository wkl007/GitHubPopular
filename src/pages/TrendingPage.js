import React, { Component } from 'react'
import { Button, Platform, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import actions from '../redux/action'

class TrendingPage extends Component {
  render () {
    const { navigation, onThemeChange } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>趋势</Text>
        <Button
          title='更改主题色'
          onPress={() => {
            onThemeChange('#096')
            /*navigation.setParams({
              theme: {
                tintColor: 'yellow',
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
)(TrendingPage)

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
