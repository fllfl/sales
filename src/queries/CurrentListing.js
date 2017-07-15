export default `
  currentListing {
    id
    name
    items {
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
`
