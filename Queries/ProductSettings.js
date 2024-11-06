// ** Graphql
import { gql } from "@apollo/client";

export const GET_PRODUCT_SETTINGS = gql`
  query {
    getProductSettings {
      _id
      categories
      variants {
        name
        options {
          value
          meta
        }
      }
      productCardType
    }
  }
`;
