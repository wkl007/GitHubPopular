import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'

export default class FavoritePage extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>收藏</Text>
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
