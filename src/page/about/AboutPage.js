'use strict';
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ListView,
  Platform,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {MORE_MENU} from "../../common/MoreMenu";
import GlobalStyles from '../../assets/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import config from '../../assets/data/config'

export default class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectModels: [],
      author: config.author
    }
  }

  render() {
    let content = <View>
      关于
    </View>;

    return (
      {content}
    )
  }
}


