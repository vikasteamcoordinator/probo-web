// ** Next, React And Locals Imports
import CustomLink from "@/Components/Link/CustomLink.jsx";
import useStyles from "./styles.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import { useTranslation } from "next-i18next";

function BreadcrumbsBar({ product }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  return (
    <>
      {product ? (
        <Breadcrumbs className={classes.breadcrumbs}>
          <Typography variant="subtitle2">
            <CustomLink href="/" text={t("product.breadcrumbs.home")} />
          </Typography>
          <Typography variant="subtitle2">
            <CustomLink href="/shop" text={t("product.breadcrumbs.shop")} />
          </Typography>
        </Breadcrumbs>
      ) : (
        <div className={classes.breadcrumbs}>
          <Skeleton
            animation="wave"
            width="25%"
            sx={{ bgcolor: `${theme.palette.primary.light}25` }}
          />
        </div>
      )}
    </>
  );
}

export default BreadcrumbsBar;
