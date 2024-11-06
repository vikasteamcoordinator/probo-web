// ** Next, React And Locals Imports
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_IDS,
} from "@/Queries/Products.js";
import { GET_SHIPPING_FEES } from "@/Queries/Shipping.js";
import { GET_PRODUCT_SETTINGS } from "@/Queries/ProductSettings.js";
import { GET_STATIC_PAGES } from "@/Queries/StaticPages.js";
import { ADD_TO_CART } from "@/Queries/Cart.js";
import { ADD_TO_WISHLIST } from "@/Queries/Customers.js";
import { getShipping } from "@/Redux/slices/shipping.js";
import { getProductSettings } from "@/Redux/slices/productSettings.js";
import { getCart } from "@/Redux/slices/cart.js";
import CapitalizeText from "@/Helpers/CapitalizeText";
import DiscountCalculator from "@/Helpers/DiscountCalculator.js";
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import GetProductDetails from "@/Helpers/GetProductDetails";
import Cart from "@/Components/Cart/Cart";
import BreadcrumbsBar from "@/Components/Product/BreadcrumbsBar";
import FloatingCart from "@/Components/Product/FloatingCart";
import Reviews from "@/Components/Product/Reviews";
import Share from "@/Components/Product/Share";
import ProductGallery from "@/Components/Product/ProductGallery";
import CustomersViews from "@/Components/BoostConversion/CustomersViews/CustomersViews";
import SoldInLast from "@/Components/BoostConversion/SoldInLast/SoldInLast";
import CountDown from "@/Components/BoostConversion/CountDown/CountDown";
import HotStock from "@/Components/BoostConversion/HotStock/HotStock";
import Toaster from "@/Components/Toaster/Toaster";
import ToastWithBtn from "@/Components/Toaster/ToastWithBtn";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import Seo from "@/Components/Seo/Seo";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import Cards from "@/Components/Products/Cards";
import useStyles from "@/Components/Product/styles.js";
import theme from "@/mui/theme.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { AiOutlineHeart } from "react-icons/ai";
import { BsBoxSeam, BsArrowReturnLeft } from "react-icons/bs";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { HiOutlineShare, HiChevronDown } from "react-icons/hi";

