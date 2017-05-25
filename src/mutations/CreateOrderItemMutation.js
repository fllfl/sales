import Relay from 'react-relay';

class CreateOrderItemMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { createOrderItem }`;
  }

  getVariables() {
    return {
      order_id: this.props.order.id,
      state_id: this.props.stateId,
      price: this.props.price,
      amount: this.props.amount,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateOrderItemPayload {
        order {
          items(first: 123) {
            edges {
              node {
                id
                amount
                price
                state {
                  id
                  code
                  fullName
                  stateOf {
                    fullName
                  }
                }
              }
            }
          }
        }
      }
    `;
  }



  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        order: this.props.order.id
      },
    }];
  }
}

export default CreateOrderItemMutation;
