// ** Graphql
import { gql } from "@apollo/client";

export const GET_SHIPPING_FEES = gql`
  query {
    getShipping {
      _id
      fees
      minValue
      expectedDelivery
    }
  }
`;
