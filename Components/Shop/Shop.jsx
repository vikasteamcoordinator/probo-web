// ** Next, React And Locals Imports
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_PRODUCTS } from "@/Queries/Products.js";
import { GET_PRODUCT_SETTINGS } from "@/Queries/ProductSettings.js";
import { getProductSettings } from "@/Redux/slices/productSettings.js";
import { getProducts } from "@/Redux/slices/products.js";
import Cards from "@/Components/Products/Cards";
import SortingPanel from "./SortingPanel";
import Filters from "./Filters";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// ** Third Party Imports
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";

function Shop({ pathname }) {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  //Translation
  const { t } = useTranslation();

  // Infinite scroll
  const sentinelRef = useRef(null);

  // States
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [category, setCategory] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  const [trending, setTrending] = useState(null);
  const [inStock, setInStock] = useState(null);
  const [filterMenu, setFilterMenu] = useState(null);

  // Queries
  const {
    loading,
    error,
    data: productsData,
    fetchMore,
  } = useQuery(GET_PRODUCTS, {
    variables: {
      page: 0,
      limit: 8,
      category,
      priceRange,
      trending,
      inStock,
      sortBy,
    },
    fetchPolicy: "network-only",
  });

  const productSettingsQuery = useQuery(GET_PRODUCT_SETTINGS);

  // Products & product settings
  const products = useSelector((state) => state.products.products);

  const productSettings = useSelector(
    (state) => state.productSettings.productSettings
  );

  // Setting category for category page
  useEffect(() => {
    if (pathname) {
      setCategory(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    const productSettingsData = productSettingsQuery?.data?.getProductSettings;

    if (productSettingsData) {
      dispatch(getProductSettings(productSettingsData));
    }

    if (!loading && productsData) {
      dispatch(getProducts([...productsData.getProducts?.products]));
      setTotalCount(productsData.getProducts.totalCount);
    }
  }, [loading, productsData, productSettingsQuery]);

  // Infinite scroll
  useEffect(() => {
    const handleIntersection = (entries) => {
      const target = entries[0];

      if (target.isIntersecting && products?.length !== totalCount) {
        // Reached the threshold, load more products
        setIsLoading(true);
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 1.0, // Trigger when the entire target is visible
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [sentinelRef, products, totalCount]);

  useEffect(() => {
    if (isLoading) {
      fetchMore({
        variables: {
          page,
          limit: 8,
          category,
          priceRange,
          trending,
          inStock,
          sortBy,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            getProducts: {
              ...prev.getProducts,
              products: [
                ...prev.getProducts.products,
                ...fetchMoreResult.getProducts.products,
              ],
            },
          };
        },
      }).then(() => {
        setIsLoading(false);
      });
    }
  }, [isLoading, fetchMore, page]);

  // To handle sorting
  const handleSortBy = (value) => {
    setSortBy(value);
    setPage(0);
  };

  // To handle filters
  const handleFilters = (category, priceRange, trending, inStock) => {
    setCategory(category);
    setPriceRange(priceRange);
    setTrending(trending);
    setInStock(inStock);
    setPage(0);
  };

  // To handle filter menu (smaller screens)
  const handleFilterMenu = () => {
    setFilterMenu(!filterMenu);
  };

  return (
    <div>
      <div className={classes.intro}>
        <div className={classes.content}>
          <Typography variant="h1">{t("shop.title")}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {t("shop.content")}
          </Typography>
        </div>
      </div>
      <SortingPanel
        handleSortBy={handleSortBy}
        totalCount={totalCount}
        handleFilterMenu={handleFilterMenu}
      />
      <div className={classes.productsContainer}>
        <Filters
          handleFilters={handleFilters}
          handleFilterMenu={handleFilterMenu}
          filterMenu={filterMenu}
          productSettings={productSettings}
          pathname={pathname}
        />
        <div>
          <Cards
            products={products}
            productSettings={productSettings}
            loading={loading || isLoading}
          />
          {!loading && products?.length == 0 && (
            <Typography variant="subtitle1" align="center" sx={{ mt: 15 }}>
              {t("shop.items.empty")}
            </Typography>
          )}
          {/* Showing the loader while fetching products */}
          {(loading || isLoading) && (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <CircularProgress color="primary" size={20} />
            </div>
          )}
        </div>
      </div>
      {/* Add a sentinel element at the end */}
      <div ref={sentinelRef} style={{ height: "100px" }} />
    </div>
  );
}

export default Shop;
