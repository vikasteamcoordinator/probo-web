// ** Graphql
import { gql } from "@apollo/client";

export const GET_SEO_TITLE_DESCS = gql`
  query {
    getSeoTitleDescs {
      _id
      pageName
      title
      desc
    }
  }
`;
