import React, { Component } from 'react'
import { Button, Platform, StyleSheet, Text, View } from 'react-native'

export default class MyPage extends Component {
  render () {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>我的</Text>
        <Button
          title='更改主题色'
          onPress={() => {
            navigation.setParams({
              theme: {
                tintColor: 'blue',
                updateTime: new Date().getTime()
              }
            })
          }}
        />
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
