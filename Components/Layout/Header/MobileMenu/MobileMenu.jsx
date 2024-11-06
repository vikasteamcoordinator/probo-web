// ** Next, React And Locals Imports
import { useState } from "react";
import { useRouter } from "next/router";
import { LOGOUT } from "@/Queries/Auth.js";
import CapitalizeText from "@/Helpers/CapitalizeText.js";
import FormatLink from "@/Helpers/FormatLink.js";
import CustomLink from "@/Components/Link/CustomLink";
import LangCurrency from "../LangCurrency/LangCurrency";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

// ** Third Party Imports
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdClose } from "react-icons/md";

function MobileMenu({ mobileMenu, categories, isAuth, closeMenu }) {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // States
  const [showCategories, setShowCategories] = useState(false);
  const [langCurrency, setLangCurrency] = useState(false);

  // Essentials
  const essentials = [
    { page: t("mobileMenu.essentials.profile"), link: "profile" },
    { page: t("mobileMenu.essentials.wishlist"), link: "profile/wishlist" },
    { page: t("mobileMenu.essentials.help"), link: "Help" },
  ];

  // Handle language & currency modal
  const handleIntlModal = () => {
    setLangCurrency(!langCurrency);
  };

  // Logout
  const handleLogout = () => {
    logout();
  };

  const [logout] = useMutation(LOGOUT, {
    onCompleted(data) {
      // Removing all items from local storage
      localStorage.clear();

      router.push("/login");
    },
  });

  return (
    <div>
      {mobileMenu && (
        <div className={classes.container}>
          <div className={classes.mobileMenu}>
            <div className={classes.closeIcon}>
              <MdClose fontSize={"1.5em"} onClick={closeMenu} />
            </div>
            {/* Shop All */}
            <Typography variant="h5" className={classes.menu}>
              <CustomLink text={t("mobileMenu.shop")} href={"/shop"} />
            </Typography>
            {/* Categories */}
            <div>
              <Typography
                variant="h5"
                className={classes.menu}
                onClick={() => setShowCategories(!showCategories)}
              >
                {t("mobileMenu.categories")}
                {showCategories ? (
                  <BsChevronUp sx={{ ml: 1 }} />
                ) : (
                  <BsChevronDown sx={{ ml: 1 }} />
                )}
              </Typography>
              {showCategories && (
                <>
                  {categories.map((category, index) => {
                    return (
                      <Typography
                        key={index}
                        variant="h5"
                        className={`${classes.menu} ${classes.subMenu}`}
                      >
                        <CustomLink
                          text={CapitalizeText(category)}
                          href={`${"/shop/" + FormatLink(category)}`}
                        />
                      </Typography>
                    );
                  })}
                </>
              )}
            </div>
            {/* Essentials */}
            <div>
              {essentials.map((item, index) => {
                return (
                  <Typography key={index} variant="h5" className={classes.menu}>
                    <CustomLink
                      text={item.page}
                      href={`/${FormatLink(item.link)}`}
                    />
                  </Typography>
                );
              })}
            </div>
            {/* Change language / Currency */}
            <Typography
              variant="h5"
              className={classes.menu}
              onClick={() => handleIntlModal()}
            >
              {t("mobileMenu.changeLangCurrency")}
            </Typography>
            {/* Login & Logout */}
            <div>
              {isAuth ? (
                <Typography
                  variant="h5"
                  className={classes.menu}
                  onClick={handleLogout}
                >
                  {t("mobileMenu.logout")}
                </Typography>
              ) : (
                <Typography variant="h5" className={classes.menu}>
                  <CustomLink text={t("mobileMenu.login")} href={"/login"} />
                </Typography>
              )}
            </div>
            {/* Language & currency modal */}
            <Modal open={langCurrency} onClose={handleIntlModal}>
              <LangCurrency handleIntlModal={handleIntlModal} />
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
