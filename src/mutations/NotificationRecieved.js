import Relay from 'react-relay';

class NotificationRecieved extends Relay.Mutation {

  constructor(props){
    super(props);
  }

  getMutation() {
    return Relay.QL`mutation { NotificationRecieved }`;
  }

  getVariables() {
    return {
    };
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        organisation: this.props.organisation.id,
      },
    }];
  }

  getFatQuery() {
    return Relay.QL`
      fragment on NotificationRecievedPayload {
        organisation {
          id
          supplierAccounts(first: 99) {
            edges {
              node {
                id
                orders(last:6) {
                  edges {
                    node {
                      id
                      submitted
                      seen
                      confirmed
                      cancelled
                      received
                      listing {
                        id
                        name
                      }
                      items(first: 99) {
                          edges {
                            node {
                              id
                              amount
                              state {
                                id
                                fullName
                                stateOf {
                                  id
                                  fullName
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                }
                messageThread {
                  id
                  messages(first: 200) {
                    edges {
                      node {
                        id
                        createdBy {
                          id
                          name
                        }
                        text
                        created
                        image
                      }
                    }
                  }
                }
                currentOrder {
                  id
                  submitted
                  seen
                  confirmed
                  cancelled
                  received
                  listing {
                    id
                    name
                  }
                  items(first: 99) {
                    edges {
                      node {
                        id
                        amount
                        state {
                          id
                          fullName
                          stateOf {
                            id
                            fullName
                          }
                        }
                      }
                    }
                  }
                }
                customerGroup {
                  id
                  customers(first: 20) {
                    edges {
                      node {
                        id
                        name
                        messageThread {
                          id
                          messages(first: 200) {
                            edges {
                              node {
                                id
                                createdBy {
                                  id
                                }
                                text
                                created
                                image
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  currentListing{
                    id
                    name
                    items(first: 107){
                      edges{
                        node{
                          id
                          price
                          state{
                            id
                            fullName
                            stateOf{
                              id
                              image
                              description
                              otherNames
                              kgPerBin
                              code
                              fullName
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  }
}

export default NotificationRecieved;
