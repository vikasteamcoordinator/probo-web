// ** Next, React And Locals Imports
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import CapitalizeText from "@/Helpers/CapitalizeText.js";
import CustomImage from "@/Components/Image/CustomImage";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import useStyles from "./styles.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import { useTranslation } from "next-i18next";

function FloatingCart({ product, addToCart }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  const handleAddToCart = (productId) => {
    addToCart(productId);
  };

  return (
    <div id="floatingCart" className={classes.floatingCartCtn}>
      <div className={classes.floatingCart}>
        <div>
          <Stack direction="row" alignItems={"center"}>
            {product ? (
              <>
                {product.images && (
                  <CustomImage
                    src={
                      process.env.NEXT_PUBLIC_BACKEND_URL +
                      "product/" +
                      product.images[0]
                    }
                    alt="floating cart product"
                    width={80}
                    height={80}
                  />
                )}
              </>
            ) : (
              <Skeleton
                animation="wave"
                variant="rounded"
                width="80px"
                height="80px"
                sx={{
                  bgcolor: `${theme.palette.primary.light}25`,
                }}
              />
            )}
            <Typography
              variant="h6"
              sx={{
                pl: 1,
              }}
            >
              {product ? (
                CapitalizeText(product?.title)
              ) : (
                <Skeleton
                  animation="wave"
                  variant="text"
                  width="80%"
                  sx={{
                    bgcolor: `${theme.palette.primary.light}25`,
                    minWidth: "250px",
                  }}
                />
              )}
            </Typography>
          </Stack>
        </div>
        <div onClick={() => product?.inStock && handleAddToCart(product._id)}>
          <PrimaryButton
            disabled={product?.inStock ? false : true}
            text={
              product?.inStock
                ? `${t("product.addToCart.text")} - ${CurrencyConverter(
                    product.salePrice
                  )}`
                : `${t("product.outOfStock.text")}`
            }
            fullWidth={true}
            animate={product?.inStock ? true : false}
            style={classes.floatingCartBtn}
            isLoading={!product}
          />
        </div>
      </div>
    </div>
  );
}

export default FloatingCart;
