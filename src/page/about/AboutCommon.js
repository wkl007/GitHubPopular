import React from 'react'
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import ActionUtils from '../../util/ActionUtils'
import { FLAG_STORAGE } from '../../expand/dao/DataRepository'
import ViewUtils from '../../util/ViewUtils'
import Utils from '../../util/Utils'
import RepositoryUtils from '../../expand/dao/RepositoryUtils'
import RepositoryCell from '../../common/RepositoryCell'
import BackPressComponent from '../../common/BackPressComponent'

export let FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'}

export default class AboutCommon {
  constructor (props, updateState, flag_about, config) {
    this.props = props
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})

    const {params} = this.props.navigation.state
    this.theme = params.theme
    this.updateState = updateState
    this.flag_about = flag_about
    this.config = config
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)
    this.repositories = []
    this.repositoryUtils = new RepositoryUtils(this)
    this.favoriteKeys = null
  }

  componentDidMount () {
    this.backPress.componentDidMount()
    /*if (this.flag_about === FLAG_ABOUT.flag_about) {
      this.repositoryUtils.fetchRepository(this.config.info.currentRepoUrl);
    } else {
      let urls = [];
      let items = this.config.items;
      for (let i = 0, len = items.length; i < len; i++) {
        urls.push(this.config.info.url + items[i]);
      }
      this.repositoryUtils.fetchRepositories(urls)
    }*/
  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()
  }

  /**
   * 处理安卓物理返回键
   * @param e
   * @returns {boolean}
   */
  onBackPress (e) {
    this.props.navigation.goBack()
    return true
  }

  /**
   * 通知数据发生改变
   * @param items 改变的数据
   */
  onNotifyDataChanged (items) {
    this.updateFavorite(items)
  }

  async updateFavorite (repositories) {
    if (repositories) this.repositories = repositories
    if (!this.repositories) return
    if (!this.favoriteKeys) {
      this.favoriteKeys = await this.favoriteDao.getFavoriteKeys()
    }
    let projectModels = []
    for (let i = 0, len = this.repositories.length; i < len; i++) {
      let data = this.repositories[i]
      let item = data.item ? data.item : data
      projectModels.push({
        isFavorite: Utils.checkFavorite(item, this.favoriteKeys ? this.favoriteKeys : []),
        item: item,
      })
    }
    this.updateState({
      projectModels: projectModels
    })
  }

  //更新favorite
  onUpdateFavorite () {
    this.componentDidMount()
  }

  onSelect (projectModel) {
    this.props.navigation.navigate('RepositoryDetail', {
      projectModel: projectModel,
      flag: FLAG_STORAGE.flag_popular,
      onUpdateFavorite: () => this.onUpdateFavorite(),
    })
  }

  /**
   * 创建项目视图
   * @param projectModels
   * @returns {null}
   */
  renderRepository (projectModels) {
    if (!projectModels || projectModels.length === 0) return null
    let views = []
    for (let i = 0, len = projectModels.length; i < len; i++) {
      let projectModel = projectModels[i]
      views.push(
        <RepositoryCell
          key={projectModel.item.id}
          projectModel={projectModel}
          theme={this.theme}
          onSelect={() => ActionUtils.onSelectRepository({
            projectModel: projectModel,
            ...this.props,
            flag: FLAG_STORAGE.flag_popular
          })}
          onFavorite={(item, isFavorite) => ActionUtils.onFavorite(this.favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
        />
      )
    }
    return views
  }

  getParallaxRenderConfig (params) {
    let config = {}
    config.renderBackground = () => (
      <View key="background">
        <Image source={{
          uri: params.backgroundImg,
          width: window.width,
          height: PARALLAX_HEADER_HEIGHT
        }}/>
        <View style={{
          position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: PARALLAX_HEADER_HEIGHT
        }}/>
      </View>
    )
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar} source={{
          uri: params.avatar,
          width: AVATAR_SIZE,
          height: AVATAR_SIZE
        }}/>
        <Text style={styles.sectionSpeakerText}>
          {params.name}
        </Text>
        <Text style={styles.sectionTitleText}>
          {params.description}
        </Text>
      </View>
    )
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    )
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtils.getLeftButton(() => {
          this.props.navigation.goBack()
        })}
      </View>
    )
    return config
  }

  render (contentView, params) {
    let renderConfig = this.getParallaxRenderConfig(params)
    return (
      <ParallaxScrollView
        headerBackgroundColor="#333"
        backgroundColor={this.theme.themeColor}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        {...renderConfig}
      >
        {contentView}
      </ParallaxScrollView>
    )
  }
}

const window = Dimensions.get('window')
const AVATAR_SIZE = 120
const ROW_HEIGHT = 60
const PARALLAX_HEADER_HEIGHT = 350
const STICKY_HEADER_HEIGHT = 70

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: (Platform.OS == 'ios') ? 20 : 0,
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: (Platform.OS == 'ios') ? 20 : 0,
    justifyContent: 'space-between'
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 5
  },
  row: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    height: ROW_HEIGHT,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  rowText: {
    fontSize: 20
  }
})
