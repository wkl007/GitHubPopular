import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../../src/common/NavigationBar'
import GitHubTrending from 'GitHubTrending'

const URL = 'https://github.com/trending/'

export default class GitHubTrendingDemo extends Component {
  constructor (props) {
    super(props)
    this.githubTrending = new GitHubTrending()
    this.state = {
      data: ''
    }
  }

  onLoad () {
    let url = URL + this.text
    this.githubTrending.fetchTrending(url)
      .then(result => {
        this.setState({
          data: JSON.stringify(result)
        })
      }).catch(err => {
      console.log(err)
    })

  }

  render () {
    return (
      <View style={{flex: 1}}>
        <NavigationBar title='GitHubTrending的使用'
                       statusBar={{
                         backgroundColor: '#2196F3'
                       }}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, justifyContent: 'space-between'}}>
          <TextInput
            style={{height: 50, borderWidth: 1, margin: 6, flex: 1}}
            onChangeText={text => this.text = text}
          ></TextInput>
          <Text
            onPress={() => {
              this.onLoad()
            }}
          >
            加载
          </Text>
        </View>
        <Text style={{flex: 1}}>{this.state.data}</Text>
      </View>
    )
  }
}