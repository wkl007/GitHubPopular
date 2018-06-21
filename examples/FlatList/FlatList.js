import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native'
import NavigationBar from '../../src/common/NavigationBar'
import Toast, { DURATION } from 'react-native-easy-toast'

let data = [
  {
    id: 1,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 2,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 3,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 4,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 5,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 6,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 7,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 8,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 9,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 10,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }, {
    id: 11,
    email: '499657357@qq.com',
    fullName: '王叔叔好'
  }
]
export default class FlatListDemo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      data: []
    }
  }

  componentDidMount () {
    this.onLoad()
  }

  onLoad () {
    this.setState({
      isLoading: true,
    })
    setTimeout(() => {
      this.setState({
        isLoading: false,
        data: data
      })
      this.refs.toast.show('数据获取成功！！！')
    }, 1000)
  }

  render () {
    return (
      <View style={styles.container}>
        <NavigationBar title='FlatList的使用'
                       statusBar={{
                         backgroundColor: '#817e80'
                       }}
                       style={{
                         backgroundColor: '#817e80'
                       }}

        />
        <FlatList
          ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: '#000'}}/>}
          ListHeaderComponent={() => <Text>我是头部哦</Text>}
          ListFooterComponent={() => <Image style={{width: 400, height: 300}}
                                            source={{uri: 'http://p5.so.qhimgs1.com/t01d483ab4cd026909b.jpg'}}/>}
          data={this.state.data}
          refreshing={this.state.isLoading}
          onRefresh={() => {
            this.refs.toast.show('获取数据中...')
            this.onLoad()
          }}
          renderItem={({item, index}) => <View key={index} style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                this.refs.toast.show(`你单击了:${item.fullName},index是${index}`, DURATION.LENGTH_LONG)
              }}
            >
              <Text style={styles.tips}>{item.email}</Text>
              <Text style={styles.tips}>{item.fullName}</Text>
            </TouchableOpacity>

          </View>}
        />
        <Toast
          ref='toast'
          // style={{backgroundColor:'red'}}
          // position='bottom'
          /*positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}*/
          // textStyle={{color:'#fff'}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  tips: {
    fontSize: 16,
    textAlign: 'center'
  },
  row: {
    height: 50
  }
})