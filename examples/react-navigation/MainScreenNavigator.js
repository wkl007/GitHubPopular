import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import {TabNavigator} from 'react-navigation'

class RecentChatsScreen extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <Text>王叔叔</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Chat', {user: '王叔叔'})}
          title="跟王叔叔聊天"
        />
      </View>
    )
  }
}

class AllContactsScreen extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <Text>小瓶瓶</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Chat', {user: '小瓶瓶'})}
          title="跟小瓶瓶聊天"
        />
      </View>
    )
  }
}

const MainScreenNavigator = TabNavigator({
  Recent: {screen: RecentChatsScreen},
  All: {screen: AllContactsScreen},
});

export default MainScreenNavigator;