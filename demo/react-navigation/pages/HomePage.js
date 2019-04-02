import React, { Component } from 'react'
import { Button, Text, View, StyleSheet } from 'react-native'
import CheckBox from 'react-native-check-box'

export default class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pageCheckedArray: [true, true, false]
    }
  }

  //在这里定义每个页面的导航属性
  static navigationOptions = {
    title: 'Home',
    headerBackTitle: '返回按钮'//设置返回此页面的返回按钮文案，有长度限制
  }

  doCheck = (index) => {
    console.log(index)
    this.state.pageCheckedArray[index] = !this.state.pageCheckedArray[index]
    this.setState({
      pageCheckedArray: this.state.pageCheckedArray
    })
  }

  render () {
    const { navigation } = this.props
    const { pageCheckedArray } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'gray' }}>
        <Text style={styles.text}>欢迎来到HomePage</Text>
        <Button
          title='Go To Page1'
          onPress={() => {
            navigation.navigate('Page1', { name: '动态的' })
          }}
        />
        <Button
          title='Go To Page2'
          onPress={() => {
            navigation.navigate('Page2')
          }}
        />
        <Button
          title='Go To Page3'
          onPress={() => {
            navigation.navigate('Page3', { name: 'wkl' })
          }}
        />
        <View style={styles.page_container}>
          <CheckBox
            style={styles.check_btn}
            checkBoxColor='white'
            leftTextStyle={styles.page}
            onClick={() => {this.doCheck(0)}}
            isChecked={pageCheckedArray[0]}
            leftText='Page1'
          />
          <CheckBox
            style={styles.check_btn}
            checkBoxColor='white'
            leftTextStyle={styles.page}
            onClick={() => {this.doCheck(1)}}
            isChecked={pageCheckedArray[1]}
            leftText='Page2'
          />
          <CheckBox
            style={styles.check_btn}
            checkBoxColor='white'
            leftTextStyle={styles.page}
            onClick={() => {this.doCheck(2)}}
            isChecked={pageCheckedArray[2]}
            leftText='Page3'
          />
        </View>
        <Button
          title='Go to TabNavigator'
          onPress={() => {
            let tabs = []
            for (let i in pageCheckedArray) {
              pageCheckedArray[i] && tabs.push('Page' + (parseInt(i) + 1))
            }
            navigation.navigate('TabNav', { name: 'wkl', tabs: tabs })
          }}
        />
        <Button
          title='Go to DrawerNavigator'
          onPress={() => {
            navigation.navigate('DrawerNav', { name: 'wkl' })
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
  page_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    padding: 10,
    borderColor: 'white'
  },
  check_btn: {
    padding: 10,
    flex: 1
  },
  page: {
    color: 'white',
    fontSize: 15
  }
})
