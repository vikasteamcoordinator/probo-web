// ** Next, React And Locals Imports
import { CREATE_ORDER } from "@/Queries/Orders.js";
import PrimaryButton from "@/Components/Button/PrimaryButton";

// ** Third Party Imports
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";

function CashOnDelivery({
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

  // Placing the order
  const placeCodOrder = () => {
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
        paymentMethod: "cod",
        paymentStatus: "unpaid",
        mrp,
        taxes,
        totalAmount: cartValue,
        shippingFees: shippingCost,
        expectedDelivery,
      },
    });
  };

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
    <div onClick={placeCodOrder}>
      <PrimaryButton text={t("checkout.cod.placeOrder")} spinner={loading} />
    </div>
  );
}
// Intl

export default CashOnDelivery;
