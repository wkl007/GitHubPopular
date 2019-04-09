import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  DeviceEventEmitter
} from 'react-native'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../redux/action'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TrendingItem from '../components/TrendingItem'
import NavigationBar from '../components/NavigationBar'
import TrendingDialog, { TimeSpans } from '../components/TrendingDialog'
import NavigationUtil from '../utils/NavigationUtil'
import FavoriteDao from '../utils/cache/FavoriteDao'
import FavoriteUtil from '../utils/FavoriteUtil'
import { FLAG_STORAGE } from '../utils/cache/DataStore'
import { FLAG_LANGUAGE } from '../utils/cache/LanguageDao'
import EventTypes from '../utils/EventTypes'
import ArrayUtil from '../utils/ArrayUtil'

const URL = 'https://github.com/trending/'
const pageSize = 10//设为常量，防止修改
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'//类型更改
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)

class TrendingPage extends Component {
  constructor (props) {
    super(props)
    const { onLoadLanguage } = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_language)
    this.preKeys = []
    this.state = {
      timeSpan: TimeSpans[0]
    }
  }

  // 弹窗分类选择
  onSelectTimeSpan = (tab) => {
    this.dialog.dismiss()
    this.setState({
      timeSpan: tab
    })
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
  }

  // 渲染tabs
  renderTabs = () => {
    const tabs = {}
    const { keys, theme } = this.props
    this.preKeys = keys
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <TrendingTabPage {...props} tabLabel={item.name} timeSpan={this.state.timeSpan}
                                            theme={theme}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    })
    return tabs
  }

  // 渲染顶部导航
  renderTabNav = () => {
    const { theme } = this.props
    if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) {//优化效率：根据需要选择是否重新创建建TabNavigator，通常tab改变后才重新创建
      this.theme = theme
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(
        this.renderTabs(),
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            style: {
              height: 30,//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
              backgroundColor: theme.themeColor,//TabBar背景色
            },
            indicatorStyle: styles.indicatorStyle,//标签指示器的样式
            labelStyle: styles.labelStyle,//文字的样式
            upperCaseLabel: false,//是否使标签大写，默认为true
            scrollEnabled: true,//是否支持 选项卡滚动，默认false
          },
          lazy: true
        }
      ))
    }
    return this.tabNav
  }

  // 渲染标题
  renderTitleView = () => {
    return <View>
      <TouchableOpacity
        underlayColor='transparent'
        onPress={() => this.dialog.show()}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: '400' }}>
            趋势 {this.state.timeSpan.showText}
          </Text>
          <MaterialIcons
            name='arrow-drop-down'
            size={22}
            style={{ color: 'white' }}
          />
        </View>
      </TouchableOpacity>
    </View>
  }

  // 渲染弹窗
  renderTrendingDialog = () => {
    return <TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this.onSelectTimeSpan(tab)}
    />
  }

  render () {
    const { keys, theme } = this.props
    const statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    const navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />
    const TabNavigator = keys.length ? this.renderTabNav() : null
    return <View style={styles.container}>
      {navigationBar}
      {TabNavigator && <TabNavigator/>}
      {this.renderTrendingDialog()}
    </View>
  }
}

const mapTrendingStateToProps = state => ({
  keys: state.language.languages,
  theme: state.theme.theme,
})

const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage)

class TrendingTab extends Component {
  constructor (props) {
    super(props)
    const { tabLabel, timeSpan } = this.props
    this.storeName = tabLabel
    this.timeSpan = timeSpan
    this.isFavoriteChanged = false
  }

  componentDidMount () {
    this.loadData()
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan
      this.loadData()
    })
    EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true
    })
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(false, true)
      }
    })
  }

  componentWillUnmount () {
    this.timeSpanChangeListener && this.timeSpanChangeListener.remove()
    EventBus.getInstance().removeListener(this.favoriteChangeListener)
    EventBus.getInstance().removeListener(this.bottomTabSelectListener)
  }

  //加载数据
  loadData = (loadMore, refreshFavorite) => {
    const { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } = this.props
    const store = this._store()
    const url = this.genFetchUrl(this.storeName)
    if (loadMore) {
      //加载更多
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多了')
      })
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
      this.isFavoriteChanged = false
    } else {
      //首次加载
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
    }
  }

  //获取当前页面有关的数据
  _store = () => {
    const { trending } = this.props
    let store = trending[this.storeName]
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
        hideLoadingMore: true,//默认显示加载更多
      }
    }
    return store
  }

  //拼接url
  genFetchUrl = (key) => {
    return `${URL}${key}?${this.timeSpan.searchText}`
  }

  //渲染每一行
  renderItem = (data) => {
    const { item } = data
    const { theme } = this.props
    return <TrendingItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage(
          {
            theme,
            projectModel: item,
            flag: FLAG_STORAGE.flag_trending,
            callback
          },
          'DetailPage'
        )
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
    />
  }

  //渲染加载更多
  renderIndicator = () => {
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>加载更多</Text>
      </View>
  }

  render () {
    let store = this._store()
    const { theme } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.item.fullName}
          refreshControl={
            <RefreshControl
              title='Loading'
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
            />
          }
          ListFooterComponent={() => this.renderIndicator()}
          onEndReached={() => {
            console.log('---onEndReached----')
            setTimeout(() => {
              if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true)
                this.canLoadMore = false
              }
            }, 100)
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true //fix 初始化时页调用onEndReached的问题
            console.log('---onMomentumScrollBegin-----')
          }}
        />
        <Toast
          ref='toast'
          position='center'
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  trending: state.trending
})

const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
})

const TrendingTabPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendingTab)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabStyle: {
    // minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
    padding: 0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 13,
    margin: 0
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: 'red',
    margin: 10
  },
})
