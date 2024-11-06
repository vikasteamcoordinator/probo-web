// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      width: "100%",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 999,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    cartDrawer: {
      width: "40%",
      maxWidth: "450px",
      height: "100vh",
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: theme.palette.common.white,
      padding: "20px",
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        width: "7px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.grey[200],
        borderRadius: "10px",
      },
      [theme.breakpoints.down("md")]: {
        width: "90%",
      },
    },
    topCta: {
      display: "flex",
      justifyContent: "center",
    },
    progressBar: {
      marginTop: "15px",
      height: "5px",
      borderRadius: "10px",
    },
    products: {
      marginTop: "25px",
    },
    productContainer: {
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    },
    product: {
      display: "flex",
      justifyContent: "space-between",
      padding: "20px 0",
      position: "relative",
    },
    productContent: {
      display: "flex",
      alignItems: "center",
    },
    productImage: {
      objectFit: "cover",
      objectPosition: "top center",
    },
    quantity: {
      width: "100px",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      border: `2px solid ${theme.palette.grey[300]}`,
      marginTop: "10px",
      cursor: "pointer",
    },
    productAction: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    addMore: {
      "& > a": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: `1px solid ${theme.palette.grey[300]}`,
        marginTop: "25px",
        padding: "7px",
        cursor: "pointer",
      },
    },
    pricing: {
      marginTop: "25px",
      "& > div": {
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 10px",
      },
    },
    totalAmount: {
      marginTop: "15px",
      backgroundColor: theme.palette.grey[50],
    },
    actionBtn: {
      margin: "30px 0px",
    },
    emptyCart: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    closeIcon: {
      cursor: "pointer",
      opacity: "0.7",
      fontSize: "2em",
    },
  };
});

export default useStyles;
