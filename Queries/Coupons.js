// ** Graphql
import { gql } from "@apollo/client";

export const GET_COUPONS = gql`
  query {
    getCoupons {
      _id
      couponCode
      couponType
      discount
      limitPerUser
      maxValue
      minValue
      validFrom
      validTo
      isEnabled
    }
  }
`;

export const CHECK_COUPON = gql`
  mutation ($couponCode: String!, $cartValue: Float!) {
    checkCoupon(couponCode: $couponCode, cartValue: $cartValue) {
      couponCode
      discount
      status
      message
    }
  }
`;
