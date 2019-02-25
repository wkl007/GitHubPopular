import React, { Component } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  Text
} from 'react-native'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NavigationBar from '../components/NavigationBar'
import BackPressComponent from '../components/BackPressComponent'
import NavigationUtil from '../utils/NavigationUtil'
import ArrayUtil from '../utils/ArrayUtil'
import LanguageDao, { FLAG_LANGUAGE } from '../utils/cache/LanguageDao'
import actions from '../redux/action'

class CustomKeyPage extends Component {
  constructor (props) {
    super(props)

  }

  componentDidMount (): void {
  }

  componentWillUnmount (): void {

  }

  render () {
    return <View>
      <Text>222</Text>
    </View>
  }
}