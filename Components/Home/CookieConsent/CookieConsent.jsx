// ** Next, React And Locals Imports
import CustomLink from "@/Components/Link/CustomLink";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import Cookie from "react-cookie-consent";
import { useTranslation } from "next-i18next";

function CookieConsent() {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  return (
    <div>
      <Cookie
        location="bottom"
        buttonText="Accept"
        cookieName="myAwesomeCookieName"
        disableStyles={true}
        buttonClasses={classes.cookieBtn}
        containerClasses={classes.cookieContainer}
        expires={365}
      >
        <Typography variant="subtitle1" align="left">
          {t("cookieConsent.content")}.{" "}
          <CustomLink
            href="/static/privacy-policy"
            text={t("cookieConsent.button")}
            color={true}
            hover={true}
          />
        </Typography>
      </Cookie>
    </div>
  );
}

export default CookieConsent;
