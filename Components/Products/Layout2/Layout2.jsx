// ** Next, React And Locals Imports
import Link from "next/link";
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import FormatLink from "@/Helpers/FormatLink.js";
import GetProductDetails from "@/Helpers/GetProductDetails.js";
import CapitalizeText from "@/Helpers/CapitalizeText.js";
import CustomImage from "@/Components/Image/CustomImage";
import Skeletons from "@/Components/Skeletons/Skeletons";
import useStyles from "./styles.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Third Party Imports
import { useTranslation } from "next-i18next";
import { AiOutlineClose } from "react-icons/ai";

function Layout2({ products, title, isWishlist, loading, totalLoadingCount }) {
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

  // Remove from wishlist
  const handleRemove = (productId) => {
    isWishlist(productId);
  };

  return (
    <div className={classes.container}>
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
        spacing={isLarge ? 4 : 1}
        className={classes.cardContainer}
      >
        {(loading && products?.length > 0) ||
        (!loading && products?.length > 0) ? (
          <>
            {products.map((product, index) => {
              const productDetails = GetProductDetails(product);

              return (
                <Grid key={index} item xl={3} lg={3} md={4} sm={4} xs={6}>
                  <div className={classes.cardMain}>
                    <Link
                      href={`/product/${FormatLink(product.title)}/id_${
                        product._id
                      }`}
                    >
                      <div className={classes.imageContainer}>
                        <CustomImage
                          src={
                            process.env.NEXT_PUBLIC_BACKEND_URL +
                            "product/" +
                            productDetails.images[0]
                          }
                          alt="products"
                          fill={"true"}
                          style={classes.productImage}
                        />
                        {productDetails.images.length > 1 && (
                          <div className={classes.cardImageHover}>
                            <CustomImage
                              src={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "product/" +
                                productDetails.images[1]
                              }
                              alt="products"
                              fill={"true"}
                              style={classes.productImage}
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                    {productDetails.salePrice < productDetails.regularPrice && (
                      <span className={classes.discount}>
                        {t("home.products.saleText")}{" "}
                      </span>
                    )}
                    {isWishlist ? (
                      <AiOutlineClose
                        onClick={() => handleRemove(product._id)}
                        className={classes.wishlistIcon}
                      />
                    ) : (
                      product.trending && (
                        <div className={classes.trendingIcon}>
                          <CustomImage
                            src={"/assets/Gif/trending.gif"}
                            alt="trending gif"
                            fill={true}
                          />
                        </div>
                      )
                    )}
                  </div>
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

export default Layout2;
