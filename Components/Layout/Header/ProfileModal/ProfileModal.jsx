// ** Next, React And Locals Imports
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "@/Queries/Auth.js";
import { GET_CUSTOMER } from "@/Queries/Customers.js";
import { getCustomer } from "@/Redux/slices/customer.js";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";

// ** Third Party Imports
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";

function ProfileModal({ closeModal, isAuth }) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // Queries
  const { data, loading } = useQuery(GET_CUSTOMER);

  useEffect(() => {
    const customerData = data?.getCustomer;

    if (customerData) {
      dispatch(getCustomer(customerData));
    }
  }, [data]);

  const customer = useSelector((state) => state.customer.customer);

  // Close Profile Modal
  const handleCloseModal = () => {
    closeModal();
  };

  // Detect Outside Click
  const modal = useRef(null);

  const useDetectOutsideClick = (ref) => {
    useEffect(() => {
      // Function for click event
      const handleOutsideClick = (event) => {
        if (
          !ref.current.contains(event.target) &&
          event.target.parentNode.parentNode?.id !== "profileIcon"
        ) {
          handleCloseModal();
        }
      };

      // Adding click event listener
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }, [ref]);
  };

  useDetectOutsideClick(modal);

  //Logout
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
      {!loading && (
        <div className={classes.container} ref={modal}>
          {isAuth ? (
            <Paper>
              <Box>
                <Typography variant="h5" sx={{ p: 2 }}>
                  {t("header.profileModal.hey")},{" "}
                  {customer?.firstName
                    ? customer.firstName
                    : t("header.profileModal.friend")}
                  👋
                </Typography>
              </Box>
              <Divider />
              <Link href="/profile">
                <MenuItem>
                  <Box>
                    <Typography variant="subtitle1">
                      {t("header.profileModal.profile")}
                    </Typography>
                  </Box>
                </MenuItem>
              </Link>
              <Link href="/profile/wishlist">
                <MenuItem>
                  <Box>
                    <Typography variant="subtitle1">
                      {t("header.profileModal.wishlist")}
                    </Typography>
                  </Box>
                </MenuItem>
              </Link>
              <Link href="/profile/orders">
                <MenuItem>
                  <Box>
                    <Typography variant="subtitle1">
                      {t("header.profileModal.orders")}
                    </Typography>
                  </Box>
                </MenuItem>
              </Link>
              <MenuItem onClick={handleLogout}>
                <Box>
                  <Typography variant="subtitle1">
                    {t("header.profileModal.logout")}
                  </Typography>
                </Box>
              </MenuItem>
            </Paper>
          ) : (
            <Paper>
              <Box>
                <Typography variant="h5" sx={{ p: 2 }}>
                  {t("header.profileModal.shop")}
                </Typography>
              </Box>
              <div className={classes.btn}>
                <SecondaryButton
                  href="/login"
                  text={t("header.profileModal.login")}
                />
              </div>
            </Paper>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileModal;
