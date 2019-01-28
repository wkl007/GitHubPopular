import React, { Component } from 'react'
import { Button, Text, View, StyleSheet } from 'react-native'

export default class Page4 extends Component {

  render () {
    const { navigation } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: 'gray' }}>
        <Text style={styles.text}>欢迎来到Page4</Text>
        <Button
          title='Open drawer'
          onPress={() => navigation.openDrawer()}
        />
        <Button
          title='Toggle drawer'
          onPress={() => navigation.toggleDrawer()}
        />
        <Button
          title='Go to Page5'
          onPress={() => navigation.navigate('Page5')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: 'white'
  },
  showText: {
    marginTop: 30,
    fontSize: 20,
    color: 'blue'
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginTop: 10,
    borderColor: 'black'
  }
})
