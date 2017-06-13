import React, { Component } from 'react';
import {
  ScrollView,
  Text,
} from 'react-native';
import { PricingCard, ListItem, Button } from 'react-native-elements'
import {  gql, graphql } from 'react-apollo';
import SupplierAccounts from '../queries/SupplierAccounts';
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

class ViewOrder extends Component {

  constructor() {
    super();
  }

  renderItem(item) {
    const title = `${item.state.stateOf.fullName} ${item.state.fullName}`;
    const onPress = () => this.onOrderButtonPress(item);
    return (
      <PricingCard
        key={ `order-view-priceing-card-${item.id}` }
        color='#777777'
        title={title}
        price={`$${item.price.toFixed(2)}`}
        info={[`${item.amount.toFixed(2)} kg`, `GST $${(item.price * 0.15).toFixed(2)}`]}
        button={{ title: 'Rate', icon: 'star' }}
      />
    );
  }

  renderItems() {
    const supplierAccEdge = this.props.data.viewer.organisation.supplierAccounts.edges[0];
    if(!(supplierAccEdge && supplierAccEdge.node.currentOrder)) {
      return null;
    }
    const order = supplierAccEdge.node.currentOrder;
    return order.items.edges.map(e => e.node).map(i => this.renderItem(i));
  }

  render() {
    const items = this.renderItems();
    console.log(this.props.data);
    return (
      <ScrollView>
        { items }
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
        ${SupplierAccounts}
      }
    }
  }
`, { options: { pollInterval: 4000 }})(ViewOrder);
