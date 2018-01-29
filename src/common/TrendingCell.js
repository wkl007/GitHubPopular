import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import HTMLView from 'react-native-htmlview'

export default class TrendingCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: this.props.projectModel.isFavorite,
      favoriteIcon: this.props.projectModel.isFavorite ? require('../assets/images/ic_star.png') : require('../assets/images/ic_unstar_transparent.png'),
    }
  }

  //组件刷新
  componentWillReceiveProps(nextProps) {
    this.setFavoriteState(nextProps.projectModel.isFavorite)
  }

  setFavoriteState(isFavorite) {
    this.setState({
      isFavorite: isFavorite,
      favoriteIcon: isFavorite ? require('../assets/images/ic_star.png') : require('../assets//images/ic_unstar_transparent.png')
    })
  }

  //收藏
  onPressFavorite() {
    this.setFavoriteState(!this.state.isFavorite);
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
  }

  render() {
    let item = this.props.projectModel.item ? this.props.projectModel.item : this.props.projectModel;
    let description = `<p>${item.description}</p>`;
    let favoriteButton = <TouchableOpacity
      onPress={() => {
        this.onPressFavorite()
      }}
    >
      <Image style={[{width: 22, height: 22}, this.props.theme.styles.tabBarSelectedIcon]}
             source={this.state.favoriteIcon}/>
    </TouchableOpacity>;
    return (
      <TouchableOpacity
        onPress={this.props.onSelect}
      >
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.fullName}</Text>
          <HTMLView
            value={description}
            onLinkPress={(url) => {
            }}
            stylesheet={{
              p: styles.description,
              a: styles.description
            }}
          />
          <Text style={styles.description}>{item.meta}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.description}>Build by:</Text>

              {item.contributors.map((result, i, arr) => {
                return (
                  <Image key={i} style={{width: 22, height: 22}} source={{uri: arr[i]}}/>
                )
              })}
            </View>
            {favoriteButton}
          </View>
        </View>
      </TouchableOpacity>
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
});