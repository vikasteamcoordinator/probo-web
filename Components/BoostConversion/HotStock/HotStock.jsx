// ** Next, React And Locals Imports
import { useSelector } from "react-redux";
import useStyles from "./styles.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import { useTranslation } from "next-i18next";

function HotStock({ product }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  const siteSettings = useSelector((state) => state.siteSettings.siteSettings);

  const hotStockInventoryLevel = siteSettings?.hotStockInventoryLevel;

  const stocksLeft = product?.totalStocks;

  const hotStock =
    siteSettings?.hotStock &&
    hotStockInventoryLevel > stocksLeft &&
    stocksLeft > 0 &&
    product?.inStock;

  // Calculating progress value
  const value = () => {
    return 100 - (stocksLeft / hotStockInventoryLevel) * 100;
  };

  return (
    <>
      {product ? (
        <>
          {hotStock && (
            <div className={classes.hotStockCtn}>
              <Typography variant="subtitle1" sx={{ pb: 0.5 }}>
                {t("product.hotStock.text1") +
                  " " +
                  stocksLeft +
                  " " +
                  t("product.hotStock.text2")}{" "}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={value()}
                color="error"
              />
            </div>
          )}
        </>
      ) : (
        <div className={classes.hotStockCtn}>
          <Skeleton
            animation="wave"
            variant="rounded"
            width="100%"
            height="70px"
            sx={{
              bgcolor: `${theme.palette.primary.light}25`,
            }}
          />
        </div>
      )}
    </>
  );
}

export default HotStock;
