import React, {Component} from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ListView,
  ActivityIndicator,
  DeviceEventEmitter
} from "react-native";
import Toast, {DURATION} from "react-native-easy-toast";
import {ACTION_HOME} from "./HomePage";
import GlobalStyles from '../assets/styles/GlobalStyles'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ActionUtils from '../util/ActionUtils'
import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Utils'
import FavoriteDao from '../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from "../expand/dao/DataRepository";
import ViewUtils from '../util/ViewUtils'

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

export default class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
    this.favoriteKeys = [];
    this.keys = [];
    this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
    this.isKeyChange = false;
    this.state = {
      rightButtonText: '搜索',
      isLoading: false,
      showButton: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      })
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  onBackPress(e) {

  }

  saveKey() {

  }

  async initKeys() {

  }

  checkKeyIsExist(keys, key) {

  }

  flushFavoriteState() {

  }

  getDataSource(items) {

  }

  getFavoriteKeys() {

  }

  loadData() {

  }

  genFetchUrl() {


  }

  onBackPress() {

  }

  updateState(dic) {
    this.setState(dic)
  }

  onRightButtonClick() {

  }

  renderNavBar() {

  }

  renderRow(projectModel) {

  }

  render() {

  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    // backgroundColor:'red'
  },
  statusBar: {
    height: 20,
  },
  textInput: {
    flex: 1,
    height: (Platform.OS === 'ios') ? 30 : 40,
    borderWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderColor: "white",
    alignSelf: 'center',
    paddingLeft: 5,
    marginRight: 10,
    marginLeft: 5,
    borderRadius: 3,
    opacity: 0.7,
    color: 'white'
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: '500'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    height: 40,
    position: 'absolute',
    left: 10,
    top: GlobalStyles.window_height - 45,
    right: 10,
    borderRadius: 3
  }

});
