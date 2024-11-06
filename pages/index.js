// ** Next, React And Locals Imports
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { GET_HOMEPAGE } from "@/Queries/Homepage.js";
import { GET_PRODUCT_SETTINGS } from "@/Queries/ProductSettings.js";
import { GET_PRODUCTS } from "@/Queries/Products.js";
import { getHomepage } from "@/Redux/slices/homepage.js";
import { getProductSettings } from "@/Redux/slices/productSettings.js";
import { getProducts } from "@/Redux/slices/products.js";
import Hero from "@/Components/Home/Hero/Hero";
import Marquee from "@/Components/Home/Marquee/Marquee";
import SubHero from "@/Components/Home/SubHero/SubHero";
import Products from "@/Components/Products/Cards";
import RiskReducers from "@/Components/Home/RiskReducers/RiskReducers";
import Spotlight from "@/Components/Home/Spotlight/Spotlight";
import ShopByCategory from "@/Components/Home/ShopByCategory/ShopByCategory";
import Newsletter from "@/Components/Home/Newsletter/Newsletter";
import TrendingProducts from "@/Components/Home/TrendingProducts/TrendingProducts";
import CookieConsent from "@/Components/Home/CookieConsent/CookieConsent";
import Seo from "@/Components/Seo/Seo";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** Third Party Imports
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";

export default function HomePage() {
  const dispatch = useDispatch();

  //Translation
  const { t } = useTranslation();

  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "home";
  });

  // Queries
  const { data: homepageQuery, loading: homepageLoading } =
    useQuery(GET_HOMEPAGE);

  const productSettingsQuery = useQuery(GET_PRODUCT_SETTINGS);

  const { data: productsQuery, loading: productsLoading } = useQuery(
    GET_PRODUCTS,
    {
      variables: { page: 0, limit: 8 },
    }
  );

  useEffect(() => {
    const homepageData = homepageQuery?.getHomepage;
    const productSettingsData = productSettingsQuery?.data?.getProductSettings;
    const productsData = productsQuery?.getProducts.products;

    if (homepageData) {
      dispatch(getHomepage(homepageData));
    }

    if (productSettingsData) {
      dispatch(getProductSettings(productSettingsData));
    }

    if (productsData) {
      dispatch(getProducts(productsData));
    }
  }, [homepageQuery, productsQuery, productsQuery]);

  // Homepage, product settings & products
  const homepage = useSelector((state) => state.homepage.homepage);

  const productSettings = useSelector(
    (state) => state.productSettings.productSettings
  );

  const products = useSelector((state) => state.products.products);

  return (
    <div>
      <Seo title={titleDesc?.title} desc={titleDesc?.desc} />
      <Hero settings={homepage} loading={homepageLoading} />
      <Marquee settings={homepage} loading={homepageLoading} />
      <SubHero settings={homepage} loading={homepageLoading} />
      <Products
        products={products}
        productSettings={productSettings}
        title={t("home.products.title")}
        loading={productsLoading}
        totalLoadingCount={8}
      />
      <RiskReducers settings={homepage} loading={homepageLoading} />
      <Spotlight
        spotlight="spotlight1"
        settings={homepage}
        loading={homepageLoading}
      />
      <ShopByCategory settings={homepage} loading={homepageLoading} />
      <Spotlight
        spotlight="spotlight2"
        settings={homepage}
        loading={homepageLoading}
      />
      <Newsletter settings={homepage} />
      <TrendingProducts settings={homepage} products={products} />
      <CookieConsent />
    </div>
  );
}

export { getServerSideProps };
