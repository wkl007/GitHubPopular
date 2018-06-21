import { StackActions, NavigationActions } from 'react-navigation'

export default class NavigatorUtil {

  /**
   * 返回上一页
   * @param navigation
   */
  static goBack (navigation) {
    navigation.goBack()
  }

  /**
   * 跳转到详情页
   * @param params
   */
  static goToRepositoryDetail (params) {
    const {navigation, projectModel, flag, theme, onUpdateFavorite} = params
    navigation.navigate('RepositoryDetail', {
      navigation: navigation,
      projectModel: projectModel,
      flag: flag,
      theme: theme,
      onUpdateFavorite: onUpdateFavorite,
    })
  }

  /**
   * 跳转到首页
   * @param params
   */
  static resetToHomePage (params) {
    const {navigation, theme, selectedTab} = params
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'HomePage',
          params: {
            theme: theme,
            selectedTab: selectedTab,
          }
        })
      ]
    })

    navigation.dispatch(resetAction)
  }

  /**
   * 跳转到搜索页面
   * @param params
   */
  static goToSearchPage (params) {
    const {navigation, theme} = params
    navigation.navigate('SearchPage', {
      navigation: navigation,
      theme: theme
    })
  }

  /**
   * 跳转到菜单详情页
   * @param params
   * @param routerName
   */
  static goToMenuPage (params, routerName) {
    const {navigation} = params
    navigation.navigate(
      routerName,
      {
        ...params
      }
    )
  }

}