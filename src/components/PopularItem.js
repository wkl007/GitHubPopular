/**
 * 最热页面Item
 */
import React from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native'
import BaseTouchable from './BaseTouchable'
import BaseItem from './BaseItem'

export default class PopularItem extends BaseItem {
  render () {
    const { projectModel } = this.props
    const { item } = projectModel
    if (!item || !item.owner) return null
    return (
      <BaseTouchable
        onPress={() => this.onItemClick()}
      >
        <View style={styles.cell_container}>
          <Text style={styles.title}>
            {item.full_name}
          </Text>
          <Text style={styles.description}>
            {item.description}
          </Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Author:</Text>
              <Image
                style={{ width: 22, height: 22 }}
                source={{ uri: item.owner.avatar_url }}
              />
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>Stars:</Text>
              <Text>{item.stargazers_count}</Text>
            </View>
            {this.renderFavoriteIcon()}
          </View>
        </View>
      </BaseTouchable>
    )
  }
}

const styles = StyleSheet.create({
  cell_container: {
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    backgroundColor: 'white',
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  }
})
