// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      display: "none",
      "& > div:first-child": {
        width: "100%",
        boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)",
        height: "65px !important",
        paddingTop: "10px",
      },
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        justifyContent: "space-around",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 998,
      },
    },
  };
});

export default useStyles;
