// ** Graphql
import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation (
    $customer: orderCustomerInputType!
    $products: [orderProductInputType]!
    $appliedCoupon: String
    $couponDiscount: Int
    $paymentMethod: String!
    $paymentStatus: String!
    $deliveryStatus: String
    $mrp: Float!
    $taxes: Float!
    $totalAmount: Float!
    $shippingFees: String!
    $expectedDelivery: String!
  ) {
    createOrder(
      customer: $customer
      products: $products
      appliedCoupon: $appliedCoupon
      couponDiscount: $couponDiscount
      paymentMethod: $paymentMethod
      paymentStatus: $paymentStatus
      deliveryStatus: $deliveryStatus
      mrp: $mrp
      taxes: $taxes
      totalAmount: $totalAmount
      shippingFees: $shippingFees
      expectedDelivery: $expectedDelivery
    ) {
      _id
      customer {
        customerId
        name
        email
        phoneNumber
        address {
          address1
          address2
          city
          state
          country
          postal_code
        }
      }
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
      appliedCoupon
      couponDiscount
      paymentMethod
      paymentStatus
      deliveryStatus
      dateOfPurchase
      mrp
      taxes
      totalAmount
      shippingFees
      expectedDelivery
      status
      message
    }
  }
`;

export const GET_CUSTOMER_ORDERS = gql`
  mutation ($customerId: String!) {
    getOrdersByCustomer(customerId: $customerId) {
      _id
      customer {
        customerId
        name
        email
        phoneNumber
        address {
          address1
          address2
          city
          state
          country
          postal_code
        }
      }
      products {
        product {
          _id
          title
          images
          salePrice
          inStock
          tax
        }
        variant
        variantName
        quantity
      }
      appliedCoupon
      couponDiscount
      paymentMethod
      paymentStatus
      deliveryStatus
      dateOfPurchase
      mrp
      taxes
      totalAmount
      shippingFees
      expectedDelivery
      status
      message
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  mutation ($id: String!) {
    getOrderById(id: $id) {
      _id
      customer {
        customerId
        name
        email
        phoneNumber
        address {
          address1
          address2
          city
          state
          country
          postal_code
        }
      }
      products {
        product {
          _id
          title
          images
          salePrice
          inStock
          tax
        }
        variant
        variantName
        quantity
      }
      appliedCoupon
      couponDiscount
      paymentMethod
      paymentStatus
      deliveryStatus
      dateOfPurchase
      mrp
      taxes
      totalAmount
      shippingFees
      expectedDelivery
      status
      message
    }
  }
`;
