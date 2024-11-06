// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      position: "relative",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      overflow: "hidden",
      marginBottom: "10px",
    },
    largeScreen: {
      aspectRatio: "16/6",
    },
    smallScreen: {
      aspectRatio: "4/5",
    },
    content: {
      position: "absolute",
      width: "100%",
      bottom: "7%",
      left: "50%",
      transform: "translateX(-50%)",
      textAlign: "center",
      padding: "0 10px",
    },
    heading: {
      textTransform: "uppercase",
      maxWidth: "550px",
      margin: "0 auto 15px",
      color: theme.palette.common.white,
    },
    countDownContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "25px",
    },
    countDownTimer: {
      display: "flex",
      alignItems: "center",
      backgroundColor: theme.palette.common.white,
      border: `7px solid ${theme.palette.primary.main}20`,
      borderRadius: "2px",
      margin: "0 7px",
      padding: "10px",
      [theme.breakpoints.down("sm")]: {
        margin: "0 5px",
        border: `5px solid ${theme.palette.primary.main}20`,
      },
    },
    btn: {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: `${theme.palette.common.white} !important`,
      border: `7px solid ${theme.palette.primary.dark} !important`,
      boxShadow: "none !important",
    },
  };
});

export default useStyles;
