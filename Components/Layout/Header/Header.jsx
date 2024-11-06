// ** Next, React And Locals Imports
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_CART } from "@/Queries/Cart.js";
import { getCart } from "@/Redux/slices/cart.js";
import Layout1 from "./Layout1/Layout1";
import Layout2 from "./Layout2/Layout2";

// ** Third Party Imports
import { useQuery } from "@apollo/client";

function Header({ settings, productSettings, isAuth }) {
  const dispatch = useDispatch();

  // Customer Id - Cart
  let customerId;

  if (typeof window !== "undefined") {
    customerId = localStorage.getItem("cart");
  }

  // Header Type
  const headerType = settings?.headerLayout;

  // Product Categories
  const categories = productSettings?.categories;

  // Logo
  const websiteLogo = settings?.logo;

  // Cart
  const { data } = useQuery(GET_CART, {
    variables: { customerId },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getCart) {
      dispatch(getCart(data.getCart));

      // Setting the customerId as cart in localStorage, when it's not present
      if (customerId === null && data?.getCart?.customerId) {
        localStorage.setItem("cart", data?.getCart?.customerId);
      }
    }
  }, [data, dispatch]);

  const cart = useSelector((state) => state.cart.cart?.products);

  let totalQuantity;

  if (cart?.length > 0) {
    const cartQuantity = [];

    cart.map((product) => cartQuantity.push(product.quantity));

    totalQuantity = cartQuantity.reduce((a, b) => {
      return a + b;
    }, 0);
  }

  return (
    <div>
      {headerType === "headerType1" && (
        <Layout1
          categories={categories}
          websiteLogo={websiteLogo}
          totalQuantity={totalQuantity}
          isAuth={isAuth}
        />
      )}
      {headerType === "headerType2" && (
        <Layout2
          categories={categories}
          websiteLogo={websiteLogo}
          totalQuantity={totalQuantity}
          isAuth={isAuth}
        />
      )}
    </div>
  );
}

export default Header;
