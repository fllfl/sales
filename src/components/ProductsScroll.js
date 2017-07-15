import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Card, ListItem, Button } from 'react-native-elements'
import {  gql, graphql } from 'react-apollo';
import SupplierAccListing from '../queries/SupplierAccListing';
import AddToOrderForm from './forms/AddToOrderForm';

const styles = {
  cardText: {
    marginBottom: 10
  },
  buyButtonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  }
}

class ProductsScroll extends Component {

  constructor() {
    super();
    this.state = {
      addingItem: null,
    };
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(item,listing) {
    const  { seen, confirmed, cancelled } = listing;
    const { price, state, id } = item;
    const description = `
      ${state.stateOf.description}
    `;
    const title = `
      ${state.stateOf.fullName}
      ${state.fullName} - $${price}.00
    `;
    const onPress = () => this.onOrderButtonPress(item);
    return (
      <Card
        key={ `product-card-${id}-${listing.id}` }
        title={title}
        image={ { uri: state.stateOf.image } }>
        <Text style={styles.cardText}>
          { description }
        </Text>
        <Button
          icon={{name: 'code'}}
          backgroundColor={'#03A9F4'}
          buttonStyle={styles.buyButtonStyle}
          title='ORDER NOW'
          onPress={ onPress }
        />
      </Card>
    );
  }

  onOrderButtonPress(item) {
    this.setState({
      addingItem: item,
    });
  }

  renderItems() {
    const supplierAccounts = this.getSupplierAccounts();
    const allListings = supplierAccounts.map(
      ({ customerGroup }) => customerGroup.currentListing);
    if(!allListings.length) {
      return null;
    }
    const items = [];
    allListings.forEach(
      l => l.items.forEach(
        item => items.push(this.renderItem(item, l))));
    return (
      <View>
        { items }
      </View>
    )
  }

  renderAddToOrder() {
    if(!this.state.addingItem) {
      return null;
    }
    const supplierAccounts = this.getSupplierAccounts();
    const currentOrders = supplierAccounts.map(sa => sa.currentOrder);
    const orders = currentOrders.map(
        (currentOrder, i) => (
          <AddToOrderForm
            key={ `current-order-${currentOrder.id}-${i}` }
            item={ this.state.addingItem }
            goBack={() => this.setState({addingItem: null})}
            order={ currentOrder }
          />
        ));
    return (
      <View>
        { orders }
      </View>
    )
  }

  getSupplierAccounts(){
    if(!this.props.data && this.props.data.viewer) {
      return [];
    }
    return this.props.data.viewer.organisation.supplierAccounts;
  }

  render() {
    const items = this.renderItems();
    const addToOrder = this.renderAddToOrder();
     if(addToOrder) {
       return addToOrder;
     }
    return (
      <ScrollView>
        { items }
        { addToOrder }
      </ScrollView>
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
        ${SupplierAccListing}
      }
    }
  }
`, { options: { pollInterval: 4000 }})(ProductsScroll);
