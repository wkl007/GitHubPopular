/**
 * 更多菜单
 */
import React, { Component } from 'react'
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
  DeviceInfo,
  View,
  Text
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import PropTypes from 'prop-types'
import TimeSpan from '../utils/model/TimeSpan'

export const TimeSpans = [
  new TimeSpan('今 天', 'since=daily'),
  new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly')
]

export default class TrendingDialog extends Component {
  state = {
    visible: false
  }

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    menus: []
  }

  show = () => {
    this.setState({
      visible: true
    })
  }

  dismiss = () => {
    this.setState({
      visible: false
    })
  }

  render () {
    const { onClose, onSelect } = this.props
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.dismiss()}
        >
          <MaterialIcons
            name={'arrow-drop-up'}
            size={36}
            style={styles.arrow}
          />
          <View
            style={styles.content}
          >
            {
              TimeSpans.map((result, i, arr) => {
                return <TouchableOpacity
                  key={i}
                  onPress={() => {
                    onSelect(arr[i])
                  }}
                  underlayColor={'transparent'}
                >
                  <View style={styles.text_container}>
                    <Text
                      style={styles.text}
                    >{arr[i].showText}</Text>

                  </View>
                  {
                    i !== TimeSpans.length - 1
                      ? <View style={styles.line}/>
                      : null
                  }
                </TouchableOpacity>
              })
            }
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
  arrow: {
    marginTop: 40,
    color: 'white',
    padding: 0,
    margin: -15
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3
  },
  text_container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26
  },
  line: {
    height: 0.3,
    backgroundColor: 'darkgray'
  },
})
