export default class ArrayUtil {
  /**
   * 更新数组,若item已存在则将其从数组中删除,若不存在则将其添加到数组
   * @param array
   * @param item
   */
  static updateArray (array, item) {
    for (let i = 0, length = array.length; i < length; i++) {
      let temp = array[i]
      if (item === temp) {
        array.splice(i, 1)
        return
      }
    }
    array.push(item)
  }

  /**
   * 将数组中指定元素移除
   * @param array
   * @param item 要移除的item
   * @param id 要对比的属性，缺省则比较地址
   * @returns {*}
   */
  static remove (array, item, id) {
    if (!array) return
    for (let i = 0, length = array.length; i < length; i++) {
      const val = array[i]
      if (item === val || val && val[id] && val[id] === item[id]) {
        array.splice(i, 1)
      }
    }
    return array
  }

  /**
   * 判断两个数组的是否相等
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
  static isEqual (arr1, arr2) {
    if (!(arr1 && arr2)) return false
    if (arr1.length !== arr2.length) return false
    for (let i = 0, length = arr1.length; i < length; i++) {
      if (arr1[i] !== arr2[i]) return false
    }
    return true
  }

  /**
   * 数组克隆
   * @param from
   * @returns {Array}
   */
  static clone (from) {
    if (!from) return []
    let newArray = []
    for (let i = 0, length = from.length; i < length; i++) {
      newArray[i] = from[i]
    }
    return newArray
  }
}