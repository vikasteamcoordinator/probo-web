// ** Next, React And Locals Imports
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import { useTranslation } from "next-i18next";
import { FaRegEye } from "react-icons/fa";

function CustomersViews({ product }) {
  //Translation
  const { t } = useTranslation();

  const [count, setCount] = useState(Math.floor(Math.random() * 10) + 1);

  const siteSettings = useSelector((state) => state.siteSettings.siteSettings);

  const customerViews = siteSettings?.customerViews;

  const customerViewsNos = siteSettings?.customerViewsNos
    ?.toString()
    .split(",");

  const customerViewsTimer = parseInt(
    siteSettings?.customerViewsTimer?.split("")[0] + "000"
  );

  useEffect(() => {
    if (customerViews) {
      const interval = setInterval(() => {
        const random = Math.floor(Math.random() * customerViewsNos.length);
        setCount(customerViewsNos[random]);
      }, customerViewsTimer);

      return () => clearInterval(interval);
    }
  }, [siteSettings]);

  return (
    <>
      {product ? (
        <>
          {customerViews && (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                width: "fit-content",
                margin: "20px auto 0",
              }}
              variant="subtitle1"
            >
              <span style={{ display: "flex", paddingRight: "10px" }}>
                <FaRegEye fontSize={"1.3em"} />
              </span>
              {count} {t("product.customerViews.text")}
            </Typography>
          )}
        </>
      ) : (
        <Skeleton
          animation="wave"
          variant="text"
          sx={{
            bgcolor: `${theme.palette.primary.light}25`,
            maxWidth: "350px",
            margin: "20px auto 0",
          }}
        />
      )}
    </>
  );
}

export default CustomersViews;
