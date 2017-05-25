import Relay from 'react-relay';

class SeenMessageMutation extends Relay.Mutation {

  constructor(props){
    super(props);
  }

  getMutation() {
    return Relay.QL`mutation { seenMessage }`;
  }

  getVariables() {
    return {
      messageThread_id: this.props.messageThread_id,
      organisation_id: this.props.organisation_id,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on SeenMessagePayload {
        messageThread {
          id
          messages(first: 200) {
            edges {
              node {
                id
                text
                createdBy {
                  id
                }
                image
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
        messageThread: this.props.messageThread_id,
      },
    }];
  }
}

export default SeenMessageMutation;
