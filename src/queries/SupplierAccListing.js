import CurrentListing from './CurrentListing';
import CurrentOrder from './CurrentOrder';
export default `
  supplierAccounts(first: 99) {
    edges {
      node {
        id
        ${CurrentOrder}
        customerGroup {
          id
          ${CurrentListing}
        }
      }
    }
  }`;
