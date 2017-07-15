import CurrentListing from './CurrentListing';
import CurrentOrder from './CurrentOrder';
export default `
  supplierAccounts {
    id
    name
    ${CurrentOrder}
    customerGroup {
      id
      organisation {
        id
        name
      }
      ${CurrentListing}
    }
  }`;
