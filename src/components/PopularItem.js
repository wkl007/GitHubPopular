/**
 * 最热页面Item
 */
import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import BaseTouchable from './BaseTouchable'

export default class PopularItem extends Component {
  constructor (props) {
    super(props)

  }

  render () {
    const { item, onSelect } = this.props
    if (!item || !item.owner) return null
    let favoriteButton =
      <TouchableOpacity
        onPress={() => {}}
        style={{ padding: 6 }}
        underlayColor='transparent'
      >
        <FontAwesome
          name='star-o'
          size={26}
          style={{ color: 'red' }}
        />
      </TouchableOpacity>
    return (
      <BaseTouchable
        onPress={onSelect}
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
            {favoriteButton}
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
