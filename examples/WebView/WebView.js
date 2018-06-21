import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  WebView,
  DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../../src/common/NavigationBar'

const URL = 'http://www.baidu.com'
export default class WebViewDemo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      url: URL,
      title: '',
      canGoBack: false,

    }
  }

  goBack () {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      DeviceEventEmitter.emit('showToast', '到顶了！！！')
    }
  }

  go () {
    this.setState({
      url: this.text
    })
  }

  onNavigationStateChange (e) {
    this.setState({
      title: e.title,
      canGoBack: e.canGoBack
    })
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <NavigationBar title='WebView的使用'
                       statusBar={{
                         backgroundColor: '#2196F3'
                       }}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, justifyContent: 'space-between'}}>
          <Text
            onPress={() => {
              this.goBack()
            }}
          >返回</Text>
          <TextInput
            style={{height: 50, borderWidth: 1, margin: 6, flex: 1}}
            defaultValue={URL}
            onChangeText={text => this.text = text}
          />
          <Text
            onPress={() => {
              this.go()
            }}
          >
            前进
          </Text>
        </View>
        <WebView
          ref={webView => this.webView = webView}
          onNavigationStateChange={(e) => {
            this.onNavigationStateChange(e)
          }}
          source={{
            uri: this.state.url
          }}

        />
      </View>
    )
  }
}