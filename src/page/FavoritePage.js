import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar'
//两种cell
import RepositoryCell from '../common/RepositoryCell'
import TrendingCell from '../common/TrendingCell'
import MoreMenu, { MORE_MENU } from '../common/MoreMenu'
import CustomTheme from './my/CustomTheme'
import BaseComponent from './BaseComponent'
//flag
import { FLAG_STORAGE } from '../expand/dao/DataRepository'
//获取AsyncStorage中的数据
import FavoriteDao from '../expand/dao/FavoriteDao'
//构造函数
import ProjectModel from '../model/ProjectModel'
import ArrayUtils from '../util/ArrayUtils'
import ActionUtils from '../util/ActionUtils'
import ViewUtils from '../util/ViewUtils'
import { FLAG_TAB } from './HomePage'

export default class FavoritePage extends BaseComponent {
  constructor (props) {
    super(props)
    this.state = {
      theme: this.props.theme,
      customThemeViewVisible: false,
    }
  }

  //更多菜单
  renderMoreView () {
    let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab}
    return <MoreMenu
      ref='moreMenu'
      {...params}
      menus={[MORE_MENU.Custom_Theme, MORE_MENU.Share,
        MORE_MENU.About_Author, MORE_MENU.About]}
      anchorView={() => this.refs.moreMenuButton}
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

  render () {
    let statusBar = {
      backgroundColor: this.state.theme.themeColor,
    }
    let navigationBar = <NavigationBar
      title='收藏'
      statusBar={statusBar}
      style={this.state.theme.styles.navBar}
      rightButton={ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
    />
    let content =
      <ScrollableTabView
        tabBarBackgroundColor={this.state.theme.themeColor}
        tabBarActiveTextColor='#fff'
        tabBarInactiveTextColor='mintcream'
        tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
        renderTabBar={() => <ScrollableTabBar/>}
      >
        <FavoriteTab {...this.props} tabLabel='最热' flag={FLAG_STORAGE.flag_popular}/>
        <FavoriteTab {...this.props} tabLabel='趋势' flag={FLAG_STORAGE.flag_trending}/>
      </ScrollableTabView>
    return (
      <View style={styles.container}>
        {navigationBar}
        {content}
        {this.renderMoreView()}
        {this.renderCustomThemeView()}
      </View>
    )
  }
}

class FavoriteTab extends Component {
  constructor (props) {
    super(props)
    this.unFavoriteItems = []//取消收藏的项目
    this.favoriteDao = new FavoriteDao(this.props.flag)
    this.state = {
      projectModels: [],
      isLoading: false,
      theme: this.props.theme
    }
  }

  componentDidMount () {
    this.loadData(true)
  }

  componentWillReceiveProps (nextProps) {
    this.loadData(false)
  }

  //加载数据
  loadData (isShowLoading) {
    if (isShowLoading) {
      this.setState({
        isLoading: true
      })
    }
    this.favoriteDao.getAllItems().then((items) => {
      let resultData = []
      for (let i = 0, len = items.length; i < len; i++) {
        resultData.push(new ProjectModel(items[i], true))
      }
      this.setState({
        isLoading: false,
        projectModels: resultData,
      })
    }).catch((error) => {
      this.setState({
        isLoading: false
      })
    })
  }

  onRefresh () {
    this.loadData(true)
  }

  updateState (dic) {
    if (!this) return
    this.setState(dic)
  }

  onUpdateFavorite () {
    this.loadData(false)
    if (this.props.flag === FLAG_STORAGE.flag_popular) {
      DeviceEventEmitter.emit('favoriteChanged_popular')
    } else {
      DeviceEventEmitter.emit('favoriteChanged_trending')
    }
  }

  onSelect (projectModel) {
    this.props.navigation.navigate('RepositoryDetail', {
      projectModel: projectModel,
      flag: this.props.flag,
      onUpdateFavorite: () => this.onUpdateFavorite(),
    })
  }

  //处理收藏事件
  onFavorite (item, isFavorite) {
    let key = this.props.flag === FLAG_STORAGE.flag_popular ? item.id.toString() : item.fullName
    if (isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item))
    } else {
      this.favoriteDao.removeFavoriteItem(key)
    }
    ArrayUtils.updateArray(this.unFavoriteItems, item)
    if (this.unFavoriteItems.length > 0) {
      if (this.props.flag === FLAG_STORAGE.flag_popular) {
        DeviceEventEmitter.emit('favoriteChanged_popular')
      } else {
        DeviceEventEmitter.emit('favoriteChanged_trending')
      }
    }
  }

  renderRow (data) {
    const projectModel = data.item
    let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell
    return (
      <CellComponent
        theme={this.props.theme}
        key={this.props.flag === FLAG_STORAGE.flag_popular ? projectModel.item.id : projectModel.item.fullName}
        onSelect={() => ActionUtils.onSelectRepository({
          projectModel: projectModel,
          flag: this.props.flag,
          onUpdateFavorite: () => this.onUpdateFavorite(),
          ...this.props
        })}
        onFavorite={(item, isFavorite) => {
          this.onFavorite(item, isFavorite)
        }}
        isFavorite={true}
        projectModel={projectModel}/>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <FlatList
          ref='listView'
          style={styles.listView}
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
    flex: 1,
    alignItems: 'stretch',
  },
  listView: {
    // marginTop: Platform.OS === "ios" ? 0 : 0,
  },
})