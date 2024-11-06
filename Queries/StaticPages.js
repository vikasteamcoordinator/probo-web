// ** Graphql
import { gql } from "@apollo/client";

export const GET_STATIC_PAGES = gql`
  query {
    getStaticPages {
      _id
      pageName
      pageContent
    }
  }
`;
