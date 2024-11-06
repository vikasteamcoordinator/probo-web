// ** Next, React And Locals Imports
import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { GET_CUSTOMER } from "@/Queries/Customers.js";
import { GET_COUPONS } from "@/Queries/Coupons.js";
import { getCustomer } from "@/Redux/slices/customer.js";
import { getCoupons } from "@/Redux/slices/coupons.js";
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import Sidebar from "@/Components/Profile/Sidebar/Sidebar";
import GreetingsLayout from "@/Components/Profile/GreetingsLayout/GreetingsLayout";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import Seo from "@/Components/Seo/Seo";
import CustomImage from "@/Components/Image/CustomImage";
import useStyles from "@/styles/coupons.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

// ** Third Party Imports
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";

export default function Coupons() {
  const dispatch = useDispatch();
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Seo
  const getTitleDescQuery = useQuery(GET_SEO_TITLE_DESCS);

  const getTitleDesc = getTitleDescQuery?.data?.getSeoTitleDescs;

  const titleDesc = getTitleDesc?.find((item) => {
    return item.pageName === "home";
  });

  // Queries
  const customerQuery = useQuery(GET_CUSTOMER);
  const couponsQuery = useQuery(GET_COUPONS);

  useEffect(() => {
    const customerData = customerQuery?.data?.getCustomer;
    const couponsData = couponsQuery?.data?.getCoupons;

    if (customerData) {
      dispatch(getCustomer(customerData));
    }
    if (couponsData) {
      dispatch(getCoupons(couponsData));
    }
  }, [customerQuery, couponsQuery]);

  const customer = useSelector((state) => state.customer.customer);

  const coupons = useSelector((state) => state.coupons.coupons);

  // Available coupons
  const availableCoupons = coupons.filter((coupon) => {
    return coupon.isEnabled;
  });

  return (
    <div className={classes.container}>
      <Seo title={"Coupons"} desc={titleDesc?.desc} />
      <Toaster />
      <GreetingsLayout customer={customer} />
      <Divider sx={{ mt: 3 }} />
      <div className={classes.mainContainer}>
        <div className={classes.sidebar}>
          <Sidebar />
        </div>
        <div className={classes.main}>
          <Paper className={classes.form}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {t("account.coupons.title")}
            </Typography>
            {availableCoupons.map((coupon) => (
              <Paper key={coupon._id} className={classes.coupon}>
                <div className={classes.couponTop}>
                  <div>
                    <Typography variant="h4">
                      {CurrencyConverter(coupon.discount)}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      variant="subtitle1"
                      className={classes.couponCode}
                    >
                      {t("account.coupons.code")}:
                      <b>
                        {coupon.couponCode}{" "}
                        <FiCopy
                          fontSize={"1.5em"}
                          onClick={() => {
                            navigator.clipboard.writeText(coupon.couponCode);

                            ToastStatus("Success", "Coupon copied");
                          }}
                        />
                      </b>
                    </Typography>
                    <Typography variant="subtitle1">
                      {t("account.coupons.minPurchase")}:{" "}
                      {CurrencyConverter(coupon.minValue)}
                    </Typography>
                  </div>
                  <div className={classes.discountImg}>
                    <CustomImage
                      src={"/assets/discountImage.png"}
                      alt="discount"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                <Divider />
                <div className={classes.couponBottom}>
                  <Typography variant="subtitle2" sx={{ pr: 3 }}>
                    {t("account.coupons.validFrom")}:
                    {new Date(coupon.validFrom).toLocaleDateString()}
                  </Typography>
                  <Typography variant="subtitle2">
                    {t("account.coupons.validTo")}:{" "}
                    {new Date(coupon.validTo).toLocaleDateString()}
                  </Typography>
                </div>
              </Paper>
            ))}
          </Paper>
        </div>
      </div>
      <div className={classes.prevNext}>
        <Link href="/profile/orders">
          <Typography variant="h5" sx={{ pb: 1 }}>
            <BsChevronLeft fontSize={"0.75em"} />
            {t("account.prev")}
          </Typography>
          <Typography variant="h5"> {t("account.orders.title")}</Typography>
        </Link>
        <Link href="/profile/change-password">
          <Typography variant="h5" sx={{ pb: 1 }}>
            {t("account.next")}
            <BsChevronRight fontSize={"0.75em"} />
          </Typography>
          <Typography variant="h5">
            {t("account.changePassword.title")}
          </Typography>
        </Link>
      </div>
    </div>
  );
}

export { getServerSideProps };
