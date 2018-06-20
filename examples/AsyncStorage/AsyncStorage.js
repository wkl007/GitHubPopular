import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  AsyncStorage
} from 'react-native'
import NavigationBar from '../../src/common/NavigationBar'
import Toast, {DURATION} from 'react-native-easy-toast'

const KEY = 'text';
export default class AsyncStorageTest extends Component {
  constructor(props) {
    super(props);
  }

  onSave() {
    AsyncStorage.setItem(KEY, this.text, (error) => {
      if (!error) {
        this.toast.show('保存成功！！！', DURATION.LENGTH_LONG);
      } else {
        this.toast.show('保存失败！！！', DURATION.LENGTH_LONG);
      }
    });
  }

  onRemove() {
    AsyncStorage.removeItem(KEY, (error) => {
      if (!error) {
        this.toast.show('移除成功！！！', DURATION.LENGTH_LONG);
      } else {
        this.toast.show('移除失败！！！', DURATION.LENGTH_LONG);
      }
    })
  }

  onFetch() {
    AsyncStorage.getItem(KEY, (error, result) => {
      if (!error) {
        if (result) {
          this.toast.show(`取出的内容为：${result}`);
        } else {
          this.toast.show(`取出的内容为不存在`);
        }
      } else {
        this.toast.show('取出失败！！！');
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar title='AsyncStorage的使用'
                       statusBar={{
                         backgroundColor: '#2196F3'
                       }}
        />
        <TextInput
          style={{height: 50, borderWidth: 1, margin: 6}}
          onChangeText={text => this.text = text}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Text
            onPress={() => this.onSave()}
          >
            保存
          </Text>
          <Text
            onPress={() => this.onRemove()}
          >
            移除
          </Text>
          <Text
            onPress={() => this.onFetch()}
          >
            取出
          </Text>
        </View>

        <Toast ref={toast => this.toast = toast}/>
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
});