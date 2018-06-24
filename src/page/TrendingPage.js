import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar'
import TrendingCell from '../common/TrendingCell'
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import MoreMenu, { MORE_MENU } from '../common/MoreMenu'
import CustomTheme from './my/CustomTheme'
import BaseComponent from './BaseComponent'
import DataRepository, { FLAG_STORAGE } from '../expand/dao/DataRepository'
//获取AsyncStorage中的数据
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import ProjectModel from '../model/ProjectModel'
//工具函数，检查该Item是否被收藏
import Utils from '../util/Utils'
import ActionUtils from '../util/ActionUtils'
import FavoriteDao from '../expand/dao/FavoriteDao'
import { FLAG_TAB } from './HomePage'
import ViewUtils from '../util/ViewUtils'
//接口路径
const API_URL = 'https://github.com/trending/'
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)
let dataRepository = new DataRepository(FLAG_STORAGE.flag_trending)
export default class TrendingPage extends BaseComponent {
  constructor (props) {
    super(props)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language)
    this.state = {
      languages: [],//数据
      isVisible: false,
      timeSpan: TimeSpans[0],
      theme: this.props.theme,
      customThemeViewVisible: false,
    }
    this.loadData()
  }

  /*  componentDidMount () {
      super.componentDidMount()

    }

    componentWillUnmount () {
      super.componentWillUnmount()
    }*/

  loadData () {
    this.languageDao.fetch()
      .then(result => {
        this.setState({
          languages: result
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  //显示下拉框
  showPopover () {
    this.dialog.show()
  }

  //关闭下拉框
  closePopover () {
    this.dialog.dismiss()
  }

  //选择某一项
  onSelectTimeSpan (timeSpan) {
    this.closePopover()
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, this.state.timeSpan, timeSpan)
    this.setState({
      timeSpan: timeSpan
    })
  }

  //更多菜单
  renderMoreView () {
    let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab}
    return <MoreMenu
      ref='moreMenu'
      {...params}
      menus={[MORE_MENU.Custom_Language, MORE_MENU.Sort_Language, MORE_MENU.Share, MORE_MENU.Custom_Theme, MORE_MENU.About_Author, MORE_MENU.About]}
      onMoreMenuSelect={(e) => {
        if (e === MORE_MENU.Custom_Theme) {
          this.setState({
            customThemeViewVisible: true
          })
        }
      }}
    />
  }

  //主题view
  renderCustomThemeView () {
    return (
      <CustomTheme
        visible={this.state.customThemeViewVisible}
        {...this.props}
        onClose={() => this.setState({customThemeViewVisible: false})}
      />
    )
  }

  //渲染标题
  renderTitleView () {
    return (
      <View>
        <TouchableOpacity ref='button' onPress={() => {
          this.showPopover()
        }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{fontSize: 18, color: '#fff', fontWeight: '400'}}
            >趋势{this.state.timeSpan.showText}</Text>
            <Image style={{width: 12, height: 12, marginLeft: 5}}
                   source={require('../assets/images/ic_spinner_triangle.png')}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  //标题弹框
  renderTrendingDialog () {
    return (
      <TrendingDialog
        ref={dialog => this.dialog = dialog}
        onSelect={(tab) => this.onSelectTimeSpan(tab)}
      />
    )
  }

  render () {
    let statusBar = {
      backgroundColor: this.state.theme.themeColor,
    }
    let navigationBar =
      <NavigationBar
        titleView={this.renderTitleView()}
        statusBar={statusBar}
        style={this.state.theme.styles.navBar}
        rightButton={ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
      />
    let content = this.state.languages.length > 0 ? <ScrollableTabView
      tabBarBackgroundColor={this.state.theme.themeColor}
      tabBarActiveTextColor='#fff'
      tabBarInactiveTextColor='mintcream'
      tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
      renderTabBar={() => <ScrollableTabBar/>}
    >
      {this.state.languages.map((result, i, arr) => {
        let item = arr[i]
        return item.checked ?
          <TrendingTab {...this.props} key={i} tabLabel={item.name} timeSpan={this.state.timeSpan}/> : null
      })}
    </ScrollableTabView> : null
    return (
      <View style={styles.container}>
        {navigationBar}
        {content}
        {this.renderMoreView()}
        {this.renderCustomThemeView()}
        {this.renderTrendingDialog()}
      </View>
    )
  }
}

class TrendingTab extends BaseComponent {
  constructor (props) {
    super(props)
    this.isFavoriteChanged = false
    this.state = {
      projectModels: [],
      isLoading: false,
      favoriteKeys: [],//收藏的列表
      theme: this.props.theme,
    }
  }

  componentDidMount () {
    super.componentDidMount()
    this.listener = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
      this.isFavoriteChanged = true
    })
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (from, to) => {
      this.loadData(to)
    })
    this.loadData(this.props.timeSpan)
  }

  componentWillUnmount () {
    super.componentWillUnmount()
    if (this.listener) {
      this.listener.remove()
    }
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove()
    }
  }

  onTabSelected (from, to) {
    console.log(from, to)
    if (to === FLAG_TAB.flag_trendingTab && this.isFavoriteChanged) {
      this.isFavoriteChanged = false
      this.getFavoriteKeys()
    }
  }

  /*componentWillReceiveProps (nextProps) {
    if (nextProps.timeSpan !== this.props.timeSpan) {
      this.loadData(nextProps.timeSpan)
    } else if (this.isFavoriteChanged) {
      this.isFavoriteChanged = false
      this.getFavoriteKeys()
    } else if (nextProps.theme !== this.state.theme) {
      this.updateState({theme: nextProps.theme})
      this.flushFavoriteState()
    }
  }*/

  //更新project每一项收藏的状态
  flushFavoriteState () {
    let projectModels = []
    let items = this.items
    for (let i = 0, len = items.length; i < len; i++) {
      projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)))
    }
    this.updateState({
      isLoading: false,
      projectModels: projectModels,
    })
  }

  //获取本地用户收藏的ProjectItem
  getFavoriteKeys () {
    favoriteDao.getFavoriteKeys().then((keys) => {
      if (keys) {
        this.updateState({favoriteKeys: keys})
      }
      this.flushFavoriteState()
    }).catch((error) => {
      this.flushFavoriteState()
      console.log(error)
    })
  }

  //加载数据
  loadData (timeSpan, isRefresh) {
    this.updateState({
      isLoading: true
    })
    let url = this.genFetchUrl(timeSpan, this.props.tabLabel)
    dataRepository.fetchRepository(url)
      .then(result => {
        this.items = result && result.items ? result.items : result ? result : []
        this.getFavoriteKeys()
        if (!this.items || isRefresh && result && result.update_date && !Utils.checkDate(result.update_date)) {
          DeviceEventEmitter.emit('showToast', '数据过时')
          return dataRepository.fetchNetRepository(url)
        } else {
          DeviceEventEmitter.emit('showToast', '显示缓存数据')
        }
      })
      .then((items) => {
        if (!items || items.length === 0) return
        this.items = items
        this.getFavoriteKeys()
      })
      .catch(err => {
        console.log(err)
        this.updateState({
          isLoading: false
        })
      })
  }

  genFetchUrl (timeSpan, category) {
    return API_URL + category + '?' + timeSpan.searchText
  }

  //重新加载数据
  onRefresh () {
    this.loadData(this.props.timeSpan, true)
  }

  //重新加载data
  updateState (dic) {
    if (!this) return
    this.setState(dic)
  }

  //更新favorite
  onUpdateFavorite () {
    this.getFavoriteKeys()
  }

  //处理收藏事件
  onFavorite (item, isFavorite) {
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(item.fullName.toString(), JSON.stringify(item))
    } else {
      favoriteDao.removeFavoriteItem(item.fullName.toString())
    }
  }

  renderRow (data) {
    const projectModel = data.item
    return <TrendingCell
      key={projectModel.item.id}
      projectModel={projectModel}
      theme={this.state.theme}
      onSelect={() => ActionUtils.onSelectRepository({
        projectModel: projectModel,
        flag: FLAG_STORAGE.flag_trending,
        onUpdateFavorite: () => this.onUpdateFavorite(),
        ...this.props
      })}
      onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
    />
  }

  render () {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.projectModels}
          renderItem={(data) => this.renderRow(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title='Loading...'
              titleColor={this.props.theme.themeColor}
              colors={[this.props.theme.themeColor]}
              refreshing={this.state.isLoading}
              onRefresh={() => this.onRefresh()}
              tintColor={this.props.theme.themeColor}
            />
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tips: {
    fontSize: 29
  }
})