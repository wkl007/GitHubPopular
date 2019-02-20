import React from 'react'
import {
  DeviceInfo,
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import BackPressComponent from '../../components/BackPressComponent'
import NavigationUtils from '../../utils/NavigationUtils'
import { MORE_MENU } from '../../utils/MoreMenu'
import GlobalStyles from '../../assets/styles/GlobalStyles'
import config from '../../assets/data/config'
import share from '../../assets/data/share'

export const FLAG_ABOUT = {
  flag_about: 'about',
  flag_about_me: 'about_me'
}

export default class AboutCommon {
  constructor (props, updateState) {
    this.props = props
    this.updateState = updateState
    this.updateState({
      data: config
    })
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }

  componentDidMount () {
    this.backPress.componentDidMount()
  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()
  }

  onBackPress = () => {
    NavigationUtils.goBack(this.props.navigation)
    return true
  }

  render () {
    return <View>
      <Text>222</Text>
    </View>
  }
}