import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
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
import { FLAG_STOREGE } from '../utils/cache/DataStore'
import EventTypes from '../utils/EventTypes'

const URL = 'https://github.com/trending/'
const THEME_COLOR = '#678'
const pageSize = 10//设为常量，防止修改
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'//类型更改
const favoriteDao = new FavoriteDao(FLAG_STOREGE.flag_trending)

export default class TrendingPage extends Component {
  constructor (props) {
    super(props)
    this.tabNames = ['All', 'C', 'C#', 'PHP', 'JavaScript']
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
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} tabLabel={item} timeSpan={this.state.timeSpan}/>,
        navigationOptions: {
          title: item
        }
      }
    })
    return tabs
  }

  // 渲染顶部导航
  renderTabNav = () => {
    if (!this.tabNav) {//优化效率：根据需要选择是否重新创建建TabNavigator，通常tab改变后才重新创建
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(
        this.renderTabs(),
        {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            style: {
              height: 30,//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
              backgroundColor: '#678',//TabBar背景色
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
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{ backgroundColor: THEME_COLOR }}
    />
    const TabNavigator = this.tabNames.length ? this.renderTabNav() : null
    return <View style={styles.container}>
      {navigationBar}
      {TabNavigator && <TabNavigator/>}
      {this.renderTrendingDialog()}
    </View>
  }
}

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
    return <TrendingItem
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage(
          {
            projectModel: item,
            flag: FLAG_STOREGE.flag_trending,
            callback
          },
          'DetailPage'
        )
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STOREGE.flag_trending)}
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
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.id || item.fullName)}
          refreshControl={
            <RefreshControl
              title='Loading'
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
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
