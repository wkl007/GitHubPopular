import React, { Component } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SafeAreaViewPlus from '../components/SafeAreaViewPlus'
import NavigationBar from '../components/NavigationBar'
import BackPressComponent from '../components/BackPressComponent'
import NavigationUtil from '../utils/NavigationUtil'
import ArrayUtil from '../utils/ArrayUtil'
import LanguageDao, { FLAG_LANGUAGE } from '../utils/cache/LanguageDao'
import actions from '../redux/action'
import ViewUtil from '../utils/ViewUtil'
import GlobalStyles from '../assets/styles/GlobalStyles'

class CustomKeyPage extends Component {
  constructor (props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) })
    this.changeValues = []//保存变更
    this.isRemoveKey = !!this.params.isRemoveKey//强制转换为布尔型（boolean）
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      keys: []
    }
  }

  componentDidMount () {
    this.backPress.componentDidMount()
    //如果props中标签为空则从本地存储中获取标签
    let data = CustomKeyPage.getKeys(this.props)
    if (CustomKeyPage.getKeys(this.props).length === 0) {
      let { onLoadLanguage } = this.props
      onLoadLanguage(this.params.flag)
    }
    this.setState({
      keys: CustomKeyPage.getKeys(this.props)
    })
  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.keys !== CustomKeyPage.getKeys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage.getKeys(nextProps, null, prevState)
      }
    }
    return null
  }

  /**
   * 获取标签
   * @param props
   * @param original 移除标签时使用，是否从props获取原始对的标签
   * @param state 移除标签时使用
   * @returns {*}
   */
  static getKeys (props, original, state) {
    const { flag, isRemoveKey } = props.navigation.state.params
    let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
    if (isRemoveKey && !original) {
      //如果state中的keys为空则从props中取
      return state && state.keys && state.keys.length !== 0 && state.keys || props.language[key].map(val => {
        //注意：不直接修改props，copy一份
        return {
          ...val,
          checked: false
        }
      })
    } else {
      return props.language[key]
    }
  }

  // 处理安卓物理返回键
  onBackPress = (e) => {
    this.onBack()
    return true
  }

  onBack = () => {
    if (this.changeValues.length > 0) {
      Alert.alert('提示', '要保存修改吗',
        [
          {
            text: '否',
            onPress: () => {
              NavigationUtil.goBack(this.props.navigation)
            }
          },
          {
            text: '是',
            onPress: () => {
              this.onSave()
            }
          }
        ])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  //保存修改
  onSave = () => {
    if (this.changeValues.length === 0) {
      NavigationUtil.goBack(this.props.navigation)
      return
    }
    let keys
    //移除标签的特殊处理
    if (this.isRemoveKey) {
      for (let i = 0, length = this.changeValues.length; i < length; i++) {
        ArrayUtil.remove(keys = CustomKeyPage.getKeys(this.props, true), this.changeValues[i], 'name')
      }
    }
    //更新本地数据
    this.languageDao.save(keys || this.state.keys)
    const { onLoadLanguage } = this.props
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack(this.props.navigation)
  }

  // 改变收藏状态
  onClick = (data, index) => {
    data.checked = !data.checked
    ArrayUtil.updateArray(this.changeValues, data)
    this.state.keys[index] = data//更新state以便显示选中状态
    this.setState({
      keys: this.state.keys
    })
  }

  // 渲染复选框图标
  renderCheckedImage = (checked) => {
    const { theme } = this.params
    return <Ionicons
      name={checked ? 'ios-checkbox' : 'md-square-outline'}
      size={20}
      style={{ color: theme.themeColor }}
    />
  }

  //渲染复选框
  renderCheckBox = (data, index) => {
    return <CheckBox
      style={{ flex: 1, padding: 10 }}
      onClick={() => this.onClick(data, index)}
      isChecked={data.checked}
      leftText={data.name}
      checkedImage={this.renderCheckedImage(true)}
      unCheckedImage={this.renderCheckedImage(false)}
    />
  }

  // 渲染每一行
  renderView = () => {
    let dataArray = this.state.keys
    if (!dataArray || dataArray.length === 0) return
    let length = dataArray.length
    let views = []
    for (let i = 0, l = length; i < l; i += 2) {
      views.push(
        <View key={i}>
          <View style={styles.item}>
            {this.renderCheckBox(dataArray[i], i)}
            {i + 1 < length && this.renderCheckBox(dataArray[i + 1], i + 1)}
          </View>
          <View style={styles.line}/>
        </View>
      )
    }
    return views
  }

  render () {
    const { theme } = this.params
    let title = this.isRemoveKey ? '标签移除' : '自定义标签'
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title
    let rightButtonTitle = this.isRemoveKey ? '移除' : '保存'
    const statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar
      title={title}
      leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />
    return <SafeAreaViewPlus
      style={GlobalStyles.root_container}
      topColor={theme.themeColor}
    >
      {navigationBar}
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </SafeAreaViewPlus>
  }
}

const mapCustomKeyStateToProps = state => ({
  language: state.language
})

const mapCustomKeyDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapCustomKeyStateToProps, mapCustomKeyDispatchToProps)(CustomKeyPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  }
})