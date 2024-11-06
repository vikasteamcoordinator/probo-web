// ** Graphql
import { gql } from "@apollo/client";

export const GET_HOMEPAGE = gql`
  query {
    getHomepage {
      _id
      heroType
      heroImagesLarge
      heroImagesSmall
      heroHeading
      heroSubHeading
      heroBtnText
      heroLink
      heroCountdown
      heroCountdownText
      marquee
      marqueeText
      subHeroTitle
      subHeroImages
      subHeroHeading
      subHeroBtnText
      subHeroLink
      riskReducersImages
      riskReducersHeading
      riskReducersText
      spotlight1
      spotlight1Image
      spotlight1Link
      spotlight2
      spotlight2Image
      spotlight2Link
      categoryTitle
      categoryImages
      categoryHeading
      categoryText
      categoryLink
      newsletter
      newsletterHeading
      newsletterText
      newsletterBtnText
      newsletterSuccessHeading
      newsletterSuccessText
      trending
      trendingLimit
    }
  }
`;
