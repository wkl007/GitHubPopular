import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import NavigationUtils from '../utils/NavigationUtils'

export default class PopularPage extends Component {
  _TabNavigator = () => {
    return createAppContainer(
      createMaterialTopTabNavigator(
        {
          PopularTab1: {
            screen: PopularTab,
            navigationOptions: {
              title: 'Tab1'
            }
          },
          PopularTab2: {
            screen: PopularTab,
            navigationOptions: {
              title: 'Tab2'
            }
          },
          PopularTab3: {
            screen: PopularTab,
            navigationOptions: {
              title: 'Tab3'
            }
          },
          PopularTab4: {
            screen: PopularTab,
            navigationOptions: {
              title: 'Tab4'
            }
          }
        }
      )
    )
  }

  render () {
    const TabNavigator = this._TabNavigator()
    return <TabNavigator/>
  }
}

class PopularTab extends Component {
  render () {
    const { TabLabel, navigation } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{TabLabel}</Text>
        <Text
          onPress={() => {
            NavigationUtils.goPage({ navigation }, 'DetailPage')
          }}
        >跳转到详情页面</Text>

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
