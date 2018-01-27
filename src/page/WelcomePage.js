import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import {NavigationActions} from 'react-navigation'
import ThemeDao from '../expand/dao/ThemeDao'

export default class WelcomePage extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    new ThemeDao().getTheme().then((data) => {
      this.theme = data;
    });

    this.timer = setTimeout(() => {
      let resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({routeName: 'HomePage', params: {theme: this.theme}})
        ]
      });
      this.props.navigation.dispatch(resetAction);
    }, 500)
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View>
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