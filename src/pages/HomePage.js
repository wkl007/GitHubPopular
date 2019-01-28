import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import NavigationUtils from '../utils/NavigationUtils'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

export default class HomePage extends Component {

  render () {
    const { navigation } = this.props
    NavigationUtils.navigation = navigation
    return <DynamicTabNavigator/>
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
