import React, {Component} from 'react';
import {
  View,
  Text,

} from 'react-native'
import NavigationBar from '../../src/common/NavigationBar'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'

const URL = 'https://github.com/trending/';

export default class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
    this.state = {
      data: ''
    }
  }

  //加载数据
  onLoad() {
    let url = URL + this.text;
    this.dataRepository.fetchRepository(url)
      .then(result => {
        this.setState({
          data: JSON.stringify(result)
        })
      }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <NavigationBar title='趋势'
                       statusBar={{
                         backgroundColor: '#2196F3'
                       }}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, justifyContent: 'space-between'}}>

        </View>
        <Text style={{flex: 1}}>{this.state.data}</Text>
      </View>
    )
  }
}