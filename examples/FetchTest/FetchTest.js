import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList
} from 'react-native'
import NavigationBar from '../../src/common/NavigationBar'
import HttpUtils from './HttpUtils'

export default class FetchTest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      result: []
    }
  }

  onLoad (url) {
    HttpUtils.get(url)
      .then(res => {
        this.setState({
          result: res.details
        })
        console.log(res)
      }).catch(err => {
      console.log(err)
    })
    /*fetch(url)
      .then(res => res.json())
      .then(result => {
        this.setState({
          result: result.details
        });
        console.log(result)
      })
      .catch(err=>{
        console.log(err)
      })*/
  }

  render () {
    return (
      <View style={styles.container}>
        <NavigationBar title='Fetch的使用'
                       statusBar={{
                         backgroundColor: '#817e80'
                       }}
                       style={{
                         backgroundColor: '#817e80'
                       }}
        />
        <Text
          onPress={() => this.onLoad('http://guang.wxtight.com/ad/newestPublishAdMaterialInfo')}
        >
          获取数据
        </Text>
        <Text>返回结果</Text>
        <FlatList
          data={this.state.result}
          renderItem={({item, index}) => (
            <View key={index}>
              <Text>{item.title}</Text>
            </View>
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  tips: {
    fontSize: 16,
    textAlign: 'center'
  },
  row: {
    height: 50
  }
})