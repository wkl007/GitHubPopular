import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  FlatList,
  DeviceInfo,
  ActivityIndicator,
  DeviceEventEmitter
} from 'react-native'
import Toast, { DURATION } from 'react-native-easy-toast'
import { ACTION_HOME } from './HomePage'
import GlobalStyles from '../assets/styles/GlobalStyles'
import RepositoryCell from '../common/RepositoryCell'
import BackPressComponent from '../common/BackPressComponent'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import ActionUtils from '../util/ActionUtils'
import NavigatorUtil from '../util/NavigatorUtil'
import makeCancelable from '../util/Cancelable'
import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Utils'
import FavoriteDao from '../expand/dao/FavoriteDao'
import { FLAG_STORAGE } from '../expand/dao/DataRepository'
import ViewUtils from '../util/ViewUtils'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

export default class SearchPage extends Component {
  constructor (props) {
    super(props)
    this.backPress = new BackPressComponent({backPress: (e) => this.onBack(e)})

    this.params = this.props.navigation.state.params
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
    this.favoriteKeys = []
    this.keys = []
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
    this.isKeyChange = false
    this.state = {
      rightButtonText: '搜索',
      isLoading: false,
      showBottomButton: false,
      projectModels: []
    }
  }

  componentDidMount () {
    this.initKeys()
    this.backPress.componentDidMount()
  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()
    if (this.isKeyChange) {
      DeviceEventEmitter.emit('ACTION_HOME', ACTION_HOME.A_RESTART)
    }
    this.cancelable && this.cancelable.cancel()
  }

  /**
   * 处理安卓物理返回键
   * @param e
   * @returns {boolean}
   */
  onBack (e) {
    this.onBackPress()
    return true
  }

  //返回
  onBackPress () {
    //输入框失去焦点，输入法隐藏
    this.refs.input.blur()
    NavigatorUtil.goBack(this.props.navigation)
    return true
  }

  //加载数据
  loadData () {
    this.updateState({
      isLoading: true,
    })
    this.cancelable = makeCancelable(fetch(this.genFetchUrl(this.inputkey)))
    this.cancelable.promise
      .then(response => response.json())
      .then(result => {
        if (!this || !result || !result.items || result.items.length === 0) {
          this.toast.show(`${this.inputkey}暂无结果`, DURATION.LENGTH_LONG)
          this.updateState({isLoading: false, rightButtonText: '搜索'})
          return
        }
        this.items = result.items
        this.getFavoriteKeys()
        if (!this.checkKeyIsExist(this.keys, this.inputkey)) {
          this.updateState({showBottomButton: true})
        }
      }).catch(err => {
      this.updateState({
        isLoading: false,
        rightButtonText: '搜索'
      })
    })
  }

  //搜索url路径
  genFetchUrl (key) {
    return API_URL + key + QUERY_STR
  }

  //添加标签
  saveKey () {
    let key = this.inputkey
    if (this.checkKeyIsExist(this.keys, key)) {
      this.toast.show(`${key}已经存在`, DURATION.LENGTH_LONG)
    } else {
      key = {
        path: key,
        name: key,
        checked: true
      }
      this.keys.unshift(key)
      this.languageDao.save(this.keys)
      this.toast.show(`${key.name}保存成功`, DURATION.LENGTH_LONG)
      this.isKeyChange = true
    }
  }

  //获取所有标签
  async initKeys () {
    this.keys = await this.languageDao.fetch()
  }

  /**
   * 检查key是否存在keys中
   * @param keys
   * @param key
   * @returns {boolean}
   */
  checkKeyIsExist (keys, key) {
    for (let i = 0, len = keys.length; i < len; i++) {
      if (key.toLowerCase() === keys[i].name.toLowerCase()) return true
    }
    return false
  }

  //获取本地用户收藏的projectItem
  getFavoriteKeys () {
    this.favoriteDao.getFavoriteKeys().then((keys) => {
      this.favoriteKeys = keys || []
      this.flushFavoriteState()
    }).catch((err) => {
      this.flushFavoriteState()
      console.log(err)
    })
  }

