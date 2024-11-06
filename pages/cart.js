// ** Next, React And Locals Imports
import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  CHANGE_CART_QUANTITY,
  DELETE_FROM_CART,
  GET_CART,
} from "@/Queries/Cart.js";
import { GET_SHIPPING_FEES } from "@/Queries/Shipping.js";
import { getCart } from "@/Redux/slices/cart.js";
import { getShipping } from "@/Redux/slices/shipping.js";
import Skeletons from "@/Components/Skeletons/Skeletons";
import Toaster from "@/Components/Toaster/Toaster";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import CustomImage from "@/Components/Image/CustomImage";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import CurrencyConverter from "@/Helpers/CurrencyConverter.js";
import useStyles from "@/styles/cart.js";
import getServerSideProps from "@/Helpers/ServerProps.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

// ** Third Party Imports
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { MdClose } from "react-icons/md";
import { BsCart2 } from "react-icons/bs";

export default function Cart() {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  //Translation
  const { t } = useTranslation();

  // Customer Id - Cart
  const customerId =
    typeof window !== "undefined" && localStorage.getItem("cart");

  // Queries
  const shippingFeesQuery = useQuery(GET_SHIPPING_FEES);

  const { data } = useQuery(GET_CART, {
    variables: { customerId },
    fetchPolicy: "network-only",
  });

  // Shipping
  const shipping = useSelector((state) => state.shipping.shipping);
  const shippingFeesMinValue = shipping?.minValue;
  const shippingFees = shipping?.fees;

  // Cart
  const cartData = data?.getCart;
  const cart = useSelector((state) => state.cart.cart);
  const cartItems = cart.products;

  useEffect(() => {
    if (shippingFeesQuery?.data) {
      dispatch(getShipping(shippingFeesQuery.data.getShipping));
    }

    if (cartData) {
      dispatch(getCart(cartData));
    }
  }, [data, dispatch, cartData, shippingFeesQuery]);

  //  cart calculation
  const cartQuantity = [];

  cartItems?.length > 0 &&
    cartItems.map((product) => {
      cartQuantity.push(product.product.salePrice * product.quantity);
    });

  const cartValue =
    cartQuantity.length > 0 && cartQuantity.reduce((a, b) => a + b);

  // Change quantity
  const handleIncrement = (productId, variantId) => {
    changeQuantity({
      variables: {
        customerId,
        productId,
        variantId,
        action: "increment",
      },
    });
  };

  const handleDecrement = (productId, variantId) => {
    changeQuantity({
      variables: {
        customerId,
        productId,
        variantId,
        action: "decrement",
      },
    });
  };

  const [changeQuantity, { loading }] = useMutation(CHANGE_CART_QUANTITY, {
    onCompleted(data) {
      if (data.changeCartQuantity.status === 200) {
        dispatch(getCart(data.changeCartQuantity));
      } else {
        ToastStatus("Error", data.changeCartQuantity.message);
      }
    },
  });

  // Remove product from cart
  const handleRemoveProduct = (productId, variantId) => {
    removeProduct({
      variables: {
        customerId,
        productId,
        variantId,
      },
    });
  };

  const [removeProduct] = useMutation(DELETE_FROM_CART, {
    onCompleted(data) {
      if (data.deleteFromCart.status === 200) {
        dispatch(getCart(data.deleteFromCart));
      } else {
        ToastStatus("Error", "Error occurred");
      }
    },
  });

  // Progress bar
  const progressBarValue = (cartValue / shippingFeesMinValue) * 100;

  return (
    <div className={classes.container}>
      <Toaster />
      {cartItems?.length > 0 ? (
        <div>
          {cartValue >= shippingFeesMinValue ? (
            <div className={classes.topCta}>
              <Typography variant="subtitle1">
                {t("cart.freeShipping.title")}
              </Typography>
              <CustomImage
                src={"/assets/peace.png"}
                alt="peace"
                width={30}
                height={30}
              />
            </div>
          ) : (
            <>
              <Typography variant="subtitle1" align="center">
                {t("cart.progressBar.text1")}
                <b>{CurrencyConverter(shippingFeesMinValue - cartValue)}</b>
                {t("cart.progressBar.text2")}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progressBarValue}
                className={classes.progressBar}
              />
            </>
          )}
          <div className={classes.products}>
            {cartItems?.map((item, index) => (
              <div key={index} className={classes.productContainer}>
                {loading ? (
                  <Skeletons type="cart" />
                ) : (
                  <div className={classes.product} key={index}>
                    <div className={classes.productContent}>
                      <CustomImage
                        src={
                          process.env.NEXT_PUBLIC_BACKEND_URL +
                          "product/" +
                          item.product.images[0]
                        }
                        alt="product"
                        width={80}
                        height={80}
                        style={classes.productImage}
                      />
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
                        <div className={classes.quantity}>
                          <span
                            onClick={() =>
                              handleDecrement(item.product._id, item.variant)
                            }
                          >
                            <b>-</b>
                          </span>
                          <Typography variant="subtitle1" sx={{ pr: 2, pl: 2 }}>
                            {item.quantity}
                          </Typography>
                          <span
                            onClick={() =>
                              handleIncrement(item.product._id, item.variant)
                            }
                          >
                            <b>+</b>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={classes.productAction}>
                      <span
                        onClick={() =>
                          handleRemoveProduct(item.product._id, item.variant)
                        }
                      >
                        <MdClose />
                      </span>
                      <Typography variant="subtitle1">
                        {CurrencyConverter(item.product.salePrice)}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={classes.addMore}>
            <Link href="/profile/wishlist">
              <Typography variant="subtitle1" sx={{ pr: 1 }}>
                {t("cart.wishlist.text")}
              </Typography>
              <CustomImage
                src={"/assets/smiley.png"}
                alt="add more from wishlist"
                width={25}
                height={25}
              />
            </Link>
          </div>
          <div className={classes.pricing}>
            <div>
              <Typography variant="subtitle1">
                {t("cart.pricing.mrp")}
              </Typography>
              <Typography variant="subtitle1">
                {CurrencyConverter(cartValue)}
              </Typography>
            </div>
            <div>
              {cartValue > shippingFeesMinValue ? (
                <>
                  <Typography variant="subtitle1">
                    {t("cart.shipping.text")}
                  </Typography>
                  <Typography variant="subtitle1">
                    {t("cart.shipping.free")}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">
                    {t("cart.shipping.text")}
                  </Typography>
                  <Typography variant="subtitle1">
                    {CurrencyConverter(shippingFees)}
                  </Typography>
                </>
              )}
            </div>
            <div className={classes.totalAmount}>
              {cartValue > shippingFeesMinValue ? (
                <>
                  <Typography variant="subtitle1">
                    {t("cart.pricing.total")}
                  </Typography>
                  <Typography variant="subtitle1">
                    {CurrencyConverter(cartValue)}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1">
                    {t("cart.pricing.total")}
                  </Typography>
                  <Typography variant="subtitle1">
                    {CurrencyConverter(cartValue + shippingFees)}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <div className={classes.actionBtn}>
            <PrimaryButton
              href={"/checkout/cart_id_" + cart.customerId}
              text={t("cart.checkout")}
              animate={true}
              isLoading={loading}
            />
          </div>
        </div>
      ) : (
        <div className={classes.emptyCart}>
          <Typography variant="subtitle1" sx={{ pt: 5 }}>
            {t("cart.empty.text")}
          </Typography>
          <div style={{ margin: "40px 0" }}>
            <CustomImage
              src={"/assets/emptyCart.webp"}
              alt="empty cart"
              width={120}
              height={120}
            />
          </div>
          <PrimaryButton
            href="/shop"
            text={t("cart.shopNow")}
            endIcon={<BsCart2 />}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
}

export { getServerSideProps };
