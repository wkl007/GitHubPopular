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


 }