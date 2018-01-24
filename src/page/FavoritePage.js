import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ListView,
  RefreshControl,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import NavigationBar from '../common/NavigationBar'
//两种cell
import RepositoryCell from '../common/RepositoryCell'
import TrendingCell from '../common/TrendingCell'
//flag
import {FLAG_STORAGE} from '../expand/dao/DataRepository'
//获取AsyncStorage中的数据
import FavoriteDao from '../expand/dao/FavoriteDao'
//构造函数
import ProjectModel from "../model/ProjectModel";
import ArrayUtils from '../util/ArrayUtils'
import ActionUtils from '../util/ActionUtils'

export default class FavoritePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    let content =
      <ScrollableTabView
        tabBarBackgroundColor='#2196F3'
        tabBarActiveTextColor='#fff'
        tabBarInactiveTextColor='mintcream'
        tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
        renderTabBar={() => <ScrollableTabBar/>}
      >
        <FavoriteTab {...this.props} tabLabel='最热' flag={FLAG_STORAGE.flag_popular}/>
        <FavoriteTab {...this.props} tabLabel='趋势' flag={FLAG_STORAGE.flag_trending}/>
      </ScrollableTabView>;
    return (
      <View style={styles.container}>
        <NavigationBar
          title='收藏'
          statusBar={{
            backgroundColor: '#2196F3'
          }}
        />
        {content}
      </View>
    )
  }
}

class FavoriteTab extends Component {
  constructor(props) {
    super(props);
    this.unFavoriteItems = [];//取消收藏的项目
    this.favoriteDao = new FavoriteDao(this.props.flag);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false,
    };
  }

  componentDidMount() {
    this.loadData(true);
  }

  componentWillReceiveProps(nextProps) {
    this.loadData(false);
  }

  //加载数据
  loadData(isShowLoading) {
    if (isShowLoading) {
      this.setState({
        isLoading: true
      });
    }
    this.favoriteDao.getAllItems().then((items) => {
      let resultData = [];
      for (let i = 0, len = items.length; i < len; i++) {
        resultData.push(new ProjectModel(items[i], true))
      }
      this.setState({
        isLoading: false,
        dataSource: this.getDataSource(resultData),
      })
    }).catch((error) => {
      this.setState({
        isLoading: false
      })
    })
  }

  onRefresh() {
    this.loadData(true);
  }

  getDataSource(items) {
    return this.state.dataSource.cloneWithRows(items);
  }

  updateState(dic) {
    if (!this) return;
    this.setState(dic)
  }

  onUpdateFavorite() {
    this.loadData(false);
    if (this.props.flag === FLAG_STORAGE.flag_popular) {
      DeviceEventEmitter.emit('favoriteChanged_popular');
    } else {
      DeviceEventEmitter.emit('favoriteChanged_trending');
    }
  }

  onSelect(projectModel) {
    this.props.navigation.navigate('RepositoryDetail', {
      projectModel: projectModel,
      flag: this.props.flag,
      onUpdateFavorite: () => this.onUpdateFavorite(),
    })
  }

  //处理收藏事件
  onFavorite(item, isFavorite) {
    let key = this.props.flag === FLAG_STORAGE.flag_popular ? item.id.toString() : item.fullName;
    if (isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item))
    } else {
      this.favoriteDao.removeFavoriteItem(key)
    }

    ArrayUtils.updateArray(this.unFavoriteItems, item);
    if (this.unFavoriteItems.length > 0) {
      if (this.props.flag === FLAG_STORAGE.flag_popular) {
        DeviceEventEmitter.emit('favoriteChanged_popular');
      } else {
        DeviceEventEmitter.emit('favoriteChanged_trending');
      }
    }
  }

  renderRow(projectModel, sectionID, rowID) {
    let CellComponent = this.props.flag === FLAG_STORAGE.flag_popular ? RepositoryCell : TrendingCell;
    return (
      <CellComponent
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

  render() {
    return (
      <View style={styles.container}>
        <ListView
          ref='listView'
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={(data) => this.renderRow(data)}
          renderFooter={() => {
            return <View style={{height: 50}}/>
          }}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              title='Loading...'
              titleColor={'#2196f3'}
              colors={['#2196f3']}
              refreshing={this.state.isLoading}
              onRefresh={() => this.onRefresh()}
              tintColor={'#2196f3'}
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

});