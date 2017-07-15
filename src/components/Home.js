import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  Dimensions,
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Card, ListItem, Button } from 'react-native-elements'
import {  gql, graphql } from 'react-apollo';
import SupplierAccListing from '../queries/SupplierAccListing';
import AuthService from '../auth/AuthService';
import Auth0Credentials from '../auth/Auth0Credentials';

const { clientId, uri } = Auth0Credentials;
const auth0 = new AuthService(clientId, uri);

const styles = {
  cardText: {
    marginBottom: 10
  },
  buyButtonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  welcome: {
    marginTop: 0,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  orgText: {
    fontSize: 16,
  },
  welcomeText: {
    marginTop: 5,
    width: '100%',
    fontSize: 22,
  },
  logo: {
    width: '100%',
    height: 150,
  }
}

const toBind = [
  'logout',
];

class Home extends Component {

  logout() {
    auth0.logout({ removeTouch: true });
  }

  renderSupplierAccounts() {
    const { organisation } = this.props.data.viewer;

    return organisation.supplierAccounts.map(s => (
      <Card
        key={ `supplier-card-${s.id}` }
      >
        <View style={ styles.welcome }>
          <Text style={ [styles.welcomeText, styles.orgText] }>
            { s.supplierName }
          </Text>
          <Text style={ [styles.welcomeText, styles.orgText] }>
            { s.email }
          </Text>
          <Text style={ [styles.welcomeText, styles.orgText] }>
            { s.phoneNumber }
          </Text>
          <Text style={ [styles.welcomeText, styles.orgText] }>
            { s.customerGroup.name }
          </Text>
          <Text style={ [styles.welcomeText, styles.orgText] }>
            { s.customerGroup.orgainisation.name }
          </Text>
        </View>
      </Card>
    ));
  }

  renderNews() {
    const items = this.props.data.organisation.newsItems;
    return (
      <Card title={ 'News' }>
        { 'this is the news '}
      </Card>
    );
  }

  render() {
    const { data } = this.props;
    if(!(data && data.viewer)) {
      return null;
    }
    const { organisation, fullName, email  } = this.props.data.viewer;
    const supplyAccs = this.renderSupplierAccounts();
    return (
      <View>
        <Image
          source={ require('../images/logo.png') }
          style={ styles.logo }
          resizeMode= { 'contain'}
        />
        <Card title={ "Matai's Seafood - get fish freshest first" }>
          <View style={ styles.welcome }>
            <Text style={[styles.welcomeText, styles.orgText]}>
              { organisation.name }
            </Text>
            <Text style={styles.welcomeText}>
              { `Welcome back ${fullName}` }
            </Text>
            <Text style={[styles.welcomeText, styles.orgText]}>
              { 'please enjoy the offers available from:' }
            </Text>

          </View>
        </Card>
        { supplyAccs }
      </View>
    )
  }
}

export default graphql(gql`
  query RootQueries {
    viewer {
      id
      fullName
      email
      organisation {
        id
        name
        ${ SupplierAccListing }
      }
    }
  }
`, { options: { pollInterval: 4000 }})(Home);
