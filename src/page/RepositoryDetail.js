import React, {Component} from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  WebView,
  Platform,
  TouchableOpacity,
  Text,
  View
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import FavoriteDao from '../expand/dao/FavoriteDao'

const TRENDING_URL = 'https://github.com/';

export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props);
    let projectModel=this.props.navigation.state.params.projectModel;
    let item = projectModel.item;
    this.url = item.html_url ? item.html_url : TRENDING_URL + item.fullName;
    let title = item.full_name ? item.full_name : item.fullName;
    this.favoriteDao = new FavoriteDao(this.props.navigation.state.params.flag);
    this.state = {
      url: this.url,
      title: title,
      canGoBack: false,
      isFavorite: projectModel.isFavorite,
      favoriteIcon: projectModel.isFavorite ? require('../assets/images/ic_star.png') : require('../assets/images/ic_star_navbar.png'),
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (this.props.navigation.state.params.onUpdateFavorite)this.props.navigation.state.params.onUpdateFavorite();
  }

  //返回
  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      this.props.navigation.goBack();
    }
  }

  onBackPress(e) {

  }

  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack
    })
  }

  //设置favorite
  setFavoriteState(isFavorite) {
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? require('../assets/images/ic_star.png') : require('../assets/images/ic_star_navbar.png'),
    })
  }

  //favoriteIcon单击回调函数
  onRightButtonClick() {
    let projectModel = this.props.navigation.state.params.projectModel;
    this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite);
    let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }

  //右侧按钮
  renderRightButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.onRightButtonClick()
        }}
      >
        <Image
          style={{width: 20, height: 20, marginRight: 10}}
          source={this.state.favoriteIcon}/>
      </TouchableOpacity>
    )
  }

  render() {
    let titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={this.state.title}
          titleLayoutStyle={titleLayoutStyle}
          statusBar={{
            backgroundColor: '#2196F3'
          }}
          leftButton={ViewUtils.getLeftButton(() => {
            this.onBack()
          })}
          rightButton={this.renderRightButton()}
        />
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={(e) => {
            this.onNavigationStateChange(e)
          }}
          source={{uri: this.state.url}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});