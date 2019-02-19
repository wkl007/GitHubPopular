import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../redux/action'
import Toast from 'react-native-easy-toast'
import PopularItem from '../components/PopularItem'
import NavigationBar from '../components/NavigationBar'
import NavigationUtils from '../utils/NavigationUtils'
import FavoriteDao from '../utils/cache/FavoriteDao'
import { FLAG_STOREGE } from '../utils/cache/DataStore'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = '#678'
const pageSize = 10//设为常量，防止修改
const favoriteDao = new FavoriteDao(FLAG_STOREGE.flag_popular)

export default class PopularPage extends Component {
  constructor (props) {
    super(props)
    this.tabNames = ['iOS', 'Java', 'Android', 'React', 'React Native']
  }

  // 渲染tabs
  renderTabs = () => {
    const tabs = {}
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item}/>,
        navigationOptions: {
          title: item
        }
      }
    })
    return tabs
  }

  render () {
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar = <NavigationBar
      title='最热'
      statusBar={statusBar}
      style={{ backgroundColor: THEME_COLOR }}
    />
    const TabNavigator = this.tabNames.length ? createAppContainer(createMaterialTopTabNavigator(
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
    )) : null
    return <View style={styles.container}>
      {navigationBar}
      {TabNavigator && <TabNavigator/>}
    </View>
  }
}

class PopularTab extends Component {
  constructor (props) {
    super(props)
    const { tabLabel } = this.props
    this.storeName = tabLabel
  }

  componentDidMount () {
    this.loadData()
  }

  //加载数据
  loadData = (loadMore) => {
    const { onRefreshPopular, onLoadMorePopular } = this.props
    const store = this._store()
    const url = this.genFetchUrl(this.storeName)
    if (loadMore) {
      //加载更多
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多了')
      })
    } else {
      //首次加载
      onRefreshPopular(this.storeName, url, pageSize)
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
    return <PopularItem
      projectModel={item}
      onSelect={() => {
        NavigationUtils.goPage(
          {
            projectModel: item,
          },
          'DetailPage'
        )
      }}
      onFavorite={(item,isFavorite) => {
        
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
    console.log(store.projectModels)
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + item.id}
          refreshControl={
            <RefreshControl
              title='Loading'
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={this.loadData}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={this.renderIndicator}
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
  popular: state.popular
})

const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack))
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
