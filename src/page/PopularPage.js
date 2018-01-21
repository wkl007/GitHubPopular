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
import RepositoryCell from '../common/RepositoryCell'
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository'
//获取AsyncStorage中的数据
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ProjectModel from "../model/ProjectModel";
//工具函数，检查该Item是否被收藏
import Utils from '../util/Utils'
//接口路径
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

export default class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
    this.state = {
      dataArray: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.languageDao.fetch()
      .then(result => {
        this.setState({
          dataArray: result
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    let content = this.state.dataArray.length > 0 ? <ScrollableTabView
      tabBarBackgroundColor='#2196F3'
      tabBarActiveTextColor='#fff'
      tabBarInactiveTextColor='mintcream'
      tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
      renderTabBar={() => <ScrollableTabBar/>}
    >
      {this.state.dataArray.map((result, i, arr) => {
        let item = arr[i];
        return item.checked ? <PopularTab {...this.props} key={i} tabLabel={item.name}/> : null
      })}
    </ScrollableTabView> : null;
    return (
      <View style={styles.container}>
        <NavigationBar title='最热'
                       statusBar={{
                         backgroundColor: '#2196F3'
                       }}
        />
        {content}
      </View>
    )
  }
}

class PopularTab extends Component {
  constructor(props) {
    super(props);
    this.isFavoriteChanged = false;
    this.dataRepository = new DataRepository();
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      isLoading: false,
      favoriteKeys: [],//收藏的列表
    };
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('favoriteChanged_popular', () => {
      this.isFavoriteChanged = true;
    });
    this.loadData();
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.isFavoriteChanged) {
      this.isFavoriteChanged = false;
      this.getFavoriteKeys();
    } else if (nextProps.theme !== this.state.theme) {
      this.updateState({theme: nextProps.theme});
      this.flushFavoriteState();
    }
  }

  //加载数据
  loadData() {
    this.setState({
      isLoading: true
    });
    let url = URL + this.props.tabLabel + QUERY_STR;
    this.dataRepository.fetchRepository(url)
      .then(result => {
        this.items = result && result.items ? result.items : result ? result : [];
        this.getFavoriteKeys();
        if (result && result.update_date && !this.dataRepository.checkData(result.update_date)) {

          return this.dataRepository.fetchNetRepository(url);
        } else {
          DeviceEventEmitter.emit('showToast', '显示缓存数据');
        }
      })
      .then((items) => {
        if (!items || items.length === 0) return;
        this.items = items;
        this.getFavoriteKeys();
      })
      .catch(err => {
        console.log(err);
        this.updateState({
          isLoading: false
        })
      })
  }

  //更新project每一项收藏的状态
  flushFavoriteState() {
    let projectModels = [];
    let items = this.items;
    for (let i = 0, len = items.length; i < len; i++) {
      projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoriteKeys)));
    }
    this.updateState({
      isLoading: false,
      dataSource: this.getDataSource(projectModels),
    })
  }

  //获取本地用户收藏的ProjectItem
  getFavoriteKeys() {
    favoriteDao.getFavoriteKeys().then((keys) => {
      if (keys) {
        this.updateState({favoriteKeys: keys});
      }
      this.flushFavoriteState();
    }).catch((error) => {
      this.flushFavoriteState();
      console.log(error);
    });
  }

  getDataSource(items) {
    return this.state.dataSource.cloneWithRows(items);
  }

  updateState(dic) {
    if (!this) return;
    this.setState(dic)
  }

  //更新favorite
  onUpdateFavorite() {
    this.getFavoriteKeys();
  }

  onSelect(projectModel) {
    this.props.navigation.navigate('RepositoryDetail', {
      projectModel: projectModel,
      flag: FLAG_STORAGE.flag_popular,
      onUpdateFavorite: () => this.onUpdateFavorite(),
    })
  }

  //处理收藏事件
  onFavorite(item, isFavorite) {
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item))
    } else {
      favoriteDao.removeFavoriteItem(item.id.toString())
    }
  }

  renderRow(projectModel) {
    return <RepositoryCell
      key={projectModel.item.id}
      onSelect={() => this.onSelect(projectModel)}
      onFavorite={(item, isFavorite) => {
        this.onFavorite(item, isFavorite)
      }}
      projectModel={projectModel}/>
  }

  render() {
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
              titleColor={'#2196f3'}
              colors={['#2196f3']}
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData()}
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
    flex: 1
  },
  tips: {
    fontSize: 29
  }
});