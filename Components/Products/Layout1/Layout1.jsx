// ** Next, React And Locals Imports
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ADD_TO_WISHLIST } from "@/Queries/Customers.js";
import FormatLink from "@/Helpers/FormatLink.js";
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import GetProductDetails from "@/Helpers/GetProductDetails.js";
import CapitalizeText from "@/Helpers/CapitalizeText.js";
import DiscountCalculator from "@/Helpers/DiscountCalculator.js";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import ToastWithBtn from "@/Components/Toaster/ToastWithBtn";
import CustomImage from "@/Components/Image/CustomImage";
import Skeletons from "@/Components/Skeletons/Skeletons";
import useStyles from "./styles.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai";

function Layout1({ products, title, isWishlist, loading, totalLoadingCount }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Grid spacing
  const isLarge = useMediaQuery(theme.breakpoints.up("sm"));

  // For skeleton loading
  const skeletonItems = Array.from(
    { length: totalLoadingCount || 4 },
    (_, index) => index
  );

  // To control slider autoplay
  const sliderRefs = useRef([]);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    sliderRefs.current = sliderRefs.current.slice(0, products?.length);
  }, [products?.length]);

  const handleMouseEnter = (index) => {
    setAutoplay(true);
    sliderRefs.current?.[index]?.slickPlay();
  };

  const handleMouseLeave = (index) => {
    setAutoplay(false);
    sliderRefs.current?.[index]?.slickPause();
  };

  // Slider settings
  const sliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    fade: true,
    autoplay,
    autoplaySpeed: 1300,
    arrows: false,
    lazyLoad: true,
    dots: true,
    pauseOnHover: false,
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
        ToastStatus("Error", data.addToWishlist.message);
      }
    },
  });

  // Remove from wishlist
  const handleRemove = (productId) => {
    isWishlist(productId);
  };

  return (
    <div className={classes.container}>
      <Toaster />
      <Typography variant="h4" align="center" className={classes.sectionTitle}>
        {title && (
          <>
            {!loading ? (
              products?.length > 0 && CapitalizeText(title)
            ) : (
              <Skeleton
                animation="wave"
                variant="rounded"
                width="80%"
                sx={{
                  bgcolor: `${theme.palette.primary.light}25`,
                  maxWidth: "300px",
                  margin: "0 auto",
                }}
              />
            )}
          </>
        )}
      </Typography>
      <Grid
        container
        spacing={isLarge ? 4 : 0}
        className={classes.cardContainer}
      >
        {(loading && products?.length > 0) ||
        (!loading && products?.length > 0) ? (
          <>
            {products.map((product, index) => {
              const productDetails = GetProductDetails(product);

              return (
                <Grid
                  key={index}
                  item
                  xl={3}
                  lg={3}
                  md={4}
                  sm={4}
                  xs={6}
                  className={classes.card}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  <Slider
                    {...sliderSettings}
                    className={classes.slider}
                    ref={(el) => (sliderRefs.current[index] = el)}
                  >
                    {productDetails.images?.map((image, index) => (
                      <div key={index}>
                        <Link
                          href={`/product/${FormatLink(product.title)}/id_${
                            product._id
                          }`}
                        >
                          <CustomImage
                            src={
                              process.env.NEXT_PUBLIC_BACKEND_URL +
                              "product/" +
                              image
                            }
                            alt="products"
                            fill={"true"}
                            style={classes.productImage}
                          />
                        </Link>
                        {isWishlist ? (
                          <AiOutlineClose
                            className={classes.wishListIcon}
                            onClick={() => handleRemove(product._id)}
                          />
                        ) : (
                          <AiOutlineHeart
                            className={classes.wishListIcon}
                            onClick={() => handleAddToWishlist(product._id)}
                          />
                        )}
                      </div>
                    ))}
                  </Slider>
                  <div className={classes.cardContent}>
                    <Typography variant="h6" className={classes.title}>
                      {CapitalizeText(product.title)}
                    </Typography>
                    <Typography variant="subtitle2" className={classes.price}>
                      {productDetails.salePrice <
                      productDetails.regularPrice ? (
                        <>
                          <span className={classes.salePrice}>
                            {CurrencyConverter(productDetails.salePrice)}
                          </span>
                          <span className={classes.regularPrice}>
                            {CurrencyConverter(productDetails.regularPrice)}
                          </span>
                          <span className={classes.discount}>
                            (
                            {DiscountCalculator(
                              productDetails.regularPrice,
                              productDetails.salePrice
                            )}
                            % {t("home.products.offText")})
                          </span>
                        </>
                      ) : (
                        <span>
                          {CurrencyConverter(productDetails.regularPrice)}
                        </span>
                      )}
                    </Typography>
                  </div>
                </Grid>
              );
            })}
            {loading && (
              <>
                {skeletonItems.map((item) => (
                  <Grid key={item} item xl={3} lg={3} md={4} sm={4} xs={6}>
                    <Skeletons type="card" />
                  </Grid>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {loading && (
              <>
                {skeletonItems.map((item) => (
                  <Grid key={item} item xl={3} lg={3} md={4} sm={4} xs={6}>
                    <Skeletons type="card" />
                  </Grid>
                ))}
              </>
            )}
          </>
        )}
      </Grid>
    </div>
  );
}

export default Layout1;
