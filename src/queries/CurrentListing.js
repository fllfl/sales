export default `
  currentListing {
    id
    name
    items(first: 107) {
      edges {
        node {
          id
          price
          state {
            id
            fullName
            stateOf {
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
`
