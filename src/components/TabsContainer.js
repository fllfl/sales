import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Image,
} from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements';
import ProductsScroll from './components/ProductsScroll';
import ViewOrder from './components/ViewOrder';

const auth0 = new AuthService(Auth0Credentials.clientId, Auth0Credentials.uri);

const styles = {
  container: {
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  tabs: {
    title: {
      fontWeight: 'bold',
      fontSize: 9,
    },
    selectedTitle: {
      marginTop: -1,
      marginBottom: 6
    },
    icon: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 14
    },

  }
}

const colors = {
  selectedIcon: '#6296f9',
  icon: '#5e6977',
}

const toBind = [
  'renderTabs',
  'changeTab',
  'renderIcon',
  'renderSelectedIcon',``
  'renderTabContent',
];

export default class TabsContainer extends Component {

  constructor() {
    super();
    this.state = {
      selectedTab: 'offers',
    };

    toBind.forEach(funcName => {
      this[funcName] = this[funcName].bind(this);
    });
  }

  changeTab(selectedTab) {
    this.setState({selectedTab})
  }

  renderIcon(name) {
    return (
      <Icon containerStyle={styles.icon} color={colors.icon} name={name} size={33} />
    );
  }

  renderSelectedIcon(name) {
    return (
      <Icon color={styles.icon} name={name} size={30} />
    );
  }

  renderTabContent(text) {

    switch (text) {
      case 'offers':
        return (
          <ProductsScroll />
        );
      case 'my orders':
        return (
          <ViewOrder />
        );
    }

    throw new Error('no tab matches selected tab string');

  }

  renderTab(text, iconName) {
    return (
      <Tab
        titleStyle={styles.tabs.title}
        selectedTitleStyle={styles.tabs.selectedTitle}
        selected={ this.state.selectedTab === text }
        title={text}
        renderIcon={() => this.renderIcon(iconName)}
        renderSelectedIcon={() => this.renderSelectedIcon(iconName)}
        onPress={() => this.changeTab(text)}>
        { this.renderTabContent(text) }
      </Tab>
    )
  }

  renderTabs() {
    return (
      <Tabs>
        { this.renderTab('offers', 'local-offer') }
        { this.renderTab('my orders', 'history') }
      </Tabs>
    );
  }

  render() {
    const { height, width } = Dimensions.get('window');
    const tabs = this.renderTabs();
    return (
      <View style={ [styles.container, { width, height }] }>
        { tabs }
      </View>
    );
  }

}