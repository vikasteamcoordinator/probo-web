// ** Next, React And Locals Imports
import { useEffect, useState, useRef } from "react";
import { CREATE_ORDER } from "@/Queries/Orders";
import useStyles from "./styles";

// ** Third Party Imports
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";

function Paypal({
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
  const classes = useStyles();

  //Translation
  const { t } = useTranslation();

  // States
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);

  const paypalRef = useRef();

  // Customer Id - Cart
  const customerId = localStorage.getItem("cart");

  useEffect(() => {
    window.paypal
      .Buttons({
        style: {
          shape: "rect",
          height: 40,
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD", // Use default currency
                  value: cartValue,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          await actions.order.capture();
          setPaid(true);

          //No error, Creating the order
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
              paymentMethod: "paypal",
              paymentStatus: "paid",
              mrp,
              taxes,
              totalAmount: cartValue,
              shippingFees: shippingCost,
              expectedDelivery,
            },
          });
        },
        onCancel: function (data) {
          // Show a cancel page, or return to cart
          window.location.href =
            process.env.NEXT_PUBLIC_CLIENT_URL + "payment/failed";
        },
        onError: (err) => {
          setError(err);
        },
      })
      .render(paypalRef.current);
  }, [cartValue, coupon]);

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

  // If the payment has been made
  if (paid) {
    return <div>{t("checkout.paypal.success")}</div>;
  }

  // If any error occurs
  if (error) {
    return <div>{t("checkout.paypal.failed")}</div>;
  }

  return <div ref={paypalRef} className={classes.paypalBtn}></div>;
}

export default Paypal;
