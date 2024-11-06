// ** Next, React And Locals Imports
import CapitalizeText from "@/Helpers/CapitalizeText";
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import CustomLink from "@/Components/Link/CustomLink";
import CustomImage from "@/Components/Image/CustomImage";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "@/Components/Profile/Orders/styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";

// ** Third Party Imports
import { useTranslation } from "next-i18next";

export default function ViewOrder({ order, customer, guest }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <div className={classes.orderTop}>
        <Typography variant="h5">
          <b>{t("account.order.id")}</b>: #{order._id}
        </Typography>
        {!guest && (
          <SecondaryButton
            href="/profile/orders"
            text={t("account.order.goBack")}
          />
        )}
      </div>
      <Paper className={classes.viewOrder}>
        <>
          <Typography variant="h5">
            {t("account.order.status")}:
            <span className={classes.highlight}>
              {" "}
              {CapitalizeText(order.deliveryStatus)}
            </span>
          </Typography>
          <div className={classes.tabs}>
            <div
              className={`${classes.tab} ${
                order.deliveryStatus === "processing" && classes.tabHighlight
              }`}
            >
              {order.deliveryStatus === "processing" ? (
                <CustomImage
                  src={"/assets/Gif/orderProcessing.gif"}
                  alt="order processing"
                  width={70}
                  height={70}
                />
              ) : (
                <CustomImage
                  src={"/assets/orderProcessing.png"}
                  alt="order processing"
                  width={70}
                  height={70}
                />
              )}
            </div>
            <div
              className={`${classes.tab} ${
                order.deliveryStatus === "shipped" && classes.tabHighlight
              }`}
            >
              {order.deliveryStatus === "shipped" ? (
                <CustomImage
                  src={"/assets/Gif/orderShipped.gif"}
                  alt="order shipped"
                  width={70}
                  height={70}
                />
              ) : (
                <CustomImage
                  src={"/assets/orderShipped.png"}
                  alt="order shipped"
                  width={70}
                  height={70}
                />
              )}
            </div>
            <div
              className={`${classes.tab} ${
                order.deliveryStatus === "outForDelivery" &&
                classes.tabHighlight
              }`}
            >
              {order.deliveryStatus === "outForDelivery" ? (
                <CustomImage
                  src={"/assets/Gif/orderOutForDelivery.gif"}
                  alt="order out for delivery"
                  width={70}
                  height={70}
                />
              ) : (
                <CustomImage
                  src={"/assets/orderOutForDelivery.png"}
                  alt="order out for delivery"
                  width={70}
                  height={70}
                />
              )}
            </div>
            <div
              className={`${classes.tab} ${
                order.deliveryStatus === "delivered" && classes.tabHighlight
              }`}
            >
              {order.deliveryStatus === "delivered" ? (
                <CustomImage
                  src={"/assets/Gif/orderDelivered.gif"}
                  alt="order delivered"
                  width={70}
                  height={70}
                />
              ) : (
                <CustomImage
                  src={"/assets/orderDelivered.png"}
                  alt="order delivered"
                  width={70}
                  height={70}
                />
              )}
            </div>
          </div>
        </>
        {/* Product Details */}
        <div className={classes.productDetails}>
          <Typography variant="h5" sx={{ pb: 3 }}>
            {t("account.order.purchasedItems")}:
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 550 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <Typography variant="h6">
                      {t("account.order.product")}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">
                      {t("account.order.quantity")}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">
                      {t("account.order.price")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.products?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row" align="left">
                      <div className={classes.productTab}>
                        <CustomImage
                          src={
                            process.env.NEXT_PUBLIC_BACKEND_URL +
                            "product/" +
                            item.product.images[0]
                          }
                          alt={item.product.title}
                          width={90}
                          height={85}
                          style={classes.productImage}
                        />
                        <div>
                          <Typography variant="h6">
                            {item.product.title}
                          </Typography>
                          {item.variant && (
                            <Typography
                              variant="subtitle2"
                              sx={{ mt: 1, fontSize: "11px", opacity: 0.9 }}
                            >
                              {item.variantName.toUpperCase()}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1">
                        {item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1">
                        {CurrencyConverter(item.product.salePrice)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    align="right"
                    sx={{ borderBottom: "none" }}
                  >
                    <Typography variant="h6"></Typography>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="right"
                    sx={{ borderBottom: "none" }}
                  >
                    <Typography variant="subtitle1">
                      {t("account.order.mrp")}:
                    </Typography>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="left"
                    sx={{ borderBottom: "none" }}
                  >
                    <Typography variant="subtitle1">
                      {CurrencyConverter(order.mrp)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    align="right"
                    sx={{ borderBottom: "none" }}
                  >
                    <Typography variant="subtitle1"></Typography>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="right"
                    sx={{ borderBottom: "none" }}
                  >
                    <Typography variant="subtitle1">
                      {t("account.order.shippingText")}:
                    </Typography>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="left"
                    sx={{ borderBottom: "none" }}
                  >
                    <Typography variant="subtitle1">
                      {order.shippingFees === t("account.order.shippingFree")
                        ? t("account.order.shippingFree")
                        : CurrencyConverter(order.shippingFees)}
                    </Typography>
                  </TableCell>
                </TableRow>
                {order.appliedCoupon && (
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      align="right"
                      sx={{ borderBottom: "none" }}
                    >
                      <Typography variant="subtitle1"></Typography>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      align="right"
                      sx={{ borderBottom: "none" }}
                    >
                      <Typography variant="subtitle1">
                        {t("account.order.couponDiscount")} (
                        <span className={classes.appliedCoupon}>
                          {order.appliedCoupon}
                        </span>
                        ) :
                      </Typography>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      align="left"
                      sx={{ borderBottom: "none" }}
                    >
                      <Typography variant="subtitle1">
                        - {CurrencyConverter(order.couponDiscount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell component="th" scope="row" align="right">
                    <Typography variant="subtitle1"></Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    <Typography variant="subtitle1">
                      {t("account.order.taxes")}:
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" align="left">
                    <Typography variant="subtitle1">
                      {CurrencyConverter(order.taxes)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" align="right">
                    <Typography variant="subtitle1"></Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    <Typography variant="subtitle1">
                      {t("account.order.total")}:
                    </Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" align="left">
                    <Typography variant="subtitle1">
                      <b>{CurrencyConverter(order.totalAmount)}</b>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {/* Error  */}
          </TableContainer>
        </div>
        {/* Customer Details */}
        {customer.address && (
          <div className={classes.deliveryDetails}>
            <Typography variant="h5" sx={{ pb: 2 }}>
              {t("account.order.deliveryDetails")}:
            </Typography>
            <div>
              <Typography variant="subtitle1">
                {t("account.order.customerName")}: {customer.name}
              </Typography>
              <Typography variant="subtitle1">
                {t("account.order.customerEmail")}: {customer.email}
              </Typography>
              <Typography variant="subtitle1">
                {t("account.order.customerPhone")}: {customer.phoneNumber}
              </Typography>
              <Typography variant="subtitle1">
                {t("account.order.customerAddress")}:{" "}
                {`${customer.address.address1}, ${customer.address.address2}, ${customer.address.city}, ${customer.address.state}, ${customer.address.country}, ${customer.address.postal_code}`}
              </Typography>
            </div>
          </div>
        )}
        {/* Other Details */}
        <div className={classes.otherDetails}>
          <Typography variant="h5" sx={{ pb: 2 }}>
            {t("account.order.otherDetails")}:
          </Typography>
          <Typography variant="subtitle1">
            {t("account.order.id")}: #{order._id}
          </Typography>
          <Typography variant="subtitle1">
            {t("account.order.paymentMethod")}: {order.paymentMethod}
          </Typography>
        </div>
        {/* Need Help */}
        <div className={classes.help}>
          <Typography variant="h5" sx={{ pb: 2 }}>
            {t("account.order.help")}
          </Typography>
          <Typography variant="subtitle1">
            {t("account.order.helpText1")}{" "}
            <CustomLink
              href="/help"
              text="contact us"
              color={true}
              hover={true}
            />{" "}
            {t("account.order.helpText2")}
          </Typography>
        </div>
      </Paper>
    </div>
  );
}
