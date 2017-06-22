export default `
  currentOrder {
    id
    confirmed
    seen
    cancelled
    totalPrice
    totals {
      price
      amount
      state {
        id
        fullName
        stateOf {
          id
          fullName
          image
        }
      }
    }
    listing {
      id
      name
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
              image
            }
          }
        }
      }
    }
  }
`
