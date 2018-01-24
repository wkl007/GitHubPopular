import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  WebView,
  DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../../src/common/NavigationBar'
import GlobalStyles from '../assets/styles/GlobalStyles'
import ViewUtils from '../util/ViewUtils'

export default class WebViewPage extends Component {
  constructor(props) {
    super(props);
    let parame = this.props.navigation.state.params;
    this.state = {
      url: parame.url,
      title: parame.title,
      canGoBack: false,
    }
  }

  onBackPress() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      this.props.navigation.goBack();
    }
  }


  onNavigationStateChange(e) {
    this.setState({
      url: e.url,
      canGoBack: e.canGoBack
    })
  }

  render() {
    let parame = this.props.navigation.state.params;
    return (
      <View style={GlobalStyles.root_container}>
        <NavigationBar
          title={parame.title}
          leftButton={ViewUtils.getLeftButton(() => {
            this.onBackPress()
          })}
          statusBar={{
            backgroundColor: '#2196F3'
          }}
        />
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={(e) => {
            this.onNavigationStateChange(e)
          }}
          source={{
            uri: this.state.url
          }}

        />
      </View>
    )
  }
}