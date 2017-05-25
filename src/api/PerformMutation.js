

performMutation(mutation, onSuccess, onFailure) {
    Relay.Store.commitUpdate(mutation,
      { onSuccess,
        onFailure
      });
  }
