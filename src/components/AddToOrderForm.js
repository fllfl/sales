import React, { Component } from 'react';
import {
  Text,
  Dimensions,
  View,
} from 'react-native';
import { Card, Button, Slider, FormInput, FormLabel } from 'react-native-elements'
import {  gql, graphql } from 'react-apollo';

const styles = {
  cardText: {
    marginBottom: 10,
    fontWeight: '700',
  },
  buyButtonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  },
  container: {
    position: 'absolute',
    backgroundColor: 'white'
  },
  spacer: {
    height: 15,
  }
}

class AddToOrderForm extends Component {

  constructor() {
    super();
    this.state = {
      amount: 1,
    }
    this.amountChange = this.amountChange.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
  }

  amountChange(amount) {
    this.setState({amount: amount })
  }

  getPrice() {
    const price = this.state.amount * this.props.item.price;
    const tax = price * 0.15;
    const total = tax + price;
    return { total, tax, price };
  }

  addToOrder() {
    console.log(this.props);

    this.props.mutate({
      variables: {
        input: {
          state_id: this.props.item.state.id,
          amount: this.state.amount,
          price: this.getPrice().price,
          order_id: this.props.order.id,
        },
      }
    }).then(({ data }) => {
        console.log('got data', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
    this.props.goBack();
  }

  render() {
    const { width, height } = Dimensions.get('window');
    const size = { width: width - 30, height: height - 80 }
    const { item, order } = this.props;
    const { total, tax, price } = this.getPrice();
    const description = `
      Adding ${this.state.amount.toFixed(2)} kg of ${item.state.stateOf.fullName}

      Price $${price.toFixed(2)}
      GST 15% $${tax.toFixed(2)}

      Total: $${total.toFixed(2)}
    `;
    return (
      <Card
        containerStyle={[styles.container, size ]}
        key={ `add-to-order-form-card-${item.id}` }
        title={ `Add ${item.state.fullName} ${item.state.stateOf.fullName} to Order`}
        image={ { uri: item.state.stateOf.image } }
        wrapperStyle={ [{ backgroundColor: 'white' }, size]}
      >
        <Text style={ styles.cardText }>
          { description }
        </Text>
        <View style={styles.spacer} />
        <Slider
          minimumValue={0.5}
          maximumValue={10}
          step={0.5}
          value={this.state.amount}
          onValueChange={this.amountChange}
        />
        <View style={styles.spacer} />
        <Button
          icon={{name: 'skip-next'}}
          backgroundColor='#03A9F4'
          buttonStyle={styles.buyButtonStyle}
          onPress={this.addToOrder}
          title='ADD TO ORDER' />
        <View style={styles.spacer} />
        <Button
          icon={{name: 'skip-next'}}
          backgroundColor='#ff9900'
          onPress={this.props.goBack}
          buttonStyle={styles.buyButtonStyle}
          title='BACK' />
      </Card>
    );
  }

}


const CreateOrderItemMutation = gql`
  mutation createOrderItem($input: CreateOrderItemInput!) {
    createOrderItem(input: $input) {
      order {
        id
        items {
          edges {
            node {
              id
              amount
              price
              state {
                id
              }
            }
          }
        }
      }
    }
  }
`;


export default graphql(CreateOrderItemMutation)(AddToOrderForm);
