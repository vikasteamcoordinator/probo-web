// ** Graphql
import { gql } from "@apollo/client";

export const GET_CART = gql`
  query ($customerId: String) {
    getCart(customerId: $customerId) {
      _id
      customerId
      products {
        product {
          _id
          title
          images
          salePrice
          tax
          inStock
        }
        variant
        variantName
        quantity
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation (
    $customerId: String
    $productId: String!
    $variantId: String
    $variantName: String
  ) {
    addToCart(
      customerId: $customerId
      productId: $productId
      variantId: $variantId
      variantName: $variantName
    ) {
      _id
      customerId
      products {
        product {
          _id
          title
          images
          salePrice
          tax
          inStock
        }
        variant
        variantName
        quantity
      }
      customerId
      status
      message
    }
  }
`;

export const CHANGE_CART_QUANTITY = gql`
  mutation (
    $customerId: String
    $productId: String!
    $action: String!
    $variantId: String
  ) {
    changeCartQuantity(
      customerId: $customerId
      productId: $productId
      action: $action
      variantId: $variantId
    ) {
      _id
      customerId
      products {
        product {
          _id
          title
          images
          salePrice
          tax
          inStock
        }
        variant
        variantName
        quantity
      }
      status
      message
    }
  }
`;

export const DELETE_FROM_CART = gql`
  mutation ($customerId: String, $productId: String!, $variantId: String) {
    deleteFromCart(
      customerId: $customerId
      productId: $productId
      variantId: $variantId
    ) {
      _id
      customerId
      products {
        product {
          _id
          title
          images
          salePrice
          tax
          inStock
        }
        variant
        variantName
        quantity
      }
      status
      message
    }
  }
`;
