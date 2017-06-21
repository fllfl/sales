import React, { Component } from 'react';
import {
  ScrollView,
  Dimensions,
  Text,
  View,
  Image,
} from 'react-native';
import { PricingCard, ListItem, Button, Tile } from 'react-native-elements'
import {  gql, graphql } from 'react-apollo';
import SupplierAccOrder from '../queries/SupplierAccOrder';
import AddToOrderForm from './AddToOrderForm';

const styles = {
  cardText: {
    marginBottom: 10
  },
  cardImage: {
    backgroundColor: '#fff',
  },
  buyButtonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  totalsText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  renderOrderStatus() {
    const order = this.getOrder();
    if(!order) {
      return null;
    }
    const { id, name, listing, totals } = order;
    const totalsText = totals.map((t) => {
      console.log("T", t)
      const name = `${t.state.stateOf.fullName} - ${t.state.fullName}`;
      const totalText = `${t.amount}kg $${t.price} inc GST $${(t.price * 0.15).toFixed(2)}`;
      return (
        <View style={styles.totalItem}>
          <Text>{ name }</Text>
          <Text>{ totalText }</Text>
        </View>
      );
    });
    return (
      <Tile
        imageSrc={{require: ('./images/logo.jpg')}}
        title={ 'Current Order' }
        contentContainerStyle={{height: 70}}
      >
        <View style={styles.totalsText}>
          { totalsText }
        </View>
      </Tile>
    );
  }

  render() {
    if(!this.props.data.viewer) {
      return null;
    }
    const items = this.renderItems();
    const orderStatus = this.renderOrderStatus();
    return (
      <View>
        { orderStatus }
        <ScrollView>

          { items }
        </ScrollView>
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
        ${SupplierAccOrder}
      }
    }
  }
`, { options: { pollInterval: 4000 }})(ViewOrder);
