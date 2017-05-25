export default `
  currentOrder {
    id
    confirmed
    seen
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
