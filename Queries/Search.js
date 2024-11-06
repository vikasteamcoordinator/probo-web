// ** Graphql
import { gql } from "@apollo/client";

export const GET_SEARCH_RESULTS = gql`
  query ($searchTerm: String!) {
    getSearchResults(searchTerm: $searchTerm) {
      _id
      title
      desc
      category
      images
      regularPrice
      salePrice
      totalStocks
      inStock
      productType
      variantsOptions {
        name
        options {
          value
          meta
        }
      }
      variants {
        _id
        variantName
        variantsId
        images
        regularPrice
        salePrice
        tax
        totalStocks
        inStock
      }
      reviews {
        customer {
          firstName
          lastName
        }
        orderId
        rating
        comment
        media
      }
      trending
    }
  }
`;
