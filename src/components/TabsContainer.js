import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements';
import {  gql, graphql } from 'react-apollo';

import ProductsScroll from './ProductsScroll';
import ViewOrder from './ViewOrder';

const styles = {
  container: {
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  activityIndicator: {
    position: 'absolute',
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
  'renderSelectedIcon',
  'renderTabContent',
  'renderActivityIndicator',
];

class TabsContainer extends Component {

  constructor() {
    super();
    this.state = {
      selectedTab: 'offers',
    };

    toBind.forEach(funcName => {
      this[funcName] = this[funcName].bind(this);
    });
  }

  renderActivityIndicator() {
    const { data } = this.props;
    const isOn = !(data && (data.networkStatus === 7));
    const { height, width } = Dimensions.get('window');
    const st = [
      styles.activityIndicator,
      {
        top: height * 0.45,
        left: (width / 2) - 25,
      }
    ];
    return (
      <ActivityIndicator
        size={'large'}
        style={ st }
        animating={ isOn }
      />
    );
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
    const content = (
      <View>
        { this.renderTabContent(text) }
        { this.renderActivityIndicator() }
      </View>
    );
    return (
      <Tab
        titleStyle={styles.tabs.title}
        selectedTitleStyle={styles.tabs.selectedTitle}
        selected={ this.state.selectedTab === text }
        title={text}
        renderIcon={() => this.renderIcon(iconName)}
        renderSelectedIcon={() => this.renderSelectedIcon(iconName)}
        onPress={() => this.changeTab(text)}>
        { content }
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

export default graphql(gql`
  query RootQueries {
    viewer {
      id
      email
      organisation {
        id
        name
      }
    }
  }
`, { options: {}})(TabsContainer);
