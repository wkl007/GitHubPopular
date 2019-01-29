import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import NavigationUtils from '../utils/NavigationUtils'

export default class PopularPage extends Component {
  constructor (props) {
    super(props)
    this.tabNames = ['iOS', 'Java', 'Android', 'React', 'React Native']
  }

  _renderTabs = () => {
    const tabs = {}
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTab {...props} tabLabel={item}/>,
        navigationOptions: {
          title: item
        }
      }
    })
    return createAppContainer(createMaterialTopTabNavigator(
      tabs,
      {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          style: {
            height: 30,//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
            backgroundColor: '#678',//TabBar背景色
          },
          indicatorStyle: styles.indicatorStyle,//标签指示器的样式
          labelStyle: styles.labelStyle,//文字的样式
          upperCaseLabel: false,//是否使标签大写，默认为true
          scrollEnabled: true,//是否支持 选项卡滚动，默认false
        },
        lazy: true
      }
    ))
  }

  /*_TabNavigator = () => {
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
  }*/

  render () {
    const TabNavigator = this._renderTabs()
    return <TabNavigator/>
  }
}

class PopularTab extends Component {
  render () {
    const { TabLabel, navigation } = this.props
    return (
      <View style={styles.container}>
        <Text>{TabLabel}</Text>
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
  },
  tabStyle: {
    // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
    padding: 0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 13,
    margin: 0
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  },
})
