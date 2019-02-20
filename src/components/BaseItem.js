import React, { Component } from 'react'
import {
  TouchableOpacity,
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import PropTypes from 'prop-types'

const THEME_COLOR = '#678'

export default class BaseItem extends Component {
  static propTypes = {
    projectModel: PropTypes.object,
    onSelect: PropTypes.func,
    onFavorite: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      isFavorite: this.props.projectModel.isFavorite
    }
  }

  /**
   * 牢记：https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md
   * @param nextProps
   * @param prevState
   */
  static getDerivedStateFromProps (nextProps, prevState) {
    const isFavorite = nextProps.projectModel.isFavorite
    if (prevState.isFavorite !== isFavorite) {
      return {
        isFavorite
      }
    }
    return null
  }

  // 设置收藏
  setFavoriteState = (isFavorite) => {
    this.props.projectModel.isFavorite = isFavorite
    this.setState({
      isFavorite
    })
  }

  onItemClick = () => {
    this.props.onSelect(isFavorite => {
      this.setFavoriteState(isFavorite)
    })
  }

  onPressFavorite = () => {
    this.setFavoriteState(!this.state.isFavorite)
    this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
  }

  renderFavoriteIcon = () => {
    // const { theme } = this.props
    const { isFavorite } = this.state
    return <TouchableOpacity
      style={{ padding: 6 }}
      underlayColor='transparent'
      onPress={() => this.onPressFavorite()}
    >
      <FontAwesome
        name={isFavorite ? 'star' : 'star-o'}
        size={26}
        style={{ color: THEME_COLOR }}
      />
    </TouchableOpacity>
  }

}
