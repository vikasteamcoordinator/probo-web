// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GET_ORDER_BY_ID } from "@/Queries/Orders.js";
import { GET_SITE_SETTINGS } from "@/Queries/SiteSettings.js";
import SocialsFilter from "@/Helpers/SocialsFilter";
import CustomImage from "@/Components/Image/CustomImage";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "@/styles/paymentSuccess.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import { useTranslation } from "next-i18next";
import { useMutation, useQuery } from "@apollo/client";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function PaymentSuccess() {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // States
  const [validOrder, setValidOrder] = useState(false);
  const [guest, setGuest] = useState(false);

  // Queries
  const { data } = useQuery(GET_SITE_SETTINGS);

  // Order id
  const orderId = router.asPath.split("=")[1];

  // For confetti
  const { width, height } = useWindowSize();

  const [getOrderById] = useMutation(GET_ORDER_BY_ID, {
    onCompleted(data) {
      // Returning to 404
      if (!data.getOrderById) {
        return router.push("/404");
      }

      // Checking whether the order is placed by guest customer or not
      const customerId = data.getOrderById.customer.customerId.split("-");

      if (customerId.length > 1) {
        setGuest(true);
      } else {
        setGuest(false);
      }

      setValidOrder(true);
    },
  });

  useEffect(() => {
    if (orderId?.length === 24) {
      getOrderById({ variables: { id: orderId } });
    } else {
      router.push("/404");
    }
  }, [orderId, getOrderById]);

  // Socials
  const socials = data?.getSiteSettings?.socials;

  const socialNetworks = ["facebook", "instagram", "twitter", "youtube"];

  return (
    <div className={classes.container}>
      {validOrder && (
        <>
          <Confetti
            width={width}
            height={height}
            numberOfPieces={300}
            className={classes.confetti}
          />
          <div className={classes.mainCtn}>
            <div className={classes.imageContainer}>
              <CustomImage
                src={"/assets/Star-Struck.png"}
                alt="star struck emoji"
                fill={"true"}
              />
            </div>
            <Typography
              variant="h2"
              component="h1"
              sx={{ pt: 1 }}
              align="center"
            >
              {t("payment.success.title")}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ pt: 3, pb: 3 }}
              align="center"
            >
              {t("payment.success.content")}
            </Typography>
            <div className={classes.btns}>
              <div className={classes.actionBtn}>
                <SecondaryButton
                  href="/shop"
                  text={t("payment.success.continueShopping")}
                  fullWidth={true}
                />
              </div>
              <div className={classes.actionBtn}>
                <SecondaryButton
                  href={
                    guest ? `/orders/${orderId}` : `/profile/orders/${orderId}`
                  }
                  text={t("payment.success.viewOrder")}
                  fullWidth={true}
                />
              </div>
            </div>
            <Typography
              variant="subtitle1"
              sx={{ pt: 5, pb: 1 }}
              align="center"
            >
              {t("payment.success.social")}
            </Typography>
            <div>
              {socialNetworks.map((network, index) => (
                <Link
                  key={index}
                  href={SocialsFilter(socials, network)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className={classes.socialLogo}>
                    <CustomImage
                      src={`/assets/${network}.png`}
                      alt="social logo"
                      width={35}
                      height={35}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { getServerSideProps };
