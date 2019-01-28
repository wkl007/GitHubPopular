import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { MaterialTopTabNavigator } from '../navigators/AppNavigators'

export default class Page2 extends Component {
  render () {
    const MaterialTopTabNavigator = createAppContainer(MaterialTopTabNavigator)
    return <View style={styles.container}>
      <MaterialTopTabNavigator/>
    </View>

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  text: {
    fontSize: 20,
    color: 'white'
  }
})
