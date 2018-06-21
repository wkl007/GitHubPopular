import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ListView,
  RefreshControl,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar'
import RepositoryCell from '../common/RepositoryCell'
import MoreMenu, { MORE_MENU } from '../common/MoreMenu'
import CustomTheme from './my/CustomTheme'
import BaseComponent from './BaseComponent'
import DataRepository, { FLAG_STORAGE } from '../expand/dao/DataRepository'
//获取AsyncStorage中的数据
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ProjectModel from '../model/ProjectModel'
//工具函数，检查该Item是否被收藏
import Utils from '../util/Utils'
import ActionUtils from '../util/ActionUtils'
import ViewUtils from '../util/ViewUtils'
import { FLAG_TAB } from './HomePage'
//接口路径
const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'

let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)

export default class PopularPage extends BaseComponent {
  constructor (props) {
    super(props)
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key)
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular)
    this.state = {
      dataArray: [],
      theme: this.props.theme,
      customThemeViewVisible: false,
    }
  }

  componentDidMount () {
    super.componentDidMount()
    this.loadData()
  }

  componentWillUnmount () {
    super.componentWillUnmount()
  }

  loadData () {
    this.languageDao.fetch()
      .then(result => {
        this.setState({
          dataArray: result
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  //导航右侧按钮
  renderRightButton () {
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('SearchPage', {theme: this.state.theme})
        }}
      >
        <View style={{padding: 5, marginRight: 8}}>
          <Image
            style={{width: 24, height: 24}}
            source={require('../assets/images/ic_search_white_48pt.png')}
          />
        </View>
      </TouchableOpacity>
      {ViewUtils.getMoreButton(() => this.refs.moreMenu.open())}
    </View>
  }

  //更多菜单
  renderMoreView () {
    let params = {...this.props, fromPage: FLAG_TAB.flag_popularTab}
    return <MoreMenu
      ref='moreMenu'
      {...params}
      menus={[MORE_MENU.Custom_Key, MORE_MENU.Sort_Key, MORE_MENU.Remove_Key, MORE_MENU.Share, MORE_MENU.Custom_Theme, MORE_MENU.About_Author, MORE_MENU.About]}
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
      title='最热'
      statusBar={statusBar}
      style={this.state.theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />
    let content = this.state.dataArray.length > 0 ? <ScrollableTabView
      tabBarBackgroundColor={this.state.theme.themeColor}
      tabBarActiveTextColor='#fff'
      tabBarInactiveTextColor='mintcream'
      tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
      initialPage={0}
      renderTabBar={() => <ScrollableTabBar style={{height: 40, borderWidth: 0, elevation: 2}}
                                            tabStyle={{height: 39}}/>}
    >
      {this.state.dataArray.map((result, i, arr) => {
        let item = arr[i]
        return item.checked ? <PopularTab {...this.props} key={i} tabLabel={item.name}/> : null
      })}
    </ScrollableTabView> : null
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

class PopularTab extends Component {
  constructor (props) {
    super(props)
    this.isFavoriteChanged = false
    this.dataRepository = new DataRepository()
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false,
      favoriteKeys: [],//收藏的列表
      theme: this.props.theme,
    }
  }

  componentDidMount () {
    this.listener = DeviceEventEmitter.addListener('favoriteChanged_popular', () => {
      this.isFavoriteChanged = true
    })
    this.loadData()
  }

  componentWillUnmount () {
    if (this.listener) {
      this.listener.remove()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.isFavoriteChanged) {
      this.isFavoriteChanged = false
      this.getFavoriteKeys()
    } else if (nextProps.theme !== this.state.theme) {
      this.updateState({theme: nextProps.theme})
      this.flushFavoriteState()
    }
  }

  //加载数据
  loadData () {
    this.setState({
      isLoading: true
    })
    let url = URL + this.props.tabLabel + QUERY_STR
    this.dataRepository.fetchRepository(url)
      .then(result => {
        this.items = result && result.items ? result.items : result ? result : []
        this.getFavoriteKeys()
        if (result && result.update_date && !Utils.checkDate(result.update_date)) {

          return this.dataRepository.fetchNetRepository(url)
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

  //更新project每一项收藏的状态
  flushFavoriteState () {
    let projectModels = []
    let items = this.items
    for (let i = 0, len = items.length; i < len; i++) {
      projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)))
    }
    this.updateState({
      isLoading: false,
      dataSource: this.getDataSource(projectModels),
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

  getDataSource (items) {
    return this.state.dataSource.cloneWithRows(items)
  }

  updateState (dic) {
    if (!this) return
    this.setState(dic)
  }

  //更新favorite
  onUpdateFavorite () {
    this.getFavoriteKeys()
  }

  onSelect (projectModel) {
    this.props.navigation.navigate('RepositoryDetail', {
      projectModel: projectModel,
      flag: FLAG_STORAGE.flag_popular,
      onUpdateFavorite: () => this.onUpdateFavorite(),
    })
  }

  //处理收藏事件
  onFavorite (item, isFavorite) {
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item))
    } else {
      favoriteDao.removeFavoriteItem(item.id.toString())
    }
  }

  renderRow (projectModel) {
    return <RepositoryCell
      key={projectModel.item.id}
      projectModel={projectModel}
      theme={this.props.theme}
      onSelect={() => ActionUtils.onSelectRepository({
        projectModel: projectModel,
        flag: FLAG_STORAGE.flag_popular,
        onUpdateFavorite: () => this.onUpdateFavorite(),
        ...this.props
      })}
      onFavorite={(item, isFavorite) => ActionUtils.onFavorite(favoriteDao, item, isFavorite)}
    />
  }

  render () {
    return (
      <View style={styles.container}>
        {/*<FlatList
          data={this.state.result}
          refreshing={this.state.isLoading}
          onRefresh={() => {
            this.loadData()
          }}
          colors:{['#2196f3']}
          tintColor={'#2196f3'}
          title='Loading...'
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => this.renderRow(item)}
        />*/}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(data) => this.renderRow(data)}
          refreshControl={
            <RefreshControl
              title='Loading...'
              titleColor={this.props.theme.themeColor}
              colors={[this.props.theme.themeColor]}
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData()}
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