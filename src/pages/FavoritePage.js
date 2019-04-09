import React, { Component } from 'react'
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../redux/action'
import Toast from 'react-native-easy-toast'
import EventBus from 'react-native-event-bus'
import PopularItem from '../components/PopularItem'
import TrendingItem from '../components/TrendingItem'
import NavigationBar from '../components/NavigationBar'
import NavigationUtil from '../utils/NavigationUtil'
import FavoriteDao from '../utils/cache/FavoriteDao'
import FavoriteUtil from '../utils/FavoriteUtil'
import { FLAG_STORAGE } from '../utils/cache/DataStore'
import EventTypes from '../utils/EventTypes'

class FavoritePage extends Component {
  render () {
    const { theme } = this.props
    const statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    const navigationBar = <NavigationBar
      title='收藏'
      statusBar={statusBar}
      style={theme.styles.navBar}
    />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      {
        'Popular': {
          screen: props => <FavoriteTabPage  {...props} flag={FLAG_STORAGE.flag_popular} theme={theme}/>,
          navigationOptions: {
            title: '最热'
          }
        },
        'Trending': {
          screen: props => <FavoriteTabPage  {...props} flag={FLAG_STORAGE.flag_trending} theme={theme}/>,
          navigationOptions: {
            title: '趋势'
          }
        }
      },
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
        },
        lazy: true
      }
    ))
    return <View style={styles.container}>
      {navigationBar}
      {TabNavigator && <TabNavigator/>}
    </View>
  }
}

const mapFavoriteStateToProps = state => ({
  theme: state.theme.theme,
})

export default connect(mapFavoriteStateToProps)(FavoritePage)

class FavoriteTab extends Component {
  constructor (props) {
    super(props)
    const { flag } = this.props
    this.storeName = flag
    this.favoriteDao = new FavoriteDao(flag)
  }

  componentDidMount () {
    this.loadData(true)
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      //收藏 tab 2
      if (data.to === 2) {
        this.loadData(false)
      }
    })
  }

  componentWillUnmount () {
    EventBus.getInstance().removeListener(this.listener)
  }

  //加载数据
  loadData = (isShowLoading) => {
    const { onLoadFavoriteData } = this.props
    onLoadFavoriteData(this.storeName, isShowLoading)
  }

  //获取当前页面有关的数据
  _store = () => {
    const { favorite } = this.props
    let store = favorite[this.storeName]
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
      }
    }
    return store
  }

  //收藏非收藏
  onFavorite = (item, isFavorite) => {
    const { flag } = this.props
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, flag)
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular)
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending)
    }
  }

  //渲染每一行
  renderItem = (data) => {
    const { theme } = this.props
    const { item } = data
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
    return <Item
      theme={theme}
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage(
          {
            theme,
            projectModel: item,
            flag: this.storeName,
            callback
          },
          'DetailPage'
        )
      }}
      onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
    />
  }

  render () {
    let store = this._store()
    const { theme } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => '' + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title='Loading'
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={theme.themeColor}
            />
          }
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
  favorite: state.favorite
})

const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (flag, isShowLoading) => dispatch(actions.onLoadFavoriteData(flag, isShowLoading)),
})

const FavoriteTabPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoriteTab)

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
