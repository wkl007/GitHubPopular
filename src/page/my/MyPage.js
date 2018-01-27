import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableHighlight
} from 'react-native'
import NavigationBar from '../../common/NavigationBar'
import {MORE_MENU} from "../../common/MoreMenu";
import CustomTheme from './CustomTheme'
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'

import GlobalStyles from '../../assets/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'


export default class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customThemeViewVisible: false,
      theme: this.props.theme,
    }
  }

  componentDidMount() {

  }

  //主题view
  renderCustomThemeView() {
    return (
      <CustomTheme
        visible={this.state.customThemeViewVisible}
        {...this.props}
        onClose={() => this.setState({customThemeViewVisible: false})}
      />
    )
  }

  //点击事件
  onClick(tab) {
    let TargetComponent, parame = {menuType: tab, theme: this.state.theme};
    switch (tab) {
      case MORE_MENU.Custom_Language:
        TargetComponent = 'CustomKeyPage';
        parame.flag = FLAG_LANGUAGE.flag_language;

        break;
      case MORE_MENU.Custom_Key:
        TargetComponent = 'CustomKeyPage';
        parame.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Remove_Key:
        TargetComponent = 'CustomKeyPage';
        parame.flag = FLAG_LANGUAGE.flag_key;
        parame.isRemoveKey = true;
        break;
      case MORE_MENU.Sort_Language:
        TargetComponent = 'SortKeyPage';
        parame.flag = FLAG_LANGUAGE.flag_language;
        break;
      case MORE_MENU.Sort_Key:
        TargetComponent = 'SortKeyPage';
        parame.flag = FLAG_LANGUAGE.flag_key;
        break;
      case MORE_MENU.Custom_Theme:
        this.setState({customThemeViewVisible: true});
        break;
      case MORE_MENU.About_Author:
        TargetComponent = 'AboutMePage';
        break;
      case MORE_MENU.About:
        TargetComponent = 'AboutPage';
        break;
      case '更新':
        this.update();
        break;
    }
    if (TargetComponent) {
      this.props.navigation.navigate(TargetComponent, parame)
    }
  }

  getItem(tag, icon, text) {
    return ViewUtils.getSettingItem(() => {
      this.onClick(tag)
    }, icon, text, this.state.theme.styles.tabBarSelectedIcon, null)
  }

  render() {
    let statusBar = {
      backgroundColor: this.state.theme.themeColor,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title='我的'
      statusBar={statusBar}
      style={this.state.theme.styles.navBar}
    />;
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <ScrollView>
          <TouchableHighlight
            onPress={() => {
              this.onClick(MORE_MENU.About)
            }}
          >
            <View style={[styles.item, {height: 90}]}>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Image source={require('../../assets/images/ic_trending.png')}
                       style={[{width: 40, height: 40, marginRight: 10}, this.state.theme.styles.tabBarSelectedIcon]}/>
                <Text>GitHub Popular</Text>
              </View>
              <Image source={require('../../assets/images/ic_tiaozhuan.png')}
                     style={[{
                       opacity: 1,
                       marginLeft: 10,
                       height: 22,
                       width: 22,
                       alignSelf: 'center'
                     }, this.state.theme.styles.tabBarSelectedIcon]}
              />
            </View>
          </TouchableHighlight>
          <View style={GlobalStyles.line}/>
          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Custom_Key, require('./images/ic_custom_language.png'), '自定义标签')}
          {/*标签排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Key, require('./images/ic_swap_vert.png'), '标签排序')}
          {/*标签移除*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Remove_Key, require('./images/ic_remove.png'), '标签移除')}
          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Custom_Language, require('./images/ic_custom_language.png'), '自定义语言')}
          {/*语言排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Language, require('./images/ic_swap_vert.png'), '语言排序')}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Custom_Theme, require('./images/ic_view_quilt.png'), '自定义主题')}
          {/*关于作者*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.About_Author, require('./images/ic_insert_emoticon.png'), '关于作者')}
          <View style={GlobalStyles.line}/>
        </ScrollView>
        {this.renderCustomThemeView()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 10, height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: 'gray'
  },
});