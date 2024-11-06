// ** Graphql
import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query (
    $page: Int!
    $limit: Int!
    $category: [String]
    $priceRange: [String]
    $trending: Boolean
    $inStock: Boolean
    $sortBy: String
  ) {
    getProducts(
      page: $page
      limit: $limit
      category: $category
      priceRange: $priceRange
      trending: $trending
      inStock: $inStock
      sortBy: $sortBy
    ) {
      totalCount
      products {
        _id
        title
        desc
        category
        productType
        images
        regularPrice
        salePrice
        tax
        totalStocks
        inStock
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
  }
`;

export const GET_PRODUCTS_BY_IDS = gql`
  mutation ($ids: [String]!) {
    getProductsByIds(ids: $ids) {
      _id
      title
      desc
      category
      productType
      images
      regularPrice
      salePrice
      tax
      totalStocks
      inStock
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

export const GET_PRODUCTS_BY_CATEGORY = gql`
  mutation ($category: String!) {
    getProductsByCategory(category: $category) {
      _id
      title
      desc
      category
      productType
      images
      regularPrice
      salePrice
      tax
      totalStocks
      inStock
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

export const ADD_PRODUCT_REVIEW = gql`
  mutation ($productId: String!, $review: reviewsInputType!) {
    addProductReview(productId: $productId, review: $review) {
      status
      message
    }
  }
`;
