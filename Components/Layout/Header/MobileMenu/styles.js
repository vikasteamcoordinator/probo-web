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
    },
    mobileMenu: {
      display: "none",
      [theme.breakpoints.down("lg")]: {
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        paddingTop: "25px",
        backgroundColor: theme.palette.common.white,
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          width: "7px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.grey[200],
          borderRadius: "10px",
        },
      },
    },
    menu: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 30px",
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      [theme.breakpoints.down("sm")]: {
        padding: "20px",
      },
    },
    subMenu: {
      backgroundColor: theme.palette.grey[50],
      fontWeight: 300,
    },
    closeIcon: {
      textAlign: "right",
      marginRight: "15px",
    },
  };
});

export default useStyles;
