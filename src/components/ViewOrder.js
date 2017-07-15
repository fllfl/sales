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
import AddToOrderForm from './forms/AddToOrderForm';
import moment from 'moment';

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
    this.getOrders = this.getOrders.bind(this);
    this.renderOrderStatus = this.renderOrderStatus.bind(this);
  }

  renderItem(itemsState, i) {
    const {
      item_ids,
      price,
      productName,
      order_id,
      updatedAt,
      amount,
      stateName
    } = itemsState;

    console.log(itemsState);

    const title = `${productName}\n${stateName}`;
    const onPress = () => this.onOrderButtonPress(order_id, item_ids);
    const infos = [
      `Updated: ${updatedAt.fromNow()}`,
      `${amount.toFixed(2)} kg`,
      `GST $${(price * 0.15).toFixed(2)}`,
    ];
    return (
      <PricingCard
        key={ `order-view-priceing-card-${i}=${order_id}` }
        color='rgb(0, 204, 0)'
        title={title}
        price={`$${price.toFixed(2)}`}
        info={infos}
        button={{ title: 'Rate', icon: 'star' }}
      />
    );
  }

  getOrders() {
    if(!(this.props.data && this.props.data.viewer.organisation)){
      return [];
    }
    return this.props.data.viewer.organisation.supplierAccounts.filter(node => !!node.currentOrder).map(
        (acc) => acc.currentOrder);
  }

  renderItems() {
    const states = {};
    const items = [];
    const orders = this.getOrders();
    orders.forEach(order => {
      order.items.forEach(oi => {
        const key = `${oi.state.id}`;
        const updatedAt = moment(oi.updatedAt);
        if(!states[key]){
          states[key] = {
            order_id: order.id,
            amount: oi.amount,
            price: oi.price,
            itemsCount: 1,
            stateName: oi.state.fullName,
            productName: oi.state.stateOf.fullName,
            updatedAt: updatedAt,
            item_ids: [oi.id],
          };
        } else {
          const st = states[key];
          st.amount += oi.amount;
          st.items += 1;
          st.price += oi.price;
          if (st.updatedAt.isBefore(updatedAt)){
            st.updatedAt = updatedAt;
          }
          st.item_ids.push(oi.id);
        }
      });
    });
    Object.keys(states).forEach((k, i) => {
      items.push(this.renderItem(states[k], i));
    });
    return (
      <View>
        { items }
      </View>
    )
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

  renderTotalsListItem(state, total, i) {
    return (
      <ListItem
        roundAvatar
        key={`totals Text ListItem ${i}`}
        title={state.stateOf.fullName}
        subtitle={`${state.fullName}    ${total.amount}kg    $${total.price.toFixed(2)}`}
        avatar={{uri:state.stateOf.image}}
        hideChevron={ true }
      />
  );
  }

  renderTotalsList(order) {
    if(!order) {
      return null;
    }
    console.log(order.totals)
    const totals = order.totals.map((t, i) => this.renderTotalsListItem(t.state, t, i));
    return (
      <List style={styles.totalsList}>
        { totals }
      </List>
    );
  }

  renderTotalPrice(order) {
    const totalPrice = order.totalPrice;
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

  renderOrderStatus(order) {
    if(!order) {
      return null;
    }
    const totalsList = this.renderTotalsList(order);
    const totalPrice = this.renderTotalPrice(order);

    return (
      <Card
        key={ `order-status-${order.id}`}
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
    const orderStatus = this.getOrders().map(this.renderOrderStatus);
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
