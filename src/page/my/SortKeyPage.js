import React, {Component} from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import SortableListView from 'react-native-sortable-listview'
import ViewUtils from '../../util/ViewUtils'
import ArrayUtils from '../../util/ArrayUtils'
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import {ACTION_HOME, FLAG_TAB} from "../HomePage";

export default class SortKeyPage extends Component {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.flag = params.flag;
    this.languageDao = new LanguageDao(params.flag);
    this.theme = params.theme;
    this.dataArray = [];//原始数组
    this.originalCheckedArray = [];//筛选后的数组
    this.sortResultArray = [];//筛选后的数组应用到原始数组中
    this.state = {
      checkedArray: [],//筛选后数组排序
    }
  }

  componentDidMount() {
    this.loadData();
  }

  //加载本地存储的数据
  loadData() {
    this.languageDao.fetch()
      .then(result => {
        this.getCheckedItems(result);
      })
      .catch(err => {
        console.log(err);
      })
  }

  //返回
  onBack() {
    if (!ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
      Alert.alert(
        '提示',
        '是否要保存修改呢?',
        [
          {
            text: '否', onPress: () => {
              this.props.navigation.goBack();
            }
          }, {
          text: '是', onPress: () => {
            this.onSave(true);
          }
        }
        ]
      )
    } else {
      this.props.navigation.goBack();
    }

  }

  //保存
  onSave(isChecked) {
    if (!isChecked) {
      //判断是否相等，相等直接返回
      if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
        this.props.navigation.goBack();
        return;
      }
    }
    this.getSortResult();
    this.languageDao.save(this.sortResultArray);
    // this.props.navigation.goBack();
    let jumpToTab = this.props.flag === FLAG_LANGUAGE.flag_key ? FLAG_TAB.flag_popularTab : FLAG_TAB.flag_trendingTab;
    DeviceEventEmitter.emit('ACTION_HOME', ACTION_HOME.A_RESTART, jumpToTab)
  }

  //获取排序后的数组
  getSortResult() {
    this.sortResultArray = ArrayUtils.clone(this.dataArray);
    for (let i = 0, j = this.originalCheckedArray.length; i < j; i++) {
      let item = this.originalCheckedArray[i];
      let index = this.dataArray.indexOf(item);
      this.sortResultArray.splice(index, 1, this.state.checkedArray[i])
    }
  }

  //获取用户已订阅的标签
  getCheckedItems(result) {
    this.dataArray = result;
    let checkedArray = [];
    for (let i = 0, len = this.dataArray.length; i < len; i++) {
      let data = result[i];
      if (data.checked) {
        checkedArray.push(data);
      }
      this.setState({
        checkedArray: checkedArray
      });
      this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }
  }

  render() {
    let statusBar = {
      backgroundColor: this.theme.themeColor,
      barStyle: 'light-content'
    };
    let rightButton = <TouchableOpacity
      onPress={() => {
        this.onSave();
      }}
    >
      <View style={{marginRight: 10}}>
        <Text style={styles.title}>保存</Text>
      </View>
    </TouchableOpacity>;
    let title = this.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';

    return (
      <View style={styles.container}>
        <NavigationBar
          title={title}
          statusBar={statusBar}
          style={this.theme.styles.navBar}
          leftButton={ViewUtils.getLeftButton(() => {
            this.onBack()
          })}
          rightButton={rightButton}
        />
        <SortableListView
          data={this.state.checkedArray}
          order={Object.keys(this.state.checkedArray)}
          onRowMoved={(e) => {
            this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
            this.forceUpdate();
          }}
          renderRow={row => <SortCell data={row} theme={this.theme}/>}
        />
      </View>
    )
  }
}

class SortCell extends Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        delayLongPress={500}
        style={styles.item}
        {...this.props.sortHandlers}
      >
        <View style={styles.row}>
          <Image style={[{
            opacity: 1,
            width: 16,
            height: 16,
            marginRight: 10,
          }, this.props.theme.styles.tabBarSelectedIcon]} source={require('./images/ic_sort.png')}/>
          <Text>{this.props.data.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
  item: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee'
  }
});