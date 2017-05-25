import Relay from 'react-relay';

class SubmitOrderMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { submitOrder }`;
  }

  getVariables() {
    return { id: this.props.id };
  }

  getOptimisticResponse() {
    return {
      order: {
        id: this.props.id,
        submitted: true,
      }
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SubmitOrderPayload {
        order
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        order: this.props.id,
      },
    }];
  }
}

export default SubmitOrderMutation;
