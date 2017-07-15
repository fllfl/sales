import CurrentOrder from './CurrentOrder';
import CurrentListing from './CurrentListing';
export default `
  supplierAccounts {
    id
    name
    ${CurrentOrder}
    customerGroup {
      id
      name
      organisation {
        id
        name
      }
      ${CurrentListing}
    }
  }`;
