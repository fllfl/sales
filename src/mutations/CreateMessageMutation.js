import Relay from 'react-relay';

class CreateMessageMutation extends Relay.Mutation {

  constructor(props){
    super(props);
  }

  getMutation() {
    return Relay.QL`mutation { createMessage }`;
  }

  getVariables() {
    return {
      text: this.props.text,
      messageThread_id: this.props.messageThread_id,
      organisation_id: this.props.organisation_id,
      image: this.props.image
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateMessagePayload {
        messageThread {
          id
          messages(first: 200) {
            edges {
              node {
                id
                text
                created
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

export default CreateMessageMutation;