  //更新ProjectItem的Favorite状态
  flushFavoriteState () {
    let projectModels = []
    let items = this.items
    for (let i = 0, len = items.length; i < len; i++) {
      projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.favoriteKeys)))
    }
    this.updateState({
      isLoading: false,
      projectModels: projectModels,
      rightButtonText: '搜索'
    })
  }

  updateState (dic) {
    this.setState(dic)
  }

  //右侧按钮单击
  onRightButtonClick () {
    if (this.state.rightButtonText === '搜索') {
      this.updateState({rightButtonText: '取消'})
      this.loadData()
    } else {
      this.updateState({rightButtonText: '搜索', isLoading: false})
      this.cancelable && this.cancelable.cancel()
    }
  }

  onUpdateFavorite () {
    this.getFavoriteKeys()
  }

  renderRow (data) {
    const projectModel = data.item
    return <RepositoryCell
      key={projectModel.item.id}
      projectModel={projectModel}
      theme={this.params.theme}
      onSelect={() => ActionUtils.onSelectRepository({
        projectModel: projectModel,
        flag: FLAG_STORAGE.flag_popular,
        onUpdateFavorite: () => this.onUpdateFavorite(),
        ...this.params
      })}
      onFavorite={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item, isFavorite)}
    />
  }

  //导航条
  renderNavBar () {
    let backButton = ViewUtils.getLeftButton(() => {
      this.onBackPress()
    })
    let inputView = <TextInput
      ref='input'
      onChangeText={text => this.inputkey = text}
      style={styles.textInput}
    />
    let rightButton = <TouchableOpacity
      onPress={() => {
        this.refs.input.blur()
        this.onRightButtonClick()
      }}
    >
      <View style={{marginRight: 10}}>
        <Text style={styles.title}>{this.state.rightButtonText}</Text>
      </View>
    </TouchableOpacity>
    return <View style={{
      backgroundColor: this.params.theme.themeColor,
      flexDirection: 'row',
      alignItems: 'center',
      height: (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
    }}>
      {backButton}
      {inputView}
      {rightButton}
    </View>
  }

  render () {
    let statusBar = null
    if (Platform.OS === 'ios' && !DeviceInfo.isIPhoneX_deprecated) {
      statusBar = <View style={[styles.statusBar, {backgroundColor: this.params.theme.themeColor}]}/>
    }
    let flatList = !this.state.isLoading ? <FlatList
      data={this.state.projectModels}
      renderItem={(e) => this.renderRow(e)}
      keyExtractor={item => '' + (item.item.id || item.item.fullName)}
    /> : null
    let indicatorView = this.state.isLoading ?
      <ActivityIndicator
        style={styles.centering}
        size='large'
        animating={this.state.isLoading}
      /> : null
    let resultView = <View style={{flex: 1, paddingBottom: this.state.showBottomButton ? 50 : 0}}>
      {indicatorView}
      {flatList}
    </View>
    let bottomButton = this.state.showBottomButton ?
      <TouchableOpacity
        style={[styles.bottomButton, {backgroundColor: this.params.theme.themeColor}]}
        onPress={() => {
          this.saveKey()
        }}
      >
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.title}>添加标签</Text>
        </View>
      </TouchableOpacity> : null
    return <SafeAreaViewPlus
      topColor={this.params.theme.themeColor}
      style={GlobalStyles.root_container}
    >
      {statusBar}
      {this.renderNavBar()}
      {resultView}
      {bottomButton}
      <Toast ref={toast => this.toast = toast}/>
    </SafeAreaViewPlus>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  statusBar: {
    height: 20,
  },
  textInput: {
    flex: 1,
    height: (Platform.OS === 'ios') ? 30 : 40,
    borderWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderColor: '#fff',
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: '#fff'
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: GlobalStyles.window_height - 45 - (DeviceInfo.isIPhoneX_deprecated ? 34 : 0) - (Platform.OS === 'ios' ? 0 : 25),
    right: 10,
    borderRadius: 3
  }
})
