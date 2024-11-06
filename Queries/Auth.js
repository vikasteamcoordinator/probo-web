// ** Graphql
import { gql } from "@apollo/client";

export const AUTH_REGISTER = gql`
  mutation ($email: String!, $password: String!) {
    authRegister(email: $email, password: $password) {
      status
      message
    }
  }
`;

export const AUTH_LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    authLogin(email: $email, password: $password) {
      status
      message
    }
  }
`;

export const LOGOUT = gql`
  mutation {
    logout {
      status
      message
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ($id: String!, $password: String!) {
    changeCustomerPassword(id: $id, password: $password) {
      status
      message
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ($email: String!) {
    forgotPassword(email: $email) {
      status
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ($password: String!, $token: String!) {
    updatePassword(password: $password, token: $token) {
      status
      message
    }
  }
`;

export const CHECK_RESET_TOKEN = gql`
  mutation ($token: String!) {
    checkResetToken(token: $token) {
      status
      message
    }
  }
`;
