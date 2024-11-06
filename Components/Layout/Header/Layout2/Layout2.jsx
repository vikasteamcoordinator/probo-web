// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FormatLink from "@/Helpers/FormatLink";
import Cart from "@/Components/Cart/Cart";
import CustomLink from "@/Components/Link/CustomLink";
import ProfileModal from "../ProfileModal/ProfileModal";
import CustomImage from "@/Components/Image/CustomImage";
import MobileMenu from "../MobileMenu/MobileMenu";
import LangCurrency from "../LangCurrency/LangCurrency";
import SearchBar from "../SearchBar/SearchBar";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

// ** Third Party Imports
import { Twirl as Hamburger } from "hamburger-react";
import { CiGlobe } from "react-icons/ci";
import { RxPerson } from "react-icons/rx";
import { BsCart2 } from "react-icons/bs";

function Layout2({ categories, websiteLogo, totalQuantity, isAuth }) {
  const { classes } = useStyles();
  const router = useRouter();

  // States
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [langCurrency, setLangCurrency] = useState(false);
  const [profile, setProfile] = useState(false);

  // Closing the modal when route changes
  useEffect(() => {
    setProfile(false);
  }, [router.asPath]);

  // Handle cart
  const handleCart = () => {
    setShowCart(!showCart);
  };

  // Profile modal
  const handleProfile = () => {
    setProfile(!profile);
  };

  // Handle language & currency modal
  const handleIntlModal = () => {
    setLangCurrency(!langCurrency);
  };

  // Handle menu
  const handleMenu = () => {
    setMobileMenu(false);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        {/* Hamburger menu */}
        <div className={classes.hamBurgerMenu}>
          <Hamburger toggled={mobileMenu} toggle={setMobileMenu} />
        </div>
        {/* Logo */}
        <div className={classes.logoContainer}>
          {websiteLogo ? (
            <div>
              <Link href="/">
                <CustomImage
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_URL + "logos/" + websiteLogo
                  }
                  alt="website logo"
                  fill={true}
                />
              </Link>
            </div>
          ) : (
            <Typography variant="h4">
              <CustomLink href="/" text={process.env.NEXT_PUBLIC_SITE_NAME} />
            </Typography>
          )}
        </div>
        {/* Categories */}
        <div className={classes.categories}>
          {categories?.slice(0, 4).map((category, index) => (
            <Typography key={index} variant="h6" className={classes.category}>
              <CustomLink
                text={category}
                href={"/shop/" + FormatLink(category)}
              />
            </Typography>
          ))}
        </div>
        {/* Essentials*/}
        <div className={classes.essentials}>
          <div className={classes.icon}>
            <SearchBar />
          </div>
          {/* Language & currency switcher */}
          <div className={classes.intlIcon}>
            <div className={classes.icon}>
              <CiGlobe
                fontSize={"2em"}
                onClick={() => setLangCurrency(!langCurrency)}
              />
            </div>
          </div>
          <div className={classes.profileIcon}>
            <div className={classes.icon}>
              <RxPerson
                fontSize={"2em"}
                onClick={handleProfile}
                id="profileIcon"
              />
            </div>
            <div className={classes.profileModal}>
              {profile && (
                <ProfileModal closeModal={handleProfile} isAuth={isAuth} />
              )}
            </div>
          </div>
          <div className={classes.cartIcon}>
            <div className={classes.icon}>
              <BsCart2 fontSize={"2em"} onClick={handleCart} />
            </div>
            {totalQuantity > 0 && (
              <Typography variant="subtitle2" className={classes.cartQuantity}>
                {totalQuantity}
              </Typography>
            )}
          </div>
        </div>
      </div>
      {/* Cart */}
      {showCart && <Cart action={handleCart} />}
      {/* Mobile menu */}
      <MobileMenu
        mobileMenu={mobileMenu}
        categories={categories}
        isAuth={isAuth}
        closeMenu={handleMenu}
      />
      {/* Language & currency modal */}
      <Modal open={langCurrency} onClose={handleIntlModal}>
        <LangCurrency handleIntlModal={handleIntlModal} />
      </Modal>
    </div>
  );
}

export default Layout2;
