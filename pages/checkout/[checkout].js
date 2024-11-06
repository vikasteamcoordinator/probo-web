// ** Next, React And Locals Imports
import Link from "next/link";
import { useRouter } from "next/router.js";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_CART } from "@/Queries/Cart.js";
import { GET_CUSTOMER, CUSTOMERS } from "@/Queries/Customers.js";
import { GET_SITE_SETTINGS } from "@/Queries/SiteSettings.js";
import { CHECK_COUPON } from "@/Queries/Coupons.js";
import { GET_SHIPPING_FEES } from "@/Queries/Shipping.js";
import { getCart } from "@/Redux/slices/cart.js";
import { getCustomer } from "@/Redux/slices/customer.js";
import { getSiteSettings } from "@/Redux/slices/siteSettings.js";
import { getShipping } from "@/Redux/slices/shipping.js";
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import { FormTextField } from "@/Helpers/FormFields.js";
import Address from "@/Components/Checkout/Address";
import StripeForm from "@/Components/Checkout/StripeForm";
import Paypal from "@/Components/Checkout/Paypal";
import Razorpay from "@/Components/Checkout/Razorpay";
import CashOnDelivery from "@/Components/Checkout/CashOnDelivery";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import Toaster from "@/Components/Toaster/Toaster";
import Seo from "@/Components/Seo/Seo";
import CustomImage from "@/Components/Image/CustomImage";
import CustomLink from "@/Components/Link/CustomLink";
import Skeletons from "@/Components/Skeletons/Skeletons";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import paymentGateways from "@/Components/Checkout/Checkout.json";
import theme from "@/mui/theme.js";
import useStyles from "@/Components/Checkout/styles.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

// ** Third Party Imports
import { useTranslation } from "next-i18next";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Field } from "react-final-form";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { HiChevronDown } from "react-icons/hi";
import { CgRadioCheck, CgRadioChecked } from "react-icons/cg";

