// ** Next, React And Locals Imports
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { GET_PRODUCT_SETTINGS } from "@/Queries/ProductSettings.js";
import { GET_SEARCH_RESULTS } from "@/Queries/Search.js";
import { getProductSettings } from "@/Redux/slices/productSettings.js";
import { getProducts } from "@/Redux/slices/products.js";
import Seo from "@/Components/Seo/Seo";
import Products from "@/Components/Products/Cards";
import useStyles from "@/styles/search.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";

export default function Search() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Search query
  const searchQuery = router.query.query;

  // Queries
  const { data: productsQuery, loading } = useQuery(GET_SEARCH_RESULTS, {
    variables: { searchTerm: searchQuery },
  });

  const productSettingsQuery = useQuery(GET_PRODUCT_SETTINGS);

  useEffect(() => {
    const productsData = productsQuery?.getSearchResults;
    const productSettingsData = productSettingsQuery?.data?.getProductSettings;

    if (productSettingsData) {
      dispatch(getProductSettings(productSettingsData));
    }

    if (productsData) {
      dispatch(getProducts(productsData));
    }
  }, [productsQuery, productSettingsQuery]);

  // Products & product settings
  const products = useSelector((state) => state.products.products);

  const productSettings = useSelector(
    (state) => state.productSettings.productSettings
  );

  return (
    <div>
      <Seo title={"Search"} />
      {productsQuery?.getSearchResults?.length === 0 && (
        <Typography variant="h4" align="center" sx={{ mt: 5 }}>{`${
          productsQuery?.getSearchResults?.length
        } ${t("search.results")}`}</Typography>
      )}
      <div className={classes.searchCtn}>
        <Products
          products={products}
          productSettings={productSettings}
          loading={loading}
          totalLoadingCount={8}
          title={`${productsQuery?.getSearchResults?.length} ${t(
            "search.results"
          )}`}
        />
      </div>
    </div>
  );
}

export { getServerSideProps };
