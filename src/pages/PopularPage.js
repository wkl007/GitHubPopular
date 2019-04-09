import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../redux/action'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PopularItem from '../components/PopularItem'
import NavigationBar from '../components/NavigationBar'
import NavigationUtil from '../utils/NavigationUtil'
import FavoriteDao from '../utils/cache/FavoriteDao'
import FavoriteUtil from '../utils/FavoriteUtil'
import { FLAG_STORAGE } from '../utils/cache/DataStore'
import { FLAG_LANGUAGE } from '../utils/cache/LanguageDao'
import EventTypes from '../utils/EventTypes'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const pageSize = 10//设为常量，防止修改
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

class PopularPage extends Component {
  constructor (props) {
    super(props)
    const { onLoadLanguage } = this.props
    onLoadLanguage(FLAG_LANGUAGE.flag_key)
  }

  // 渲染tabs
  renderTabs = () => {
    const tabs = {}
    const { keys, theme } = this.props
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    })
    return tabs
  }

  // 渲染右侧按钮
  renderRightButton = () => {
    const { theme } = this.props
    return <TouchableOpacity
      onPress={() => {
        NavigationUtil.goPage({ theme }, 'SearchPage')
      }}
    >
      <View style={{ padding: 5, marginRight: 8 }}>
        <Ionicons
          name={'ios-search'}
          size={24}
          style={{
            marginRight: 8,
            alignSelf: 'center',
            color: 'white',
          }}/>
      </View>
    </TouchableOpacity>
  }

  render () {
    const { keys, theme } = this.props
    const statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    const navigationBar = <NavigationBar
      title='最热'
      rightButton={this.renderRightButton()}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />
    const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
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
    )) : null
    return <View style={styles.container}>
      {navigationBar}
      {TabNavigator && <TabNavigator/>}
    </View>
  }
}

const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  theme: state.theme.theme,
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage)

class PopularTab extends Component {
  constructor (props) {
    super(props)
    const { tabLabel } = this.props
    this.storeName = tabLabel
    this.isFavoriteChanged = false
  }

  componentDidMount () {
    this.loadData()
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true
    })
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(false, true)
      }
    })
  }

  componentWillUnmount () {
    EventBus.getInstance().removeListener(this.favoriteChangeListener)
    EventBus.getInstance().removeListener(this.bottomTabSelectListener)
  }

  //加载数据
  loadData = (loadMore, refreshFavorite) => {
    const { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props
    const store = this._store()
    const url = this.genFetchUrl(this.storeName)
    if (loadMore) {
      //加载更多
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多了')
      })
    } else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
      this.isFavoriteChanged = false
    } else {
      //首次加载
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
    }
  }

  //获取当前页面有关的数据
  _store = () => {
    const { popular } = this.props
    let store = popular[this.storeName]
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
    return URL + key + QUERY_STR
  }

  //渲染每一行
  renderItem = (data) => {
    const { item } = data
    const { theme } = this.props
    return <PopularItem
      projectModel={item}
      theme={theme}
      onSelect={(callback) => {
        NavigationUtil.goPage(
          {
            theme,
            projectModel: item,
            flag: FLAG_STORAGE.flag_popular,
            callback
          },
          'DetailPage'
        )
      }}
      onFavorite={(item, isFavorite) => {
        FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)
      }}
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
          keyExtractor={item => '' + item.item.id}
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
  popular: state.popular,
})

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
})

const PopularTabPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PopularTab)

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
