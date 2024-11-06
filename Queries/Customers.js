// ** Graphql
import { gql } from "@apollo/client";

export const GET_CUSTOMER = gql`
  query {
    getCustomer {
      _id
      firstName
      lastName
      avatar
      email
      phoneNumber
      gender
      dob
      address {
        address1
        address2
        city
        state
        country
        postal_code
      }
      wishlist {
        _id
        title
        images
        regularPrice
        salePrice
        productType
        variantsOptions {
          name
          options {
            variantId
            value
            meta
          }
        }
        variants {
          _id
          variantsId
          images
          regularPrice
          salePrice
        }
        trending
      }
      stripeCusId
      customerStatus
      status
      message
    }
  }
`;

export const CUSTOMERS = gql`
  mutation (
    $id: String!
    $firstName: String
    $lastName: String
    $avatar: String
    $email: String!
    $phoneNumber: String
    $gender: String
    $dob: String
    $address: addressInputType
    $wishlist: [String]
    $stripeCusId: String
  ) {
    customers(
      id: $id
      firstName: $firstName
      lastName: $lastName
      avatar: $avatar
      email: $email
      phoneNumber: $phoneNumber
      gender: $gender
      dob: $dob
      address: $address
      wishlist: $wishlist
      stripeCusId: $stripeCusId
    ) {
      _id
      firstName
      lastName
      avatar
      email
      phoneNumber
      gender
      dob
      wishlist {
        _id
        title
        images
        regularPrice
        salePrice
        productType
        variantsOptions {
          name
          options {
            variantId
            value
            meta
          }
        }
        variants {
          _id
          variantsId
          images
          regularPrice
          salePrice
        }
        trending
      }
      address {
        address1
        address2
        city
        state
        country
        postal_code
      }
      stripeCusId
      status
      message
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation ($productId: String!) {
    addToWishlist(productId: $productId) {
      status
      message
    }
  }
`;