export default function Product() {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // Product id
  const productId = router.asPath.split("_")[1];

  // States
  const [product, setProduct] = useState(null); // For variants
  const [productData, setProductData] = useState(null); // From state or by querying
  const [showCart, setShowCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [accordion, setAccordion] = useState(false);
  const [variantsId, setVariantId] = useState([]);
  const [shippingPolicy, setShippingPolicy] = useState(null);
  const [share, setShare] = useState(false);

  // Available products from state
  const products = useSelector((state) => state.products.products);

  // Queries
  const shippingFeesQuery = useQuery(GET_SHIPPING_FEES);
  const productSettingsQuery = useQuery(GET_PRODUCT_SETTINGS);
  const staticPageQuery = useQuery(GET_STATIC_PAGES);

  // To get the product from db
  const [getProductsByIds] = useMutation(GET_PRODUCTS_BY_IDS, {
    onCompleted(data) {
      if (data.getProductsByIds.length > 0) {
        setProductData(data.getProductsByIds[0]);
      } else {
        router.push("/shop");
      }
    },
  });

  // To get the similar category products from db
  const [getProductsByCategory, { loading: productsByCategoryLoading }] =
    useMutation(GET_PRODUCTS_BY_CATEGORY, {
      onCompleted(data) {
        const filteredCategoryProducts = data.getProductsByCategory.filter(
          (product) => {
            return product._id !== productId;
          }
        );

        setRelatedProducts(filteredCategoryProducts.slice(0, 4));
      },
    });

  // Floating cart
  const scrollHandler = useCallback(() => {
    const actionBtns = document.getElementById("actionBtns");
    const floatingCart = document.getElementById("floatingCart");
    const turnOffCartTop = document.getElementById("turnOffCart")?.offsetTop;

    const sticky = actionBtns.offsetTop;

    if (
      window.pageYOffset > sticky &&
      window.pageYOffset < turnOffCartTop - 200
    ) {
      floatingCart.classList.add(classes.sticky);
    } else {
      floatingCart.classList.remove(classes.sticky);
    }
  }, [classes.sticky]);

  // To fetch product, category & more ...
  useEffect(() => {
    if (
      productId !== undefined &&
      (productData === null || productData._id !== productId)
    ) {
      setVariantId([]);

      const isExist = products.find((product) => {
        return product._id === productId;
      });

      if (isExist) {
        setProductData(isExist);
        return;
      }

      if (productId.length === 24) {
        getProductsByIds({ variables: { ids: [productId] } });
      } else {
        router.push("/shop");
      }
    }

    if (productData?.category) {
      getProductsByCategory({
        variables: { category: productData.category },
      });
    }

    if (shippingFeesQuery?.data) {
      dispatch(getShipping(shippingFeesQuery.data.getShipping));
    }

    if (productSettingsQuery?.data) {
      dispatch(
        getProductSettings(productSettingsQuery.data.getProductSettings)
      );
    }

    if (staticPageQuery?.data) {
      const policy = staticPageQuery?.data?.getStaticPages.find((page) => {
        return page.pageName === "shipping-policy";
      });

      setShippingPolicy(policy);
    }

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [
    productId,
    products,
    productData,
    shippingFeesQuery,
    productSettingsQuery,
    staticPageQuery,
    router,
    scrollHandler,
  ]);

  // To handle variants
  useEffect(() => {
    if (productData) {
      const ids = [];

      variantsId?.map((option) => {
        return ids.push(option.variantId);
      });

      const product = GetProductDetails(productData, ids);

      setProduct(product);
    }
  }, [productId, productData, variantsId]);

  //  From State
  const state = useSelector((state) => state);

  // Shipping & returns
  const shippingFeesData = state.shipping.shipping;

  const expectedDeliveryDays = shippingFeesData?.expectedDelivery;

  const expectedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + expectedDeliveryDays);

    return new Date(d).toDateString();
  };

  // product settings
  const productSettingsData = state.productSettings.productSettings;

  // Rating & reviews
  const rating = [];

  if (productData?.reviews) {
    productData.reviews.map((item) => rating.push(item.rating));
  }

  const averageRating = (
    rating?.reduce((a, b) => a + b, 0) / rating.length
  ).toFixed(1);

  const totalRatings = rating.length;

  // Add to cart
  const handleAddToCart = (productId) => {
    const customerId = localStorage.getItem("cart");
    const variantId = product.variantId;
    const variantName = product.variantName;

    addToCart({
      variables: {
        customerId: customerId ? customerId : null,
        productId,
        variantId,
        variantName,
      },
    });
  };

  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    onCompleted(data) {
      if (data.addToCart.status === 200) {
        localStorage.setItem("cart", data.addToCart.customerId);
        dispatch(getCart(data.addToCart.products));
        setShowCart(true);
      } else if (data.addToCart.status === 403) {
        ToastWithBtn(data.addToCart.message);
      } else {
        ToastStatus("Error", "Error occurred");
      }
    },
  });

  // Close cart
  const closeCart = () => {
    setShowCart(false);
  };

  // Add to wishlist
  const handleAddToWishlist = (productId) => {
    addToWishlist({ variables: { productId } });
  };

  const [addToWishlist] = useMutation(ADD_TO_WISHLIST, {
    onCompleted(data) {
      if (data.addToWishlist.status === 200) {
        ToastStatus("Success", data.addToWishlist.message);
      } else if (data.addToWishlist.status === 401) {
        ToastWithBtn(data.addToWishlist.message);
      } else {
        ToastStatus("Error", "Error occurred");
      }
    },
  });

  // To handle variants
  const handleVariant = (option) => {
    setVariantId((prevOptions) => {
      const existingIndex = prevOptions.findIndex(
        (opt) => opt.name === option.name
      );
      if (existingIndex !== -1) {
        // Replace the existing option with the new option
        return [
          ...prevOptions.slice(0, existingIndex),
          option,
          ...prevOptions.slice(existingIndex + 1),
        ];
      } else {
        // Add the new option to the array
        return [...prevOptions, option];
      }
    });
  };

  const getVariantOption = (variant) => {
    const option = variant.options.find((item) => {
      return variantsId.some((option) => option.variantId === item.variantId);
    });

    if (option) {
      return option.value;
    } else {
      return "";
    }
  };

  // Social share
  const handleShare = () => {
    setShare(!share);
  };

  return (
    <div>
      <Seo
        title={product?.title}
        desc={product?.desc}
        image={product?.images?.[0]}
      />
      <Toaster />
      {showCart && <Cart action={closeCart} />}
      <div className={classes.layout}>
        {/* Floating Cart */}
        <FloatingCart product={product} addToCart={handleAddToCart} />
        {/* Left layout */}
        <div className={classes.leftLayout}>
          {/* Breadcrumbs */}
          <BreadcrumbsBar product={product} />
          {/* Social Share */}
          <div className={classes.shareIcon}>
            <HiOutlineShare fontSize={"1.5em"} onClick={handleShare} />
          </div>
          <Share modal={share} product={product} handleShare={handleShare} />
          {/* Product Gallery */}
          <ProductGallery product={product} />
        </div>
        {/* Right layout */}
        <div className={classes.rightLayout}>
          {/* SoldInLast  */}
          <SoldInLast product={product} />
          {/* Title, Price, Review */}
          <Typography variant="h1" className={classes.title}>
            {product ? (
              CapitalizeText(product?.title)
            ) : (
              <Skeleton
                animation="wave"
                variant="rounded"
                width="80%"
                sx={{ bgcolor: `${theme.palette.primary.light}25` }}
              />
            )}
          </Typography>
          <Typography variant="h4" className={classes.price}>
            {product ? (
              <>
                {product?.salePrice < product?.regularPrice ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className={classes.salePrice}>
                      {CurrencyConverter(product.salePrice)}
                    </span>
                    <span className={classes.regularPrice}>
                      {CurrencyConverter(product.regularPrice)}
                    </span>
                    <span className={classes.discount}>
                      (
                      {DiscountCalculator(
                        product.regularPrice,
                        product.salePrice
                      ) +
                        "% " +
                        t("product.price.offText")}
                      )
                    </span>
                  </div>
                ) : (
                  <span>{CurrencyConverter(product?.salePrice)}</span>
                )}
              </>
            ) : (
              <Skeleton
                animation="wave"
                width="40%"
                sx={{ bgcolor: `${theme.palette.primary.light}25` }}
              />
            )}
          </Typography>
          <div className={classes.ratingContainer}>
            {product ? (
              <>
                {totalRatings > 0 && (
                  <>
                    <Rating
                      value={averageRating}
                      precision={0.5}
                      size="small"
                      readOnly
                      className={classes.rating}
                    />
                    <Typography variant="subtitle2" sx={{ ml: 1 }}>
                      ({totalRatings})
                    </Typography>
                  </>
                )}
              </>
            ) : (
              <Skeleton
                animation="wave"
                width="20%"
                sx={{ bgcolor: `${theme.palette.primary.light}25` }}
              />
            )}
          </div>
          {/* Hot Stock */}
          <HotStock product={product} />
          {/* Countdown */}
          <CountDown product={product} />
          {/* Variants */}
          {product?.productType === "variable" && (
            <div className={classes.variants}>
              {product.variantsOptions?.map((variant) => (
                <div className={classes.variant}>
                  <Typography
                    variant="subtitle1"
                    className={classes.variantOptionText}
                  >
                    {CapitalizeText(variant.name)}:
                    <span>{CapitalizeText(getVariantOption(variant))}</span>
                  </Typography>
                  {variant.options.map((option, index) => (
                    <span
                      key={index}
                      style={{ backgroundColor: option.meta }}
                      className={`${
                        variantsId.some(
                          (item) => item.variantId === option.variantId
                        ) && classes.activeVariant
                      } ${
                        option.meta.length === 0 && classes.variantOptionValue
                      }`}
                      onClick={() =>
                        handleVariant({
                          name: variant.name,
                          variantId: option.variantId,
                        })
                      }
                    >
                      {option.meta.length === 0 && CapitalizeText(option.value)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
          {/* Action buttons */}
          <div id="actionBtns" className={classes.actionBtns}>
            <div
              onClick={() => product?.inStock && handleAddToCart(product._id)}
            >
              <PrimaryButton
                text={
                  product?.inStock
                    ? `${t("product.addToCart.text")} - ${CurrencyConverter(
                        product.salePrice
                      )}`
                    : `${t("product.outOfStock.text")}`
                }
                disabled={product?.inStock ? false : true}
                fullWidth={true}
                animate={product?.inStock ? true : false}
                spinner={loading}
                isLoading={!product}
              />
            </div>
            <div onClick={() => handleAddToWishlist(product?._id)}>
              <SecondaryButton
                text={t("product.wishlist.text")}
                endIcon={<AiOutlineHeart fontSize={"1.5em"} />}
                fullWidth={true}
                isLoading={!product}
              />
            </div>
          </div>
          {/* Customers Views */}
          <CustomersViews product={product} />
          {/* Risk Reducers */}
          {product ? (
            <div className={classes.riskReducers}>
              <Typography
                variant="subtitle1"
                className={classes.riskReducerText}
              >
                {t("product.riskReducer.title")}
              </Typography>
              {expectedDeliveryDays > 0 && (
                <div className={classes.riskReducer}>
                  <BsBoxSeam fontSize={"1.5em"} />
                  <Typography variant="subtitle1" sx={{ pl: 2 }}>
                    {t("product.riskReducer.text1")} {expectedDelivery()}
                  </Typography>
                </div>
              )}
              <div className={classes.riskReducer}>
                <VscWorkspaceTrusted fontSize={"1.5em"} />
                <Typography variant="subtitle1" sx={{ pl: 2 }}>
                  {t("product.riskReducer.text2")}
                </Typography>
              </div>
              <div className={classes.riskReducer}>
                <BsArrowReturnLeft fontSize={"1.5em"} />
                <Typography variant="subtitle1" sx={{ pl: 2 }}>
                  {t("product.riskReducer.text3")}
                </Typography>
              </div>
            </div>
          ) : (
            <Skeleton
              variant="rounded"
              animation="wave"
              width="60%"
              height="150px"
              sx={{
                bgcolor: `${theme.palette.primary.light}25`,
                margin: "30px auto 0",
              }}
            />
          )}
          {/* Description */}
          <div className={classes.accordion}>
            {product ? (
              <>
                <Accordion
                  expanded={accordion}
                  elevation={0}
                  square={true}
                  onChange={() => setAccordion(!accordion)}
                >
                  <AccordionSummary
                    expandIcon={<HiChevronDown fontSize={"1.5em"} />}
                  >
                    <Typography variant="h5">
                      {t("product.accordion.title1")}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className={classes.accordionContent}>
                    <Typography
                      variant="body1"
                      dangerouslySetInnerHTML={{
                        __html: product?.desc,
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
                {shippingPolicy && (
                  <Accordion elevation={0} square={true}>
                    <AccordionSummary
                      expandIcon={<HiChevronDown fontSize={"1.5em"} />}
                    >
                      <Typography variant="h5">
                        {t("product.accordion.title2")}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionContent}>
                      <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{
                          __html:
                            shippingPolicy.pageContent.substring(0, 500) +
                            `<a href="/static/shipping-policy" style=${"text-decoration:none"} target="_blank">...read more</a>`,
                        }}
                      />
                    </AccordionDetails>
                  </Accordion>
                )}
              </>
            ) : (
              <Skeleton
                animation="wave"
                variant="rounded"
                width="100%"
                height="150px"
                sx={{ bgcolor: `${theme.palette.primary.light}25` }}
              />
            )}
          </div>
        </div>
      </div>
      <div className={classes.bottomContainer}>
        {/* Reviews  & related products*/}
        <Reviews
          product={productData}
          averageRating={averageRating}
          totalRatings={totalRatings}
        />
        <Cards
          products={relatedProducts}
          productSettings={productSettingsData}
          title={t("product.relatedProducts.title")}
          loading={productsByCategoryLoading}
          totalLoadingCount={4}
        />
      </div>
    </div>
  );
}

export { getServerSideProps };
