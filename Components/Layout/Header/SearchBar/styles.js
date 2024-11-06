// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.palette.common.white,
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 999,
    },
    searchBar: {
      width: "100%",
      height: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      "& > div": {
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "7px",
      },
      "& > div > div > div": {
        borderRadius: "0px !important",
      },
    },
  };
});

export default useStyles;
