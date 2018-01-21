import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
// import NavigationBar from '../common/NavigationBar'
import {NavigationActions} from 'react-navigation'
//重置路由
const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'HomePage'})
  ]
});

export default class WelcomePage extends Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      // this.props.navigation.navigate('HomePage')
      this.props.navigation.dispatch(resetAction);
    }, 2000)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    // const {navigate} = this.props.navigation;
    return (
      <View>
        {/*<NavigationBar
          title='欢迎'
        />*/}
        <Text>欢迎</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  tips: {
    fontSize: 29
  }
});