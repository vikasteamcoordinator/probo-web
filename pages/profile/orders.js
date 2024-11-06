// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { GET_SEO_TITLE_DESCS } from "@/Queries/SeoTitleDescs.js";
import { GET_CUSTOMER } from "@/Queries/Customers.js";
import { GET_CUSTOMER_ORDERS } from "@/Queries/Orders.js";
import { getOrders } from "@/Redux/slices/orders.js";
import { getCustomer } from "@/Redux/slices/customer.js";
import CapitalizeText from "@/Helpers/CapitalizeText.js";
import GreetingsLayout from "@/Components/Profile/GreetingsLayout/GreetingsLayout";
import Toaster from "@/Components/Toaster/Toaster";
import Seo from "@/Components/Seo/Seo";
import Sidebar from "@/Components/Profile/Sidebar/Sidebar";
import AddReview from "@/Components/Profile/Orders/AddReview";
import CustomImage from "@/Components/Image/CustomImage";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "@/Components/Profile/Orders/styles.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";

// ** Third Party Imports
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export default function Orders() {
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

  // States
  const [orderId, setOrderId] = useState("");
  const [products, setProducts] = useState([]);
  const [reviewModal, setReviewModal] = useState(false);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const ordersToShow = 5; // Default

  // Queries
  const customerQuery = useQuery(GET_CUSTOMER);

  const [getCustomerOrders] = useMutation(GET_CUSTOMER_ORDERS, {
    onCompleted(data) {
      dispatch(getOrders(data.getOrdersByCustomer));
    },
  });

  // Customer, customer's orders and orders count
  const customer = useSelector((state) => state.customer.customer);

  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    const customerData = customerQuery?.data?.getCustomer;

    if (customerData) {
      dispatch(getCustomer(customerData));
    }

    if (customer?._id) {
      getCustomerOrders({ variables: { customerId: customer._id } });
    }
  }, [customerQuery, customer]);

  useEffect(() => {
    if (orders) {
      const initialOrders = orders.slice(0, ordersToShow);
      setVisibleOrders(initialOrders);
    }
  }, [orders]);

  //Total quantity
  const totalQuantity = (products) => {
    const items = products.map((product) => product.quantity);

    return items.reduce((a, b) => {
      return a + b;
    }, 0);
  };

  // To show more orders on click
  const handleShowMoreOrders = () => {
    const currentlyVisibleOrders = visibleOrders.length;

    const nextOrders = orders.slice(
      currentlyVisibleOrders,
      currentlyVisibleOrders + ordersToShow
    );

    setVisibleOrders([...visibleOrders, ...nextOrders]);
  };

  const showMoreButtonVisible = visibleOrders.length < orders?.length;

  // To add review
  const handleAddReview = (products, orderId) => {
    setOrderId(orderId);
    setProducts(products);
    setReviewModal(!reviewModal);
  };

  return (
    <div className={classes.container}>
      <Seo title={"My Orders"} desc={titleDesc?.desc} />
      <Toaster />
      <GreetingsLayout customer={customer} />
      <Divider sx={{ mt: 3 }} />
      <div className={classes.mainContainer}>
        <div className={classes.sidebar}>
          <Sidebar />
        </div>
        <div className={classes.ordersCtn}>
          <Paper className={classes.orders}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {t("account.orders.title")}
            </Typography>
            {visibleOrders?.length > 0 ? (
              visibleOrders.map((order) => {
                const product = order.products[0];

                return (
                  <Paper key={order._id} className={classes.order}>
                    <Link href={`/profile/orders/${order._id}`}>
                      <div className={classes.top}>
                        <div className={classes.product}>
                          <CustomImage
                            src={
                              process.env.NEXT_PUBLIC_BACKEND_URL +
                              "product/" +
                              product.product?.images[0]
                            }
                            alt="product"
                            width={60}
                            height={80}
                            style={classes.productImg}
                          />
                          <div>
                            <Typography
                              variant="h6"
                              className={classes.productTitle}
                            >
                              {product.product?.title}
                            </Typography>
                            {product.variant && (
                              <Typography variant="subtitle2">
                                {t("account.product.variant")}:{" "}
                                {CapitalizeText(product.variantName)}
                              </Typography>
                            )}
                            {totalQuantity(order.products) > 1 && (
                              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                & {totalQuantity(order.products) - 1}{" "}
                                {t("account.products.more")}
                              </Typography>
                            )}
                          </div>
                        </div>
                        <BsChevronRight fontSize={"0.75em"} />
                      </div>
                    </Link>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    <div className={classes.bottom}>
                      <Typography variant="subtitle1">
                        <b> {t("account.orderStatus.text")}:</b>{" "}
                        {CapitalizeText(order.deliveryStatus)}
                      </Typography>
                      {order.deliveryStatus === "delivered" && (
                        <div
                          onClick={() =>
                            handleAddReview(order.products, order._id)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <Typography variant="subtitle1">
                            {t("account.orders.writeReview")}
                          </Typography>
                        </div>
                      )}
                    </div>
                  </Paper>
                );
              })
            ) : (
              <div className={classes.noItems}>
                <Typography variant="h4" sx={{ pb: 4 }}>
                  {t("account.noOrders.text1")}
                </Typography>
                <Typography variant="subtitle1" sx={{ pb: 2 }}>
                  {t("account.noOrders.text2")}
                </Typography>
                <PrimaryButton href="/shop" text={t("account.shopNow")} />
              </div>
            )}
            {showMoreButtonVisible && (
              <div className={classes.showMoreBtn}>
                <SecondaryButton
                  text={t("account.products.showMore")}
                  onClick={handleShowMoreOrders}
                />
              </div>
            )}{" "}
          </Paper>
        </div>
      </div>
      {/* Add Review Modal */}
      <Modal open={reviewModal}>
        <AddReview
          products={products}
          orderId={orderId}
          closeModal={handleAddReview}
        />
      </Modal>
      <div className={classes.prevNext}>
        <Link href="/profile/address">
          <Typography variant="h5" sx={{ pb: 1 }}>
            <BsChevronLeft fontSize={"0.75em"} />
            {t("account.prev")}
          </Typography>
          <Typography variant="h5">{t("account.address.title")}</Typography>
        </Link>
        <Link href="/profile/coupons">
          <Typography variant="h5" sx={{ pb: 1 }}>
            {t("account.next")}
            <BsChevronRight fontSize={"0.75em"} />
          </Typography>
          <Typography variant="h5">{t("account.coupons.title")}</Typography>
        </Link>
      </div>
    </div>
  );
}

export { getServerSideProps };
