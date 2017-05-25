import Relay from 'react-relay';

class SetUserDeviceId extends Relay.Mutation {

  constructor(props){
    super(props);
  }

  getMutation() {
    return Relay.QL`mutation { SetUserDeviceId }`;
  }

  getVariables() {
    return {
      deviceId: this.props.deviceId,
      user_id: this.props.user_id,
      pushToken:  this.props.pushToken,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SetUserDeviceIdPayload {
        user {
          id
        }
      }
    `;
  }

  getConfigs() {
    return [];
  }
}

export default SetUserDeviceId;
