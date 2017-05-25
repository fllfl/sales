import Relay from 'react-relay';

class UpdateOrderItemMutation extends Relay.Mutation {
  constructor(props){
    super(props);
  }

  getMutation() {
    return Relay.QL`mutation { updateOrderItem }`;
  }

  getVariables() {
    return {
      amount: this.props.amount,
      id: this.props.id
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateOrderItemPayload {
        orderItem
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        orderItem: this.props.id
      },
    }];
  }
}

export default UpdateOrderItemMutation;
