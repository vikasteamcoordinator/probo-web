// ** Next, React And Locals Imports
import { CREATE_ORDER } from "@/Queries/Orders.js";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import theme from "@/mui/theme.js";

// ** Third Party Imports
import axios from "axios";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";

function Razorpay({
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
  //Translation
  const { t } = useTranslation();

  // Customer Id - Cart
  const customerId = localStorage.getItem("cart");

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_URL);

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "razorpay",
      {
        amount: cartValue,
      }
    );

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount.toString(),
      currency: currency,
      name: process.env.NEXT_PUBLIC_SITE_NAME,
      description: process.env.NEXT_PUBLIC_CLIENT_WEBSITE_DESC,
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + "razorpay/success",
          data
        );

        //No error, Creating the order
        if (result.status === 200) {
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
              paymentMethod: "razorpay",
              paymentStatus: "paid",
              mrp,
              taxes,
              totalAmount: cartValue,
              shippingFees: shippingCost,
              expectedDelivery,
            },
          });
        } else {
          alert("Payment Failed");
        }
      },
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
      },
      notes: {
        pincode: customer.postal_code,
      },
      theme: {
        color: theme.palette.primary.main,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
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
    <div onClick={displayRazorpay}>
      <PrimaryButton text={t("checkout.razorpay.title")} spinner={loading} />
    </div>
  );
}

export default Razorpay;
