import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import SortKeyPage from "./SortKeyPage";
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao.js'


export default class MyPage extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }


  render() {

    return (
      <View>
        <NavigationBar
          title='我的'
          statusBar={{
            backgroundColor: '#2196F3'
          }}
        />
        <Text
          onPress={() => {
            this.props.navigation.navigate('CustomKeyPage', {isRemoveKey: false, flag: FLAG_LANGUAGE.flag_key})
          }}
        >自定义标签</Text>
        <Text
          onPress={() => {
            this.props.navigation.navigate('SortKeyPage', {flag: FLAG_LANGUAGE.flag_key})
          }}
        >标签排序页</Text>
        <Text
          onPress={() => {
            this.props.navigation.navigate('CustomKeyPage', {isRemoveKey: true, flag: FLAG_LANGUAGE.flag_key})
          }}
        >标签移除</Text>
        <Text
          onPress={() => {
            this.props.navigation.navigate('CustomKeyPage', {isRemoveKey: false, flag: FLAG_LANGUAGE.flag_language})
          }}
        >自定义语言</Text>
        <Text
          onPress={() => {
            this.props.navigation.navigate('SortKeyPage', {flag: FLAG_LANGUAGE.flag_language})
          }}
        >语言排序页</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({});