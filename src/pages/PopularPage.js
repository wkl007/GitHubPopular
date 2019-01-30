import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  Platform,
  StyleSheet,
} from 'react-native'
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../redux/action'
import NavigationUtils from '../utils/NavigationUtils'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'

export default class PopularPage extends Component {
  constructor (props) {
    super(props)
    this.tabNames = ['iOS', 'Java', 'Android', 'React', 'React Native']
  }

  _renderTabs = () => {
    const tabs = {}
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTabPage {...props} tabLabel={item}/>,
        navigationOptions: {
          title: item
        }
      }
    })
    return createAppContainer(createMaterialTopTabNavigator(
      tabs,
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
    ))
  }

  render () {
    const TabNavigator = this._renderTabs()
    return <TabNavigator/>
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
  loadData = () => {
    const { onLoadPopularData } = this.props
    const url = this.genFetchUrl(this.storeName)
    onLoadPopularData(this.storeName, url)
  }

  //拼接url
  genFetchUrl = (key) => {
    return URL + key + QUERY_STR
  }

  //渲染每一行
  renderItem = (data) => {
    const { item } = data
    return <View style={{ marginBottom: 10 }}>
      <Text style={{ backgroundColor: '#faa' }}>
        {JSON.stringify(item)}
      </Text>
    </View>
  }

  render () {
    const { popular } = this.props
    let store = popular[this.storeName]//动态获取state
    if (!store) {
      store = {
        items: [],
        isLoading: false
      }
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={store.items}
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
        />
        {/*<Text>{TabLabel}</Text>
        <Text
          onPress={() => {
            NavigationUtils.goPage({ navigation }, 'DetailPage')
          }}
        >跳转到详情页面</Text>*/}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  popular: state.popular
})

const mapDispatchToProps = dispatch => ({
  onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
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
