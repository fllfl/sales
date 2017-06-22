import React, { Component } from 'react';
import {
  ScrollView,
  Dimensions,
  Text,
  View,
  Image,
} from 'react-native';
import { PricingCard, ListItem, Button, Card, List } from 'react-native-elements'
import {  gql, graphql } from 'react-apollo';
import SupplierAccOrder from '../queries/SupplierAccOrder';
import AddToOrderForm from './AddToOrderForm';

const styles = {
  buyButtonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  wrapper: {
    padding: 0,
    left: 0,
    top: 0,
    margin: 0,
  },
  totalsText: {
    textAlign: 'right',
    right: 0,
    color: '#86939e',
    fontSize: 13.79999,
    fontWeight: '600',
  },
  totalsTextWrapper: {
    marginTop: 5,
  }
}

class ViewOrder extends Component {

  constructor() {
    super();
    this.getOrder = this.getOrder.bind(this);
  }

  renderItem({ price, amount, state, id }) {
    const title = `${state.stateOf.fullName} ${state.fullName}`;
    const onPress = () => this.onOrderButtonPress(item);

    return (
      <PricingCard
        key={ `order-view-priceing-card-${id}` }
        color='#777777'
        title={title}
        price={`$${price.toFixed(2)}`}
        info={[`${amount.toFixed(2)} kg`, `GST $${(price * 0.15).toFixed(2)}`]}
        button={{ title: 'Rate', icon: 'star' }}
      />
    );
  }

  getOrder() {
    const supplierAccEdge = this.props.data.viewer.organisation.supplierAccounts.edges[0];
    if(!(supplierAccEdge && supplierAccEdge.node.currentOrder)) {
      return null;
    }
    const order = supplierAccEdge.node.currentOrder;
    return order;
  }

  renderItems() {
    const order = this.getOrder();
    if(!order) {
      return null;
    }
    return order.items.edges.map(e => e.node).map(i => this.renderItem(i));
  }

  renderStatusIcons({ cancelled, confirmed, seen }) {
    let cancelledIcon,
      confirmedIcon,
      seenIcon;

    const seenOn = (<Icon name="visibility" size={30} color="#98FB98" />);
    const seenOff = (<Icon name="visibility-off" size={30} color="#900" />);
    const confirmedOn = (<Icon name="airport-shuttle" size={30} color="#98FB98" />);
    const confirmedOff = (<Icon name="airport-shuttle" size={30} color="#900" />);
    const cancelledOn = (<Icon name="blocked" size={30} color="#ee0000" />);
    const cancelledOff = (<Icon name="blocked" size={30} color="#900" />);

    cancelledIcon = cancelled ? cancelledOn : cancelledOff;
    seenIcon = seen ? seenOn : seenOff;
    confirmedIcon = confirmed ? confirmedOn : confirmedOff;

    return (
      <View>

        { seenIcon }
        { cancelledIcon }
        { confirmedIcon }

      </View>
    )
  }

  renderTotalsList() {
    const items = this.getOrder().totals.map((t, i) => (
      <ListItem
        roundAvatar
        key={`totals Text ListItem ${i}`}
        title={t.state.stateOf.fullName}
        subtitle={`${t.state.fullName}    ${t.amount}kg    $${t.price.toFixed(2)}`}
        avatar={{uri:t.state.stateOf.image}}
        hideChevron={ true }
      />
    ));
    return (
      <List style={styles.totalsList}>
        { items }
      </List>
    );
  }

  renderTotalPrice() {
    const totalPrice = this.getOrder().totalPrice;
    const priceDesc = `total: $${totalPrice.toFixed(2)}`;
    const taxDesc = `GST: $${(totalPrice * 0.15).toFixed(2)}`;
    return [priceDesc, taxDesc].map((desc, i) => (
      <View
        key={`total-${desc}-${i}`}
        style={styles.totalsTextWrapper}
      >
        <Text style={styles.totalsText}>
          { desc }
        </Text>
      </View>
    ));
  }

  renderOrderStatus() {
    const order = this.getOrder();
    if(!order) {
      return null;
    }
    const totalsList = this.renderTotalsList();
    const totalPrice = this.renderTotalPrice();

    return (
      <Card
        title={'Current Order'}
      >
        { totalsList }
        { totalPrice }
      </Card>
    );
  }

  render() {
    if(!this.props.data.viewer) {
      return null;
    }
    const items = this.renderItems();
    const orderStatus = this.renderOrderStatus();
    const { width, height } = Dimensions.get('window');
    const fullScreen = { width, height };
    return (
      <ScrollView>
        { orderStatus }
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
        ${SupplierAccOrder}
      }
    }
  }
`, { options: { pollInterval: 4000 }})(ViewOrder);
