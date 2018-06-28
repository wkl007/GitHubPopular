/**
 * 列表
 */
import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import BaseTouchable from './BaseTouchable'


export default class RepositoryCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
      favoriteIcon: RepositoryCell.getIcon(this.props.projectModel.isFavorite)
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite: isFavorite,
        favoriteIcon: RepositoryCell.getIcon(isFavorite)
      }
    }
    return null
  }

  static getIcon (isFavorite) {
    return isFavorite ? require('../assets/images/ic_star.png') : require('../assets/images/ic_unstar_transparent.png')
  }

  setFavoriteState (isFavorite) {
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: RepositoryCell.getIcon(isFavorite)
    })
  }

  //收藏
  onPressFavorite () {
    this.setFavoriteState(!this.state.isFavorite)
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
  }

  render () {
    let item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel
    let favoriteButton = <TouchableOpacity
      onPress={() => {
        this.onPressFavorite()
      }}
    >
      <Image style={[{width: 22, height: 22}, this.props.theme.styles.tabBarSelectedIcon]}
             source={this.state.favoriteIcon}/>
    </TouchableOpacity>
    return (
      <BaseTouchable
        onPress={this.props.onSelect}
      >
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.full_name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Author:</Text>
              <Image style={{width: 22, height: 22}} source={{uri: item.owner.avatar_url}}/>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#ddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'gray',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121'
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575'
  },
})