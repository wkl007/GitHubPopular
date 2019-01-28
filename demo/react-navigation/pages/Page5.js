import React, { Component } from 'react'
import { Button, Text, View, StyleSheet } from 'react-native'

export default class Page5 extends Component {
  /**
   * this.props.navigation.openDrawer();
   * this.props.navigation.closeDrawer();
   * this.props.navigation.toggleDrawer();
   * 或者
   * this.props.navigation.dispatch(DrawerActions.openDrawer());
   * this.props.navigation.dispatch(DrawerActions.closeDrawer());
   * this.props.navigation.dispatch(DrawerActions.toggleDrawer());
   */
  render () {
    const { navigation } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: '#f67888', }}>
        <Text style={styles.text}>欢迎来到Page5</Text>
        <Button
          title='Open drawer'
          onPress={() => navigation.openDrawer()}
        />
        <Button
          title='Toggle drawer'
          onPress={() => navigation.toggleDrawer()}
        />
        <Button
          title='Go to Page4'
          onPress={() => navigation.navigate('Page4')}
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
