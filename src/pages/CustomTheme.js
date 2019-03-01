import React, { Component } from 'react'
import {
  DeviceInfo,
  Modal,
  TouchableHighlight,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'
import ThemeDao from '../utils/cache/ThemeDao'
import ThemeFactory, { ThemeFlags } from '../assets/styles/ThemeFactory'
import GlobalStyles from '../assets/styles/GlobalStyles'
import actions from '../redux/action'

class CustomKeyPage extends Component {
  constructor (props) {
    super(props)
    this.themeDao = new ThemeDao()
  }

  // 选择主题
  onSelectTheme (themeKey) {
    const { onThemeChange } = this.props
    this.props.onClose()
    this.themeDao.saveTheme(ThemeFlags[themeKey])
    onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]))
  }

  renderThemeItem = (themeKey) => {
    return <TouchableHighlight
      style={{ flex: 1 }}
      underlayColor='white'
      onPress={() => this.onSelectTheme(themeKey)}
    >
      <View style={[{ backgroundColor: ThemeFlags[themeKey] }, styles.themeItem]}>
        <Text style={styles.themeText}>{themeKey}</Text>
      </View>
    </TouchableHighlight>
  }

  renderThemeItems = () => {
    const views = []
    for (let i = 0, keys = Object.keys(ThemeFlags), length = keys.length; i < length; i += 3) {
      const key1 = keys[i], key2 = keys[i + 1], key3 = keys[i + 2]
      views.push(
        <View key={i} style={{ flexDirection: 'row' }}>
          {this.renderThemeItem(key1)}
          {this.renderThemeItem(key2)}
          {this.renderThemeItem(key3)}
        </View>
      )
    }
    return views
  }

  renderContentView = () => {
    return (
      <Modal
        animationType='slide'
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.onClose()
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {this.renderThemeItems()}
          </ScrollView>
        </View>
      </Modal>
    )
  }

  render () {
    let view = this.props.visible ? <View style={GlobalStyles.root_container}>
      {this.renderContentView()}
    </View> : null
    return view
  }
}

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
  onThemeChange: (theme) => dispatch(actions.onThemeChange(theme))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomKeyPage)

const styles = StyleSheet.create({
  themeItem: {
    flex: 1,
    height: 120,
    margin: 3,
    padding: 3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    margin: 10,
    marginBottom: 10 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0),
    marginTop: Platform.OS === 'ios' ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 10,
    backgroundColor: 'white',
    borderRadius: 3,
    shadowColor: 'gray',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    padding: 3
  },
  themeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16
  }
})
