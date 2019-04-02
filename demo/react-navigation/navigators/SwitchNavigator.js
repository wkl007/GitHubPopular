import React, { Component } from 'react'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import Page1 from '../pages/Page1'
import Login from '../pages/Login'
import HomePage from '../pages/HomePage'

const AppStack = createStackNavigator({
  Home: {
    screen: HomePage
  },
  Page1: {
    screen: Page1
  }
})

const AuthStack = createStackNavigator({
  Login: {
    screen: Login
  }
})

export default createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppStack
  },
  {
    initialRouteName: 'Auth'
  }
)


