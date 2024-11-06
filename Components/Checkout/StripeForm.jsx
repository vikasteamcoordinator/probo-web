// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import { CREATE_ORDER } from "@/Queries/Orders.js";
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import useStyles from "./styles";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// ** Third Party Imports
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";

export default function StripeForm({
  customer,
  cartValue,
  mrp,
  taxes,
  cartProducts,
  coupon,
  shippingFeesMinValue,
  shippingFees,
  expectedDelivery,
}) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Stripe
  const stripe = useStripe();
  const elements = useElements();

  // Customer Id - Cart
  const customerId = localStorage.getItem("cart");

  // States
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    // No error, Creating the order
    if (!error) {
      const products = [];

      const shippingCost =
        mrp > shippingFeesMinValue ? "FREE" : shippingFees.toString();

      cartProducts.map((item) =>
        products.push({
          product: item.product._id,
          variant: item.variant,
          variantName: item.variantName,
          quantity: item.quantity,
        })
      );

      // Pushing customerId
      customer.customerId = customerId;

      createOrder({
        variables: {
          customer,
          products,
          appliedCoupon: coupon?.couponCode || null,
          couponDiscount: coupon?.discount || null,
          paymentMethod: "stripe",
          paymentStatus: "paid",
          mrp,
          taxes,
          totalAmount: cartValue,
          shippingFees: shippingCost,
          expectedDelivery,
        },
      });
    }
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted(data) {
      if (data.createOrder.status === 200) {
        window.location.href =
          process.env.NEXT_PUBLIC_CLIENT_URL +
          `payment/success/order_id=${data.createOrder._id}`;
      } else {
        window.location.href =
          process.env.NEXT_PUBLIC_CLIENT_URL + "payment/failed";
      }
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className={classes.paymentElement} />
      <div style={{ textAlign: "center" }}>
        <PrimaryButton
          type={"submit"}
          text={
            isLoading ? (
              <CircularProgress color="primary" />
            ) : (
              `${
                t("checkout.stripe.text1") +
                " " +
                CurrencyConverter(cartValue) +
                " " +
                t("checkout.stripe.text2")
              }`
            )
          }
          disabled={isLoading || !stripe || !elements}
          fullWidth={false}
        />
      </div>
      {/* Show any error or success messages */}
      {message && (
        <div className={classes.paymentMessage}>
          <Typography variant="subtitle2">{message}</Typography>
        </div>
      )}
    </form>
  );
}
