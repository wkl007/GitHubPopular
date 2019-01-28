import React, { Component } from 'react'
import { Text, TextInput, View, StyleSheet } from 'react-native'

export default class Page3 extends Component {

  render () {
    const { navigation } = this.props
    const { state, setParams } = navigation
    const { params } = state
    const showText = params && params.mode === 'edit' ? '正在编辑' : '编辑完成'
    return (
      <View style={{ flex: 1, backgroundColor: 'gray', }}>
        <Text style={styles.text}>欢迎来到Page3</Text>
        <Text style={styles.showText}>{showText}</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            setParams({ title: text })
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
