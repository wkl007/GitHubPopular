import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import NavigationBar from '../../src/common/NavigationBar'

export default class ChatScreen extends Component {
  constructor (props) {
    super(props)
  }

  renderButton (image) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.goBack()
        }}
      >
        <Image
          style={styles.image}
          source={image}/>
      </TouchableOpacity>
    )
  }

  static navigationOptions = ({navigation}) => ({
    headerTitle: `Chat with ${navigation.state.params.user}`
  })

  render () {
    const {params} = this.props.navigation.state
    return (
      <View>
        <NavigationBar title={'标题222'}
                       statusBar={{
                         backgroundColor: 'pink'
                       }}
                       leftButton={
                         this.renderButton(require('../../src/assets/images/ic_arrow_back_white_36pt.png'))
                       }
                       rightButton={
                         this.renderButton(require('../../src/assets/images/ic_star.png'))
                       }
        />
        <Text>我是第二个页面{params.user}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    height: 22,
    width: 22,
    margin: 5
  }
})