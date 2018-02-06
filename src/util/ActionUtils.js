import DataRepository, {FLAG_STORAGE} from "../expand/dao/DataRepository";

export default class ActionUtils {

  /**
   * 跳转到详情页
   * @param params
   */
  static onSelectRepository(params) {
    params.navigation.navigate('RepositoryDetail', {
      ...params
    })
  }

  /**
   * favoriteIcon单击回调函数
   * @param item
   * @param isFavorite
   */
  static onFavorite(favoriteDao, item, isFavorite, flag) {
    let key = flag === FLAG_STORAGE.flag_trending ? item.fullName : item.id.toString();
    if (isFavorite) {
      favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
    } else {
      favoriteDao.removeFavoriteItem(key);
    }
  }
}