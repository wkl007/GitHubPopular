import {
  AsyncStorage
} from 'react-native';
import keysData from '../../assets/data/keys.json'
import langsData from '../../assets/data/langs.json'

export let FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'};

export default class LanguageDao {
  constructor(flag) {
    this.flag = flag
  }

  fetch() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.flag, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result || JSON.parse(result).length === 0
        ) {
          let data = this.flag === FLAG_LANGUAGE.flag_language ? langsData : keysData;
          this.save(data);
          resolve(data);
        }
        else {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error)
          }
        }
      });

    })
  }

  save(objectData) {
    let stringData = JSON.stringify(objectData);
    AsyncStorage.setItem(this.flag, stringData, (error, result) => {
    })
  }
}










