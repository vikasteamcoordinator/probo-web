// ** Next, React And Locals Imports
import CustomImage from "@/Components/Image/CustomImage";
import CustomLink from "@/Components/Link/CustomLink";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "@/styles/paymentFailure.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { useTranslation } from "next-i18next";

export default function PaymentFailure() {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <div className={classes.mainCtn}>
        <div className={classes.imageContainer}>
          <CustomImage
            src={"/assets/Pleading-Face.png"}
            alt="pleading face emoji"
            fill={"true"}
          />
        </div>
        <Typography variant="h2" component="h1" sx={{ pt: 1 }}>
          {t("payment.failed.title")}
        </Typography>
        <Typography variant="subtitle1" sx={{ pt: 3, pb: 3 }} align="center">
          {t("payment.failed.content")}
        </Typography>
        <SecondaryButton
          href="/shop"
          text={t("payment.failed.continueShopping")}
        />
        <div style={{ paddingTop: "20px", cursor: "pointer" }}>
          <CustomLink
            href="/help"
            text={t("payment.help")}
            color={true}
            hover={true}
          />
        </div>
      </div>
    </div>
  );
}

export { getServerSideProps };
