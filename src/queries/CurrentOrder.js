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
    items {
      id
      amount
      price
      updatedAt
      createdAt
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
`
