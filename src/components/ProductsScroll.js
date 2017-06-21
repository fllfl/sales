import React, { Component } from 'react';
import {
  ScrollView,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Card, ListItem, Button } from 'react-native-elements'
import {  gql, graphql } from 'react-apollo';
import SupplierAccListing from '../queries/SupplierAccListing';
import AddToOrderForm from './AddToOrderForm';

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
  }

  renderItem(item, { seen, confirmed, cancelled }) {
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
        key={ `product-card-${id}` }
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
          onPress={onPress}
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
    const supplierAccEdge = this.props.data.viewer.organisation.supplierAccounts.edges[0];
    if(!supplierAccEdge) {
      return null;
    }
    const listing = supplierAccEdge.node.customerGroup.currentListing;
    if(listing) {
      return listing.items.edges.map(e => e.node).map(i => this.renderItem(i, listing));
    }
    return null;
  }

  renderAddToOrder() {
    if(!this.state.addingItem) {
      return null;
    }
    const acc = this.props.data.viewer.organisation.supplierAccounts.edges[0].node;
    return (
      <AddToOrderForm
        item={this.state.addingItem}
        goBack={() => this.setState({addingItem: null})}
        order={acc.currentOrder}
      />
    )
  }

  render() {
    console.log(this.props.data);
    if(!this.props.data.viewer) {
      return null;
    }

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
