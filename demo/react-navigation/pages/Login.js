import React, { Component } from 'react'
import { Button, Text, View, StyleSheet } from 'react-native'

export default class Login extends Component {
  render () {
    const { navigation } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: 'gray' }}>
        <Text style={styles.text}>登录页</Text>
        <Button
          title='Login'
          onPress={() => {
            navigation.navigate('App')
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: 'white'
  }
})
