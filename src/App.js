import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements'
import ErrorUtils from 'ErrorUtils';
import TabsContainer from './components/TabsContainer';
import AuthService from './auth/AuthService';
import Auth0Credentials from './auth/Auth0Credentials';

import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import { gql, graphql } from 'react-apollo';

const { clientId, uri } = Auth0Credentials;
const auth0 = new AuthService(clientId, uri);

const toBind = [
  'setupApollo',
  //'checkAuth',
  'login',
  'isErrorState',
  'onSideMenuChange',
  'toggleSideMenu',
];

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      auth: null,
      isOpen: false,
    };
    ErrorUtils.setGlobalHandler((e) => {
      console.log("I FOUND AN ERROR", e);
      console.error(e);
      setTimeout(() => {
        auth0.isLoggedIn().then(auth => {
          if(!auth) {
            this.login();
          }
        });
      }, 5000);
    });

    toBind.forEach(funcName => {
      this[funcName] = this[funcName].bind(this);
    });
  }

  componentDidMount() {
    this.login();
  }

  onSideMenuChange (isOpen: boolean) {
    this.setState({
      isOpen: isOpen
    });
  }

  toggleSideMenu () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if(!nextState.auth) {
      this.login();
    }
  }

  onLoggedIn(auth) {
    if(!auth) {
      this.setState({
        auth: null,
      });
      return;
    }
    this.setState({
      auth,
    });
    this.setupApollo();

    clearInterval(this.authInterval);
    this.authInterval = setInterval(() => {
      auth0.isLoggedIn().then(auth => {
        if(!auth) {
          this.login();
        }
      });
    }, 2500);
  }

  login() {
    auth0.logout({ removeTouch: false });
    auth0.login().then(
      auth => this.onLoggedIn(auth));
  }

  setupApollo() {
    const networkInterface = createNetworkInterface({
      //uri: 'http://172.104.55.56:5003/graphql',
      uri: 'http://localhost:5003/graphql'
    });

    networkInterface.use([{
      applyMiddleware: (req, next) => {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        req.options.headers.authorization = `Bearer ${this.state.auth.token.idToken}`
        next();
      }
    }]);
    const client = new ApolloClient({
      networkInterface: networkInterface,
      dataIdFromObject: r => r.id,
    });
    this.setState({ client });
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
    const { client } = this.state;
    const err = !(client && !client.error);
    return err;
  }

  render() {

    const MenuComponent = (
      <View style={{flex: 1, backgroundColor: '#ededed', paddingTop: 50}}>
        <List containerStyle={{marginBottom: 20}}>
          <ListItem
            roundAvatar
            onPress={() => console.log('Pressed')}
            avatar={{uri: 'http://i2.cdn.cnn.com/cnnnext/dam/assets/161107120239-01-trump-parry-super-169.jpg'}}
            key={'234234234'}
            title={'TRUMP'}
            subtitle={'call on cellphone now'}
          />
        </List>
      </View>
    );

    if(!this.state.auth) {
      const { height, width } = Dimensions.get('window');
      const fullScrn = { width };
      return (
        <View>
          <Image
            source={require('./images/logo.png')}
            style={fullScrn}
            resizeMode={'contain'}
          />
        </View>
      )
    }
    if(!this.state.client) {
      return this.renderError();
    }
    return (
      <ApolloProvider
        client={this.state.client}>
        <SideMenu
          isOpen={this.state.isOpen}
          onChange={this.onSideMenuChange.bind(this)}
          menu={MenuComponent}
        >
          <TabsContainer
            toggleSideMenu={this.toggleSideMenu.bind(this)}
          />
        </SideMenu>
      </ApolloProvider>
    );
  }

}
