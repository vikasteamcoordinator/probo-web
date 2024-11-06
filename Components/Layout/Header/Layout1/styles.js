// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      width: "100%",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "5px 50px",
      position: "relative ",
      boxShadow: "0 4px 2px -2px rgba(0,0,0,.1)",
      [theme.breakpoints.down("sm")]: {
        padding: "5px 10px",
      },
    },
    sticky: {
      position: "fixed",
      top: 0,
      backgroundColor: theme.palette.common.white,
      zIndex: "1000",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    hamBurgerMenu: {
      display: "none",
      width: "25%",
      [theme.breakpoints.down("lg")]: {
        display: "flex",
      },
    },
    categories: {
      width: "40%",
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("lg")]: {
        display: "none",
      },
    },
    category: {
      marginRight: "25px",
      cursor: "pointer",
      textTransform: "capitalize",
    },
    logoContainer: {
      width: "20%",
      textAlign: "center",
      paddingTop: "10px",
      cursor: "pointer",
      "& > div": {
        maxWidth: "120px",
        margin: "0 auto",
        [theme.breakpoints.down("sm")]: {
          maxWidth: "100px",
        },
      },
      [theme.breakpoints.down("lg")]: {
        width: "40%",
      },
    },
    essentials: {
      width: "40%",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      [theme.breakpoints.down("lg")]: {
        width: "30%",
      },
    },
    icon: {
      display: "flex",
      marginLeft: "20px",
      cursor: "pointer",
      "& > div": {
        display: "flex",
      },
    },
    profileIcon: {
      position: "relative",
      [theme.breakpoints.down("lg")]: {
        display: "none",
      },
    },
    intlIcon: {
      [theme.breakpoints.down("lg")]: {
        display: "none",
      },
    },
    cartIcon: {
      position: "relative",
    },
    cartQuantity: {
      position: "absolute",
      top: "-10px",
      right: "-10px",
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      width: "10px",
      height: "10px",
      padding: "10px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    profileModal: {
      position: "absolute",
      top: "60px",
      right: "-30px",
      zIndex: "100",
    },
  };
});

export default useStyles;
