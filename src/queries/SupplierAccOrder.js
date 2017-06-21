import CurrentOrder from './CurrentOrder';
import CurrentListing from './CurrentListing';
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
