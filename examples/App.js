/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native'
// import TabNavigator from 'react-native-tab-navigator';
// import NavigationBar from './src/common/NavigationBar'
// import FlatListDemo from './js/FlatList/FlatList'
// import FetchTest from './js/FetchTest/FetchTest'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedTab: 'tb_popular'
    }
  }

  renderButton (image) {
    return (
      <TouchableOpacity
        onPress={() => {
          alert(222)
        }}
      >
        <Image
          style={styles.image}
          source={image}/>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <FetchTest/>
        {/*<FlatListDemo/>*/}
        {/*<NavigationBar title={'标题222'}
                       statusBar={{
                         backgroundColor: 'pink'
                       }}
                       leftButton={
                         this.renderButton(require('./src/assets/images/ic_arrow_back_white_36pt.png'))
                       }
                       rightButton={
                         this.renderButton(require('./src/assets/images/ic_star.png'))
                       }
        />
        <TabNavigator>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_popular'}
            selectedTitleStyle={{color: 'red'}}
            title="最热"
            renderIcon={() => <Image style={styles.image} source={require('./src/assets/images/ic_polular.png')}/>}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]}
                                             source={require('./src/assets/images/ic_polular.png')}/>}
            onPress={() => this.setState({selectedTab: 'tb_popular'})}
          >
            <View style={styles.page1}>
              <Text>home</Text>
            </View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_trending'}
            selectedTitleStyle={{color: 'yellow'}}
            title="趋势"
            renderIcon={() => <Image style={styles.image} source={require('./src/assets/images/ic_trending.png')}/>}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'yellow'}]}
                                             source={require('./src/assets/images/ic_trending.png')}/>}
            onPress={() => this.setState({selectedTab: 'tb_trending'})}
          >
            <View style={styles.page2}>
              <Text>profile</Text>
            </View>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_favorite'}
            selectedTitleStyle={{color: 'red'}}
            title="收藏"
            renderIcon={() => <Image style={styles.image} source={require('./src/assets/images/ic_polular.png')}/>}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'red'}]}
                                             source={require('./src/assets/images/ic_polular.png')}/>}
            onPress={() => this.setState({selectedTab: 'tb_favorite'})}
          >
            <View style={styles.page1}>
              <Text>home</Text>
            </View>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'tb_my'}
            selectedTitleStyle={{color: 'yellow'}}
            title="我的"
            renderIcon={() => <Image style={styles.image} source={require('./src/assets/images/ic_trending.png')}/>}
            renderSelectedIcon={() => <Image style={[styles.image, {tintColor: 'yellow'}]}
                                             source={require('./src/assets/images/ic_trending.png')}/>}
            onPress={() => this.setState({selectedTab: 'tb_my'})}
          >
            <View style={styles.page2}>
              <Text>profile</Text>
            </View>
          </TabNavigator.Item>
        </TabNavigator>*/}

        {/*<Navigator
          initialRoute={{
            component: Boy
          }}
          renderScence={(route, navigator) => {
            let Component = route.component;
            return <Component navigator={navigator} {...route.params}></Component>
          }}
        >

        </Navigator>*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff'
  },
  page1: {
    flex: 1,
    backgroundColor: 'red',
  },
  page2: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  image: {
    height: 22,
    width: 22,
    margin: 5
  }
})

