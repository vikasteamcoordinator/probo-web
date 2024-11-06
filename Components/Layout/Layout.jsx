// ** Next, React And Locals Imports
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_SITE_SETTINGS } from "@/Queries/SiteSettings.js";
import { GET_PRODUCT_SETTINGS } from "@/Queries/ProductSettings.js";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { getSiteSettings } from "@/Redux/slices/siteSettings.js";
import { getProductSettings } from "@/Redux/slices/productSettings.js";
import Topbar from "./Topbar/Topbar";
import Header from "./Header/Header";
import BottomNav from "./BottomNav/BottomNav";
import Footer from "./Footer/Footer";

// ** Third Party Imports
import { useQuery } from "@apollo/client";

function Layout({ page, isAuth }) {
  const dispatch = useDispatch();

  // Seo
  const seoTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const seoTitleDescData = seoTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = seoTitleDescData?.find((item) => {
    return item.pageName === "home";
  });

  // Queries
  const siteSettingsQuery = useQuery(GET_SITE_SETTINGS);

  const productSettingsQuery = useQuery(GET_PRODUCT_SETTINGS);

  const siteSettingsData = siteSettingsQuery?.data?.getSiteSettings;
  const productSettingsData = productSettingsQuery?.data?.getProductSettings;

  useEffect(() => {
    if (siteSettingsData && productSettingsData) {
      dispatch(getSiteSettings(siteSettingsData));
      dispatch(getProductSettings(productSettingsData));
    }
  }, [dispatch, siteSettingsData, productSettingsData]);

  // Sitesettings
  const siteSettings = useSelector((state) => state.siteSettings.siteSettings);

  // Product settings
  const productSettings = useSelector(
    (state) => state.productSettings.productSettings
  );

  return (
    <div>
      {siteSettings?.topbar && <Topbar settings={siteSettings} />}
      <Header
        settings={siteSettings}
        productSettings={productSettings}
        isAuth={isAuth}
      />
      {page}
      <BottomNav productSettings={productSettings} />
      <Footer
        settings={siteSettings}
        productSettings={productSettings}
        desc={titleDesc?.desc}
      />
    </div>
  );
}

export default Layout;
