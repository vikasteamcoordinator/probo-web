// ** Next, React And Locals Imports
import Link from "next/link";
import FormatLink from "@/Helpers/FormatLink.js";
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import CapitalizeText from "@/Helpers/CapitalizeText.js";
import GetProductDetails from "@/Helpers/GetProductDetails.js";
import CustomImage from "@/Components/Image/CustomImage";
import useStyles from "./styles.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import Marquee from "react-fast-marquee";
import { useTranslation } from "next-i18next";

function TrendingProducts({ settings, products }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Trending, limit & products
  const isTrending = settings?.trending;
  const trendingLimit = settings?.trendingLimit;

  const trendingProducts = products.filter((product) => {
    return product.trending;
  });

  return (
    <div>
      {isTrending && trendingProducts.length > 2 && (
        <div className={classes.container}>
          <div className={classes.title}>
            <Typography variant="h5">{t("home.trending.title")}</Typography>
            <CustomImage
              src={"/assets/Gif/trending.gif"}
              alt="trending gif"
              width={25}
              height={25}
            />
          </div>
          <Marquee pauseOnHover={true} gradientColor={[255, 255, 255]}>
            {trendingProducts.slice(0, trendingLimit).map((product, index) => {
              const productDetails = GetProductDetails(product);

              return (
                <Link
                  key={index}
                  href={`/product/${FormatLink(productDetails.title)}/id_${
                    productDetails._id
                  }`}
                >
                  <div className={classes.trendingProduct}>
                    {productDetails.images && (
                      <CustomImage
                        src={`${
                          process.env.NEXT_PUBLIC_BACKEND_URL +
                          "product/" +
                          productDetails.images[0]
                        }`}
                        alt="product"
                        width={75}
                        height={75}
                        style={classes.productImage}
                      />
                    )}
                    <div>
                      <Typography variant="h5" sx={{ pl: 2 }}>
                        {productDetails.title.length > 30 ? (
                          <>
                            {CapitalizeText(
                              productDetails.title.substring(0, 25)
                            ) + "..."}
                          </>
                        ) : (
                          <>{CapitalizeText(productDetails.title)}</>
                        )}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ pt: 1, pl: 2, color: theme.palette.error.light }}
                      >
                        {CurrencyConverter(productDetails.salePrice)}
                      </Typography>
                    </div>
                  </div>
                </Link>
              );
            })}
          </Marquee>
        </div>
      )}
    </div>
  );
}

export default TrendingProducts;
