import React, {Component} from 'react';
import {
  View,
  Text,
  Button
} from 'react-native'

export default class HomeScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Welcome'
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View>
        <Text>我是第一个页面</Text>
        <Button
          title='chat with lucy'
          onPress={() => navigate('Chat',{user:'王凯令'})}
        ></Button>
      </View>
    )
  }
}