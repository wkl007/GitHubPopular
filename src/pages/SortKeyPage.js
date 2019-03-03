import React, { Component } from 'react'
import {
  Alert,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux'
import SortableListView from 'react-native-sortable-listview'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SafeAreaViewPlus from '../components/SafeAreaViewPlus'
import NavigationBar from '../components/NavigationBar'
import BackPressComponent from '../components/BackPressComponent'
import NavigationUtil from '../utils/NavigationUtil'
import ArrayUtil from '../utils/ArrayUtil'
import ViewUtil from '../utils/ViewUtil'
import LanguageDao, { FLAG_LANGUAGE } from '../utils/cache/LanguageDao'
import actions from '../redux/action'
import GlobalStyles from '../assets/styles/GlobalStyles'

class SortKeyPage extends Component {
  constructor (props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) })
    this.languageDao = new LanguageDao(this.params.flag)

    this.state = {
      checkedArray: SortKeyPage.getKeys(this.props)
    }
  }

  componentDidMount () {
    this.backPress.componentDidMount()
    //如果props中标签为空则从本地存储中获取标签
    if (SortKeyPage.getKeys(this.props).length === 0) {
      const { onLoadLanguage } = this.props
      onLoadLanguage(this.params.flag)
    }
  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const checkedArray = SortKeyPage.getKeys(nextProps, null, prevState)
    if (prevState.checkedArray.length !== checkedArray.length) {
      return {
        checkedArray,
      }
    }
    return null
  }

  /**
   * 获取标签
   * @param props
   * @param state
   * @returns {*}
   */
  static getKeys (props, state) {
    //如果state中有checkedArray则使用state中的checkedArray
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray
    }
    //否则从原始数据中获取checkedArray
    const flag = SortKeyPage.getFlag(props)
    let dataArray = props.language[flag] || []
    let keys = []
    for (let i = 0, j = dataArray.length; i < j; i++) {
      let data = dataArray[i]
      if (data.checked) keys.push(data)
    }
    return keys
  }

  static getFlag (props) {
    const { flag } = props.navigation.state.params
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
  }

// 处理安卓物理返回键
  onBackPress = (e) => {
    this.onBack()
    return true
  }

  onBack = () => {
    if (!ArrayUtil.isEqual(SortKeyPage.getKeys(this.props), this.state.checkedArray)) {
      Alert.alert('提示', '要保存修改吗？',
        [
          {
            text: '否', onPress: () => {
              NavigationUtil.goBack(this.props.navigation)
            }
          }, {
          text: '是', onPress: () => {
            this.onSave(true)
          }
        }
        ])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  //保存修改
  onSave = (hasChecked) => {
    if (!hasChecked) {
      //如果没有排序则直接返回
      if (ArrayUtil.isEqual(SortKeyPage.getKeys(this.props), this.state.checkedArray)) {
        NavigationUtil.goBack(this.props.navigation)
        return
      }
    }
    //保存排序后的数据
    //获取排序后的数据
    //更新本地数据
    this.languageDao.save(this.getSortResult())
    //重新加载排序后的标签，以便其他页面能够及时更新
    const { onLoadLanguage } = this.props
    //更新store
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack(this.props.navigation)
  }

  getSortResult = () => {
    const flag = SortKeyPage.getFlag(this.props)
    //从原始数据中复制一份数据出来，以便对这份数据进行进行排序
    let sortResultArray = ArrayUtil.clone(this.props.language[flag])
    //获取排序之前的排列顺序
    const originalCheckedArray = SortKeyPage.getKeys(this.props)
    //遍历排序之前的数据，用排序后的数据checkedArray进行替换
    for (let i = 0, length = originalCheckedArray.length; i < length; i++) {
      let item = originalCheckedArray[i]
      //找到要替换的元素所在位置
      let index = this.props.language[flag].indexOf(item)
      //进行替换
      sortResultArray.splice(index, 1, this.state.checkedArray[i])
    }
    return sortResultArray
  }

  render () {
    const { theme } = this.params
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序'
    const statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      title={title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />
    return <SafeAreaViewPlus
      style={GlobalStyles.root_container}
      topColor={theme.themeColor}
    >
      {navigationBar}
      <SortableListView
        data={this.state.checkedArray}
        order={Object.keys(this.state.checkedArray)}
        onRowMoved={e => {
          this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
          this.forceUpdate()
        }}
        renderRow={row => <SortCell data={row} {...this.params}/>}
      />
    </SafeAreaViewPlus>
  }
}

class SortCell extends Component {
  render () {
    const { theme } = this.props
    return <TouchableHighlight
      underlayColor='#eee'
      style={this.props.data.checked ? styles.item : styles.hidden}
      {...this.props.sortHandlers}
    >
      <View style={{ marginLeft: 10, flexDirection: 'row' }}>
        <MaterialCommunityIcons
          name={'sort'}
          size={16}
          style={{ marginRight: 10, color: theme.themeColor }}/>
        <Text>{this.props.data.name}</Text>
      </View>
    </TouchableHighlight>
  }
}

const mapSortKeyStateToProps = state => ({
  language: state.language
})

const mapSortKeyDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapSortKeyStateToProps, mapSortKeyDispatchToProps)(SortKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
  hidden: {
    height: 0
  },
  item: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center'
  },
})