export default function Checkout() {
  const { classes } = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();

  //Translation
  const { t } = useTranslation();

  // States
  const [customer, setCustomer] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(true);
  const [cartValue, setCartValue] = useState(null); // Inclusive of mrp, tax & shipping
  const [mrp, setMrp] = useState(null);
  const [taxes, setTaxes] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [accordion1, setAccordion1] = useState(true);
  const [accordion2, setAccordion2] = useState(false);
  const [paypalAccordion, setPaypalAccordion] = useState(false);
  const [stripeAccordion, setStripeAccordion] = useState(false);
  const [razorpayAccordion, setRazorpayAccordion] = useState(false);
  const [codAccordion, setCodAccordion] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Load stripe
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

  // Customer id
  const customerId = router.asPath.split("cart_id_")[1];

  // Queries
  const shippingFeesQuery = useQuery(GET_SHIPPING_FEES);
  const customerQuery = useQuery(GET_CUSTOMER, {
    fetchPolicy: "network-only",
  });
  const siteSettingsQuery = useQuery(GET_SITE_SETTINGS);
  const cartQuery = useQuery(GET_CART, {
    variables: { customerId },
    fetchPolicy: "network-only",
  });

  // Logged in customer
  const customerLoggedIn = useSelector((state) => state.customer.customer);

  // Shipping
  const shipping = useSelector((state) => state.shipping.shipping);

  const shippingFeesMinValue = shipping?.minValue;
  const shippingFees = shipping?.fees;

  const expectedDeliveryDays = shipping?.expectedDelivery;

  const expectedDelivery = () => {
    const d = new Date();
    d.setDate(d.getDate() + expectedDeliveryDays);

    return new Date(d).toDateString();
  };

  // Cart
  const cart = useSelector((state) => state.cart.cart);
  const cartProducts = cart?.products;

  // Site settings
  const websiteLogo = useSelector(
    (state) => state.siteSettings.siteSettings?.logo
  );

  const paymentMethods = useSelector(
    (state) => state.siteSettings.siteSettings?.paymentMethods
  );

  // Initial value - Default address - Logged in customer
  const fullname = (firstName, lastName) => {
    if (!firstName && !lastName) {
      return null;
    }
    return [firstName, lastName].filter(Boolean).join(" ");
  };

  const customerConstructor = {
    name: fullname(customerLoggedIn.firstName, customerLoggedIn.lastName),
    email: customerLoggedIn.email || null,
    phoneNumber: customerLoggedIn.phoneNumber || null,
    address: {
      address1: customerLoggedIn.address?.address1 || null,
      address2: customerLoggedIn.address?.address2 || null,
      city: customerLoggedIn.address?.city || null,
      state: customerLoggedIn.address?.state || null,
      country: customerLoggedIn.address?.country || null,
      postal_code: customerLoggedIn.address?.postal_code || null,
    },
  };

  // Separate useEffect for Stripe initialize
  useEffect(() => {
    // Initializing only when Stripe available for payment
    const initializeStripePayment = async () => {
      if (customer !== null && cartValue) {
        if (!paymentMethods?.includes("stripe")) {
          return;
        }

        try {
          const response = await axios.post(
            process.env.NEXT_PUBLIC_API_URL + "stripe",
            {
              name: customer.name,
              email: customer.email,
              phoneNumber: customer.phoneNumber,
              address: {
                address1: customer.address.address1,
                address2: customer.address.address2,
                city: customer.address.city,
                state: customer.address.state,
                country: customer.address.country,
                postal_code: customer.address.postal_code,
              },
              stripeCusId: customer.stripeCusId,
              amount: cartValue,
              paymentIntentId,
            }
          );

          setClientSecret(response.data.clientSecret);
          setPaymentIntentId(response.data.paymentIntentId);

          // Updating the logged in customer stripeCusId
          if (customerLoggedIn.stripeCusId === null) {
            await updateCustomer({
              variables: {
                id: customerLoggedIn.id,
                email: customerLoggedIn.email,
                stripeCusId: customerId,
              },
            });
          }
        } catch (error) {
          ToastStatus("Error", "Stripe initialization failed");
        }
      }
    };

    initializeStripePayment();
  }, [cartValue, customer]);

  useEffect(() => {
    const customerData = customerQuery?.data?.getCustomer;

    if (customerData) {
      dispatch(getCustomer(customerData));
    }

    const shippingData = shippingFeesQuery?.data?.getShipping;

    if (shippingData) {
      dispatch(getShipping(shippingData));
    }

    const siteSettingsData = siteSettingsQuery?.data?.getSiteSettings;

    if (siteSettingsData) {
      dispatch(getSiteSettings(siteSettingsData));
    }

    const cartData = cartQuery.data?.getCart;

    if (cartData && customerId) {
      //Redirecting to 404 page if customer id is incorrect
      if (cartData.products.length > 0 && cartData.customerId === customerId) {
        dispatch(getCart(cartData));
      } else {
        router.push("/404");
      }
    }

    // Removing null values from customerConstructor
    const customerObject = {
      name: customerConstructor.name,
      email: customerConstructor.email || null,
      phoneNumber: customerConstructor.phoneNumber || null,
      address1: customerConstructor.address?.address1 || null,
      address2: customerConstructor.address?.address2 || null,
      city: customerConstructor.address?.city || null,
      state: customerConstructor.address?.state || null,
      country: customerConstructor.address?.country || null,
      postal_code: customerConstructor.address?.postal_code || null,
    };

    Object.keys(customerObject).forEach((key) => {
      if (customerObject[key] === null) {
        delete customerObject[key];
      }
    });

    // Setting default address for logged in customer
    if (customer === null && defaultAddress) {
      if (
        Object.keys(customerObject).length === 9 ||
        (Object.keys(customerObject).length === 8 && !customerObject.address2)
      ) {
        setCustomer(customerConstructor);
      }
    }
  }, [
    customerQuery,
    shippingFeesQuery,
    siteSettingsQuery,
    customerConstructor,
  ]);

  // Cart calculation
  useEffect(() => {
    let totalQuantity = 0;
    let priceWithoutTax = 0; // All products price without taxes (MRP)
    let priceWithDiscount = 0; // All products price with taxes (If any coupon applied, discount will be reduced here)
    let productsTax = 0; // All products taxes only (TAXES)

    // Calculate total quantity
    cartProducts?.forEach((product) => {
      totalQuantity += product.quantity;
    });

    cartProducts?.forEach((item) => {
      // To apply tax for discounted products
      const discount = appliedCoupon ? appliedCoupon.discount : 0;

      // Calculate the discount per product
      const discountPerProduct =
        discount / (totalQuantity + cartProducts.length);

      productsTax +=
        (item.product.salePrice - discountPerProduct) *
        (item.product.tax / 100) *
        item.quantity;

      priceWithDiscount +=
        (item.product.salePrice - discountPerProduct) * item.quantity;

      priceWithoutTax += item.product.salePrice * item.quantity;
    });

    if (priceWithoutTax > shippingFeesMinValue) {
      setCartValue(priceWithDiscount + productsTax);
    } else {
      setCartValue(priceWithDiscount + productsTax + shippingFees);
    }
    // For mrp, showing only products price
    setMrp(priceWithoutTax);

    // Set products tax
    setTaxes(parseFloat(productsTax.toFixed(2)));
  }, [cartProducts, appliedCoupon, shippingFees]);

  // Stripe card  appearance
  const appearance = {
    theme: "stripe",
    labels: "floating",
    variables: {
      colorPrimary: theme.palette.primary.light,
      colorBackground: theme.palette.common.white,
      colorText: theme.palette.common.black,
      colorDanger: theme.palette.error.light,
      fontFamily: "Sen, Roboto, Helvetica",
      spacingUnit: "2px",
      borderRadius: "4px",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  // Update customer
  const [updateCustomer] = useMutation(CUSTOMERS, {
    onCompleted(data) {
      if (data.customers.status === 200) {
        dispatch(getCustomer(data.customers));
      }
    },
  });

  // Scroll to address
  const addressRef = useRef(null);

  const executeScroll = () => {
    addressRef.current.scrollIntoView();
  };

  //  Coupon Submit
  const couponSubmit = (values) => {
    if (appliedCoupon === null) {
      const valuesObject = {
        couponCode: values.coupon,
        cartValue,
      };

      checkCoupon({ variables: valuesObject });
    } else {
      // Removing the coupon
      setCartValue(cartValue + appliedCoupon.discount);
      setAppliedCoupon(null);
    }
  };

  const [checkCoupon] = useMutation(CHECK_COUPON, {
    onCompleted(data) {
      if (data.checkCoupon.status === 200) {
        // Applying the discount if coupon valid
        setCartValue(cartValue - data.checkCoupon.discount);
        setAppliedCoupon({
          couponCode: data.checkCoupon.couponCode,
          discount: data.checkCoupon.discount,
        });
        ToastStatus("Success", data.checkCoupon.message);
      } else {
        ToastStatus("Emoji", data.checkCoupon.message, "😞");
      }
    },
  });

  // Handle default address change
  const handleDefaultAddress = (value) => {
    if (value === false) {
      setCustomer(null);
      setDefaultAddress(value);
    } else {
      setDefaultAddress(value);
    }
  };

  // Handle payment/address accordion (Triggered from address component)
  const handleAccordion = (val1, val2) => {
    setAccordion1(val1);
    setAccordion2(val2);
  };

  // Triggered when customer submitted new address via form
  const handleDiffAddress = (val1, val2, val3) => {
    setCustomer(val1);
    setAccordion1(val2);
    setAccordion2(val3);
  };

  return (
    <div>
      <Seo title={"Checkout"} />
      <Toaster />
      <div className={classes.container}>
        <div className={classes.header}>
          {siteSettingsQuery.loading ? (
            <Skeleton
              animation="wave"
              variant="rounded"
              width="130px"
              height="50px"
              sx={{ bgcolor: `${theme.palette.primary.light}25` }}
            />
          ) : (
            <>
              {websiteLogo && (
                <Link href="/">
                  <CustomImage
                    src={
                      process.env.NEXT_PUBLIC_BACKEND_URL +
                      "logos/" +
                      websiteLogo
                    }
                    alt="website logo"
                    width={130}
                    height={50}
                    className={classes.logo}
                  />
                </Link>
              )}
            </>
          )}
          <div className={classes.trustContainer}>
            <CustomImage
              src={"/assets/lock.png"}
              alt="100% secure"
              width={40}
              height={40}
            />
            <Typography variant="h6" sx={{ pl: 1 }}>
              {t("checkout.riskReducer.text")}
            </Typography>
          </div>
        </div>
        <div className={classes.main}>
          <div className={classes.leftLayout}>
            <div ref={addressRef}>
              <Accordion
                expanded={accordion1}
                elevation={0}
                square={true}
                onChange={() => setAccordion1(!accordion1)}
              >
                <AccordionSummary
                  expandIcon={
                    !customerQuery.loading && (
                      <>
                        {accordion1 ? (
                          <HiChevronDown />
                        ) : (
                          <Typography variant="subtitle1">
                            {t("checkout.accordion1.edit")}
                          </Typography>
                        )}
                      </>
                    )
                  }
                  className={classes.accordionSummary}
                >
                  <Typography variant="h5" sx={{ width: "100%" }}>
                    {customerQuery.loading ? (
                      <Skeleton
                        animation="wave"
                        variant="text"
                        width="90%"
                        sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                      />
                    ) : (
                      <>{t("checkout.accordion1.title")}</>
                    )}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Address Component */}
                  {customerQuery.loading ? (
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width="100%"
                      height="200px"
                      sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                    />
                  ) : (
                    <Address
                      customer={customer}
                      customerLoggedIn={customerLoggedIn}
                      defaultAddress={defaultAddress}
                      handleDefaultAddress={handleDefaultAddress}
                      handleAccordion={handleAccordion}
                      handleDiffAddress={handleDiffAddress}
                      paymentMethods={paymentMethods}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={accordion2}
                elevation={0}
                square={true}
                onChange={() => setAccordion2(!accordion2)}
              >
                <AccordionSummary
                  expandIcon={
                    !customerQuery.loading && (
                      <>
                        {accordion2 ? (
                          <HiChevronDown />
                        ) : (
                          <Typography variant="subtitle1">
                            {t("checkout.accordion2.edit")}
                          </Typography>
                        )}
                      </>
                    )
                  }
                  className={classes.accordionSummary}
                >
                  <Typography variant="h5" sx={{ width: "100%" }}>
                    {customerQuery.loading ? (
                      <Skeleton
                        animation="wave"
                        variant="text"
                        width="90%"
                        sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                      />
                    ) : (
                      <>{t("checkout.accordion2.title")}</>
                    )}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {customerQuery.loading ? (
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width="100%"
                      height="200px"
                      sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                    />
                  ) : (
                    <>
                      {customer !== null ? (
                        <div>
                          {/* Paypal */}
                          {paymentMethods?.includes("paypal") && (
                            <Accordion
                              expanded={paypalAccordion}
                              onChange={() => {
                                setPaypalAccordion(!paypalAccordion);
                                setStripeAccordion(false);
                                setRazorpayAccordion(false);
                                setCodAccordion(false);
                              }}
                              disableGutters
                            >
                              <AccordionSummary
                                expandIcon={
                                  paypalAccordion ? (
                                    <CgRadioChecked
                                      color={theme.palette.common.black}
                                    />
                                  ) : (
                                    <CgRadioCheck />
                                  )
                                }
                                className={classes.accordionSummary}
                              >
                                <div className={classes.paymentsSummary}>
                                  <Typography variant="h6" sx={{ pl: 1 }}>
                                    {t("checkout.paypal.title")}
                                  </Typography>
                                  <CustomImage
                                    src={"/assets/paypal.png"}
                                    alt="payment logo"
                                    width={80}
                                    height={45}
                                    style={classes.paypalLogo}
                                  />
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className={classes.paypalPayment}>
                                  <div className={classes.paypalBtn}>
                                    <Paypal
                                      customer={customer}
                                      cartValue={cartValue}
                                      mrp={mrp}
                                      taxes={taxes}
                                      cartProducts={cartProducts}
                                      coupon={appliedCoupon}
                                      shippingFeesMinValue={
                                        shippingFeesMinValue
                                      }
                                      shippingFees={shippingFees}
                                      expectedDelivery={expectedDelivery()}
                                    />
                                  </div>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          )}
                          {/* Stripe */}
                          {paymentMethods?.includes("stripe") && (
                            <Accordion
                              expanded={stripeAccordion}
                              onChange={() => {
                                setPaypalAccordion(false);
                                setStripeAccordion(!stripeAccordion);
                                setRazorpayAccordion(false);
                                setCodAccordion(false);
                              }}
                              disableGutters
                            >
                              <AccordionSummary
                                expandIcon={
                                  stripeAccordion ? (
                                    <CgRadioChecked
                                      color={theme.palette.common.black}
                                    />
                                  ) : (
                                    <CgRadioCheck />
                                  )
                                }
                                className={classes.accordionSummary}
                              >
                                <div className={classes.paymentsSummary}>
                                  <Typography variant="h6" sx={{ pl: 1 }}>
                                    {t("checkout.stripe.title")}
                                  </Typography>
                                  <div>
                                    {paymentGateways.paymentGateways
                                      .slice(0, 3)
                                      .map((item, index) => {
                                        return (
                                          <div
                                            key={index}
                                            style={{ padding: "0 4px" }}
                                          >
                                            <CustomImage
                                              src={item.paymentGateway}
                                              alt="payment logo"
                                              width={30}
                                              height={30}
                                            />
                                          </div>
                                        );
                                      })}
                                    <Typography
                                      variant="subtitle2"
                                      sx={{ pl: 1 }}
                                    >
                                      {t("checkout.morePaymentOptions")}
                                    </Typography>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className={classes.stripePayment}>
                                  {clientSecret && (
                                    <Elements
                                      options={options}
                                      stripe={stripePromise}
                                    >
                                      <StripeForm
                                        customer={customer}
                                        cartValue={cartValue}
                                        mrp={mrp}
                                        taxes={taxes}
                                        cartProducts={cartProducts}
                                        coupon={appliedCoupon}
                                        shippingFeesMinValue={
                                          shippingFeesMinValue
                                        }
                                        shippingFees={shippingFees}
                                        expectedDelivery={expectedDelivery()}
                                      />
                                    </Elements>
                                  )}
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          )}
                          {/* Razorpay */}
                          {paymentMethods?.includes("razorpay") && (
                            <Accordion
                              expanded={razorpayAccordion}
                              onChange={() => {
                                setPaypalAccordion(false);
                                setStripeAccordion(false);
                                setRazorpayAccordion(!razorpayAccordion);
                                setCodAccordion(false);
                              }}
                              disableGutters
                            >
                              <AccordionSummary
                                expandIcon={
                                  razorpayAccordion ? (
                                    <CgRadioChecked
                                      color={theme.palette.common.black}
                                    />
                                  ) : (
                                    <CgRadioCheck />
                                  )
                                }
                                className={classes.accordionSummary}
                              >
                                <div className={classes.paymentsSummary}>
                                  <Typography variant="h6" sx={{ pl: 1 }}>
                                    {t("checkout.razorpay.title")}
                                  </Typography>
                                  <div>
                                    {paymentGateways.paymentGateways
                                      .slice(4)
                                      .map((item, index) => {
                                        return (
                                          <div
                                            key={index}
                                            style={{ padding: "0 4px" }}
                                          >
                                            <CustomImage
                                              src={item.paymentGateway}
                                              alt="payment logo"
                                              width={30}
                                              height={30}
                                            />
                                          </div>
                                        );
                                      })}
                                    <Typography variant="subtitle2">
                                      {t("checkout.morePaymentOptions")}
                                    </Typography>
                                  </div>
                                </div>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className={classes.razorpayPayment}>
                                  <Razorpay
                                    customer={customer}
                                    cartValue={cartValue}
                                    mrp={mrp}
                                    taxes={taxes}
                                    cartProducts={cartProducts}
                                    coupon={appliedCoupon}
                                    shippingFeesMinValue={shippingFeesMinValue}
                                    shippingFees={shippingFees}
                                    expectedDelivery={expectedDelivery()}
                                  />
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          )}
                          {/* Cash on delivery*/}
                          {paymentMethods?.includes("cod") && (
                            <Accordion
                              expanded={codAccordion}
                              onChange={() => {
                                setPaypalAccordion(false);
                                setStripeAccordion(false);
                                setRazorpayAccordion(false);
                                setCodAccordion(!codAccordion);
                              }}
                              disableGutters
                            >
                              <AccordionSummary
                                expandIcon={
                                  codAccordion ? (
                                    <CgRadioChecked
                                      color={theme.palette.common.black}
                                    />
                                  ) : (
                                    <CgRadioCheck />
                                  )
                                }
                                className={classes.accordionSummary}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{ pl: 1, pt: 0.5, pb: 0.5 }}
                                >
                                  {t("checkout.cod.title")}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className={classes.razorpayPayment}>
                                  <CashOnDelivery
                                    customer={customer}
                                    cartValue={cartValue}
                                    mrp={mrp}
                                    taxes={taxes}
                                    cartProducts={cartProducts}
                                    coupon={appliedCoupon}
                                    shippingFeesMinValue={shippingFeesMinValue}
                                    shippingFees={shippingFees}
                                    expectedDelivery={expectedDelivery()}
                                  />
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          )}
                        </div>
                      ) : (
                        <div className={classes.noAddress}>
                          <Typography variant="h6">
                            {t("checkout.address.empty")}
                          </Typography>
                          <div
                            className={classes.btn}
                            onClick={() => {
                              setAccordion1(true);
                              setAccordion2(false);
                              executeScroll();
                            }}
                          >
                            <SecondaryButton
                              text={t("checkout.enterAddress")}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
          <div className={classes.rightLayout}>
            <div>
              <Typography variant="h5" sx={{ pb: 2 }}>
                {cartQuery.loading ? (
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width="80%"
                    sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                  />
                ) : (
                  <>{t("checkout.orderSummary.title")}</>
                )}
              </Typography>
              {cartQuery.loading ? (
                <Skeletons type="cart" />
              ) : (
                <>
                  {cartProducts?.map((item, index) => (
                    <div className={classes.product} key={index}>
                      <div className={classes.productContent}>
                        <div className={classes.productImage}>
                          <CustomImage
                            src={
                              process.env.NEXT_PUBLIC_BACKEND_URL +
                              "product/" +
                              item.product.images[0]
                            }
                            alt="product"
                            width={80}
                            height={80}
                          />
                          <Typography
                            variant="subtitle1"
                            className={classes.quantity}
                          >
                            {item.quantity}
                          </Typography>
                        </div>
                        <div style={{ marginLeft: "15px" }}>
                          <Typography variant="subtitle1">
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
                      <div className={classes.productAction}>
                        <Typography variant="subtitle1">
                          {CurrencyConverter(item.product.salePrice)}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <Form
                onSubmit={couponSubmit}
                initialValues={
                  !appliedCoupon && {
                    coupon: "",
                  }
                }
              >
                {({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} className={classes.applyCoupon}>
                    <div className={classes.couponField}>
                      {cartQuery.loading ? (
                        <Skeleton
                          animation="wave"
                          variant="rounded"
                          width="90%"
                          height="50px"
                          sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                        />
                      ) : (
                        <Field
                          name="coupon"
                          component={FormTextField}
                          placeholder={t("checkout.coupon.enter")}
                        />
                      )}
                    </div>
                    <div>
                      <SecondaryButton
                        type="submit"
                        text={
                          appliedCoupon === null
                            ? t("checkout.coupon.apply")
                            : t("checkout.coupon.remove")
                        }
                        isLoading={cartQuery.loading}
                      />
                    </div>
                  </form>
                )}
              </Form>
              <div className={classes.pricing}>
                <div>
                  {cartQuery.loading ? (
                    <Skeleton
                      animation="wave"
                      variant="text"
                      width="100%"
                      sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                    />
                  ) : (
                    <>
                      <Typography variant="subtitle1">
                        {t("checkout.pricing.mrp")}
                      </Typography>
                      <Typography variant="subtitle1">
                        {CurrencyConverter(mrp)}
                      </Typography>
                    </>
                  )}
                </div>
                <div>
                  {cartQuery.loading ? (
                    <Skeleton
                      animation="wave"
                      variant="text"
                      width="100%"
                      sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                    />
                  ) : (
                    <>
                      {mrp > shippingFeesMinValue ? (
                        <>
                          <Typography variant="subtitle1">
                            {t("checkout.shipping.text")}
                          </Typography>
                          <Typography variant="subtitle1">
                            {t("checkout.shipping.free")}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="subtitle1">
                            {t("checkout.shipping.text")}
                          </Typography>
                          <Typography variant="subtitle1">
                            {CurrencyConverter(shippingFees)}
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div>
                  {cartQuery.loading ? (
                    <Skeleton
                      animation="wave"
                      variant="text"
                      width="100%"
                      sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                    />
                  ) : (
                    <>
                      {appliedCoupon && (
                        <>
                          <Typography variant="subtitle1">
                            {t("checkout.coupon.text")}{" "}
                            <span className={classes.couponCode}>
                              {appliedCoupon.couponCode}
                            </span>
                          </Typography>
                          <Typography variant="subtitle1">
                            - {CurrencyConverter(appliedCoupon.discount)}
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </div>
                <div>
                  {cartQuery.loading ? (
                    <Skeleton
                      animation="wave"
                      variant="text"
                      width="100%"
                      sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                    />
                  ) : (
                    <>
                      <Typography variant="subtitle1">
                        {t("checkout.taxes.text")}
                      </Typography>
                      <Typography variant="subtitle1">
                        {CurrencyConverter(taxes)}
                      </Typography>
                    </>
                  )}
                </div>
                <div className={classes.totalAmount}>
                  {cartQuery.loading ? (
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width="100%"
                      height="50px"
                      sx={{ bgcolor: `${theme.palette.primary.light}25` }}
                    />
                  ) : (
                    <>
                      <Typography variant="h6">
                        {t("checkout.pricing.total")}
                      </Typography>
                      <Typography variant="h4">
                        {CurrencyConverter(cartValue)}
                      </Typography>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.footer}>
          <div className={classes.paymentsContainer}>
            {paymentGateways.paymentGateways.map((item, index) => {
              return (
                <div key={index}>
                  <CustomImage
                    src={item.paymentGateway}
                    alt="payment logo"
                    width={30}
                    height={30}
                  />
                </div>
              );
            })}
          </div>
          <CustomLink
            href="/help"
            text={t("checkout.help")}
            color={true}
            hover={true}
          />
        </div>
      </div>
    </div>
  );
}

export { getServerSideProps };
