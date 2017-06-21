import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import ErrorUtils from 'ErrorUtils';
import TabsContainer from './components/TabsContainer';
import AuthService from './auth/AuthService';
import Auth0Credentials from './auth/Auth0Credentials';

import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import { gql, graphql } from 'react-apollo';

const auth0 = new AuthService(Auth0Credentials.clientId, Auth0Credentials.uri);

const toBind = [
  'setupApollo',
  'checkAuth',
  'login',
  'isErrorState',
];

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      client: null,
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

  componentWillReceiveProps(nextProps, nextState) {

    console.log("asdasd", nextProps, nextState);

    if(!nextState.auth) {
      this.login();
    }
    if(!(nextState.client && !nextState.client.error)) {
      auth0.logout();
      this.setState({
        auth: null,
      });
    }
  }

  onLoggedIn(auth) {
    if(!auth) {
      this.setState({
        auth: null,
      });
    }
    console.log(auth);
    this.setState({
      auth,
    });

    /*this.authInterval = setInterval(() => {
      this.checkAuth();
    }, 5000);*/

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

  login() {
    auth0.login({connections: ["touchid"]}).then(
      auth => this.onLoggedIn(auth));
  }

  setupAuth() {

    return this.login();

    auth0.isLoggedIn().then(isLoggedIn => {
      if(isLoggedIn) {
        auth0.getToken()
          .then((auth) => this.onLoggedIn(auth));
      } else {
        this.login();
      }
    });
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

  renderError() {
    const { height, width } = Dimensions.get('window');
    const fullScrn = { width, height };
    return (
      <View style={ fullScrn }>
        <Image
          source={require('./images/error.png')}
          style={fullScrn}
          resizeMode={'cover'}
        />
      </View>
    );
  }

  isErrorState() {
    const { client, auth } = this.state;
    const err = !(client && !client.error);
    if(client) {
      console.log(client.error);
    }

    return err;
  }

  render() {
    if(this.isErrorState()) {
      return this.renderError();
    }
    return (
      <ApolloProvider
        client={this.state.client}>
        <TabsContainer />
      </ApolloProvider>
    );
  }

}
