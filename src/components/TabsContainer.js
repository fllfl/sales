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
import Home from './Home';


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
      top: 5,
      backgroundColor: 'red',
      position: 'absolute',
    },
  }
}

const colors = {
  selectedIcon: '#6296f9',
  icon: '#5e6977',
  iconUnderlay: '#52c4f2',
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
      selectedTab: 'home',
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

  renderIcon(name, type=null) {
    return (
      <Icon containerStyle={styles.icon} color={colors.icon} name={name} type={type} size={26} underlayColor={colors.iconUnderlay} />
    );
  }

  renderSelectedIcon(name, type) {
    return (
      <Icon name={name} color={colors.selectedIcon} size={30} type={type} underlayColor={colors.iconUnderlay} />
    );
  }

  renderTabContent(text) {

    switch (text) {
      case 'fish':
        return (
          <ProductsScroll />
        );
      case 'cart':
        return (
          <ViewOrder />
        );
      case 'home':
        return (
          <Home />
        );
    }

    throw new Error('no tab matches selected tab string');

  }

  renderTab(text, iconName, iconType) {
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
        renderIcon={() => this.renderIcon(iconName, iconType)}
        renderSelectedIcon={() => this.renderSelectedIcon(iconName, iconType)}
        onPress={() => this.changeTab(text)}>
        { content }
      </Tab>
    )
  }

  renderTabs() {
    return (
      <Tabs>
        { this.renderTab('home', 'ios-home', 'ionicon') }
        { this.renderTab('fish', 'ship', 'font-awesome') }
        { this.renderTab('cart', 'ios-cart', 'ionicon') }
      </Tabs>
    );
  }

  render() {
    const { height, width } = Dimensions.get('window');
    const tabs = this.renderTabs();
    if(!this.props.data && this.props.data.viewer) {

    }
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
