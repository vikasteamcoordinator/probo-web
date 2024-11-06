// ** Graphql
import { gql } from "@apollo/client";

export const GET_SITE_SETTINGS = gql`
  query {
    getSiteSettings {
      _id
      logo
      favicon
      topbar
      topbarContent
      topbarStyle
      headerLayout
      footerLayout
      socials
      paymentMethods
      customerViews
      customerViewsNos
      customerViewsTimer
      soldInLast
      soldInLastProducts
      soldInLastHours
      countdown
      countdownText
      countdownTimer
      hotStock
      hotStockInventoryLevel
    }
  }
`;
