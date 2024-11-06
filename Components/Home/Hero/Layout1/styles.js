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
      top: "50%",
      left: "7%",
      transform: "translateY(-50%)",
      maxWidth: "550px",
      color: theme.palette.common.white,
      padding: "0 10px",
    },
    heading: {
      textTransform: "uppercase",
      marginBottom: "10px",
    },
    subHeading: {
      marginBottom: "30px",
      opacity: "0.8",
      [theme.breakpoints.down("sm")]: {
        marginBottom: "15px",
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
