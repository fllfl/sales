export default `
  currentOrder {
    id
    confirmed
    seen
    cancelled
    listing {
      id
      name
    }
    totals {
      price
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
    items(first: 99) {
      edges {
        node {
          id
          amount
          price
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
`
