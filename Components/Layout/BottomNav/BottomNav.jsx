// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cart from "@/Components/Cart/Cart";
import useStyles from "./styles.js";

// ** MUI Imports
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

// ** Third Party Imports
import { useTranslation } from "next-i18next";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { BsCart2 } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";

function BottomNav() {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // States
  const [showNav, setShowNav] = useState(false);
  const [value, setValue] = useState(0);
  const [showCart, setShowCart] = useState(false);

  // Handle cart
  const handleCart = () => {
    setShowCart(!showCart);
  };

  // Hide bottomNav on below pages
  const pages = [
    "login",
    "register",
    "forgot-password",
    "reset-password",
    "checkout",
    "payment",
    "product",
    "404",
    "shop",
  ];

  useEffect(() => {
    const currentPage = router.pathname.split("/")[1];

    if (pages.includes(currentPage)) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [router]);

  return (
    <div>
      {showNav && (
        <div className={classes.container}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              label={t("bottomNav.home")}
              icon={
                <AiOutlineHome
                  fontSize={"2em"}
                  style={{ marginBottom: "7px" }}
                />
              }
              href="/"
            />
            <BottomNavigationAction
              label={t("bottomNav.shop")}
              icon={
                <BiCategoryAlt
                  fontSize={"2em"}
                  style={{ marginBottom: "7px" }}
                />
              }
              href="/shop"
            />
            <BottomNavigationAction
              label={t("bottomNav.profile")}
              icon={
                <RxPerson fontSize={"2em"} style={{ marginBottom: "7px" }} />
              }
              href="/profile"
            />
            <BottomNavigationAction
              label={t("bottomNav.cart")}
              icon={
                <BsCart2 fontSize={"2em"} style={{ marginBottom: "7px" }} />
              }
              onClick={() => setShowCart(!showCart)}
            />
          </BottomNavigation>
          {/* Cart */}
          {showCart && <Cart action={handleCart} />}
        </div>
      )}
    </div>
  );
}

export default BottomNav;
