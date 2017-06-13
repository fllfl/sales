import React, { Component } from 'react';
import {
  View,
  Dimensions,
  Image,
} from 'react-native';
import { Tabs, Tab, Icon } from 'react-native-elements';
import ErrorUtils from 'ErrorUtils';
import ProductsScroll from './components/ProductsScroll';
import ViewOrder from './components/ViewOrder';
import AuthService from './auth/AuthService';
import Auth0Credentials from './auth/Auth0Credentials';

import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import { gql, graphql } from 'react-apollo';

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
  'renderSelectedIcon',
  'renderTabContent',
  'setupApollo',
  'checkAuth',
];

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      selectedTab: 'offers',
      auth: null,
    };

    /*this.setupErrors = ErrorUtils.setGlobalHandler((e) => {
      console.log(e);
      this.setState({
        selectedTab: 'error',
      });
      setTimeout(() =>  {
        this.setupApollo();
        this.setState({
          selectedTab: 'offers',
        })
      }, 3000);
    });*/

    toBind.forEach(funcName => {
      this[funcName] = this[funcName].bind(this);
    });
  }

  componentDidMount() {
    this.setupAuth();
  }

  onLoggedIn(auth) {
    if(!auth) {
      return;
    }
    console.log(auth);
    this.setState({
      auth,
    });

    this.authInterval = setInterval(() => {
      this.checkAuth();
    }, 60000);

    this.setupApollo();
  }

  checkAuth() {
    if(!auth0.isLoggedIn()) {
      this.setState({
        auth: null,
      });
      this.setupAuth();
    }
  }

  setupAuth() {
    auth0.login({connections: ["touchid"]}).then(
      auth => this.onLoggedIn(auth));
    /*auth0.isLoggedIn().then(isLoggedIn => {
      if(isLoggedIn) {
        auth0.getToken()
          .then((auth) => this.onLoggedIn(auth));
      } else {

      }
    });*/
  }

  setupApollo() {

    const networkInterface = createNetworkInterface({
      //uri: 'http://172.104.55.56:5003/graphql',
      uri: 'http://localhost:5003/graphql'
    });

    networkInterface.use([{
      applyMiddleware: (req, next) => {
        if (!req.options.headers) {
          req.options.headers = {};  // Create the header object if needed.
        }
        req.options.headers.authorization = `Bearer ${this.state.auth.token.idToken}`
        next();
      }
    }]);
    const client = new ApolloClient({
      networkInterface: networkInterface,
      dataIdFromObject: r => r.id,
    });
    this.setState({
      client,
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

  }

  renderWaiting() {
    const { height, width } = Dimensions.get('window');
    const fullScrn = {width, height};
    return (
      <View style={fullScrn} />
    )
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

  renderError() {
    const { height, width } = Dimensions.get('window');
    const fullScrn = {width, height};
    console.log('error')
    return (
      <View style={ [styles.container, fullScrn ] }>
        <Image
          source={require('./images/error.png')}
          style={fullScrn}
          resizeMode={'cover'}
        />
      </View>
    );
  }

  render() {
    const { height, width } = Dimensions.get('window');
    console.log(this.state.client)
    if(this.state.selectedTab === 'error') {
      return this.renderError();
    }
    if(!(this.state.auth && this.state.client)) {
      return this.renderWaiting();
    }

    const tabs = this.renderTabs();
    return (
      <ApolloProvider
        client={this.state.client}>
        <View style={ [styles.container, { width, height }] }>
          { tabs }
        </View>
      </ApolloProvider>
    );
  }

}
