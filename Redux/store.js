// ** Third Party Imports
import { configureStore } from "@reduxjs/toolkit";

// ** Slices
import homepage from "./slices/homepage.js";
import productSettings from "./slices/productSettings.js";
import products from "./slices/products.js";
import siteSettings from "./slices/siteSettings.js";
import shipping from "./slices/shipping.js";
import coupons from "./slices/coupons.js";
import cart from "./slices/cart.js";
import customer from "./slices/customer.js";
import orders from "./slices/orders.js";

// ** Store
const store = configureStore({
  reducer: {
    homepage,
    productSettings,
    products,
    siteSettings,
    shipping,
    coupons,
    cart,
    customer,
    orders,
  },
});

export default store;
