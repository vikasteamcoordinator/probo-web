// ** Next, React And Locals Imports
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { GET_CUSTOMER, CUSTOMERS } from "@/Queries/Customers.js";
import { GET_PRODUCT_SETTINGS } from "@/Queries/ProductSettings.js";
import { getProductSettings } from "@/Redux/slices/productSettings";
import { getCustomer } from "@/Redux/slices/customer.js";
import Cards from "@/Components/Products/Cards";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import Seo from "@/Components/Seo/Seo";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import useStyles from "@/styles/wishlist.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";

export default function Wishlist() {
  const dispatch = useDispatch();
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "home";
  });

  // Queries
  const { data: customerQuery, loading } = useQuery(GET_CUSTOMER);
  const productSettingsQuery = useQuery(GET_PRODUCT_SETTINGS);

  useEffect(() => {
    const customerData = customerQuery?.getCustomer;
    const productSettings = productSettingsQuery?.data?.getProductSettings;

    if (customerData) {
      dispatch(getCustomer(customerData));
    }

    if (productSettings) {
      dispatch(getProductSettings(productSettings));
    }
  }, [customerQuery, productSettingsQuery]);

  // Wishlisted products & product settings
  const customer = useSelector((state) => state.customer.customer);
  const products = customer.wishlist;

  const productSettings = useSelector(
    (state) => state.productSettings.productSettings
  );

  // Remove product from wishlist
  const handleRemove = (id) => {
    const productIds = [];

    products.map((product) => productIds.push(product._id));

    const filteredWishlist = productIds.filter((productId) => {
      return productId !== id;
    });

    const valuesObject = {
      id: customer._id,
      email: customer.email,
      wishlist: filteredWishlist,
    };

    updateUser({ variables: valuesObject });
  };

  const [updateUser] = useMutation(CUSTOMERS, {
    onCompleted(data) {
      if (data.customers.status === 200) {
        dispatch(getCustomer(data.customers));
        ToastStatus("Success", "Removed from wishlist");
      } else {
        ToastStatus("Error", "Error Occurred");
      }
    },
  });

  return (
    <div className={classes.container}>
      <Seo title={"Wishlist"} desc={titleDesc?.desc} />
      <Toaster />
      <div>
        <Typography variant="h4">
          {products?.length > 0 && (
            <>
              {t("account.wishlist.title") +
                " ( " +
                products?.length +
                " " +
                t("account.wishlist.itemsText") +
                " ) "}
            </>
          )}
        </Typography>
        <div className={classes.products}>
          <Cards
            products={products}
            productSettings={productSettings}
            isWishlist={handleRemove}
          />
        </div>
      </div>
      {!products?.length > 0 && !loading && (
        <div className={classes.noItems}>
          <Typography variant="h3" sx={{ pb: 4 }}>
            {t("account.wishlist.noItems")}
          </Typography>
          <Typography variant="subtitle1" sx={{ pb: 3 }}>
            {t("account.wishlist.noItemsContent")}
          </Typography>
          <PrimaryButton href="/shop" text={t("account.wishlist.browse")} />
        </div>
      )}
    </div>
  );
}

export { getServerSideProps };
