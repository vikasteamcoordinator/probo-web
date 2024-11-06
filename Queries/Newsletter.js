// ** Graphql
import { gql } from "@apollo/client";

export const ADD_TO_NEWSLETTER = gql`
  mutation ($email: String!) {
    newsletter(email: $email) {
      status
      message
    }
  }
`;
