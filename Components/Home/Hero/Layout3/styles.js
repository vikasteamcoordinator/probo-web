// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      position: "relative",
    },
    slider: {
      "&  .slick-dots": {
        bottom: "25px !important",
        "&  li": {
          "&.slick-active > button:before": {
            color: theme.palette.primary.dark,
          },
          "& button": {
            "&:before": {
              color: theme.palette.common.white,
              fontSize: "12px",
            },
          },
        },
      },
    },
    largeScreen: {
      aspectRatio: "16/6",
    },
    smallScreen: {
      aspectRatio: "4/5",
    },
    prevNextBtn: {
      width: "100%",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: "100",
      display: "flex",
      justifyContent: "space-between",
      padding: "0 10px",
    },
    arrow: {
      color: theme.palette.common.white,
      cursor: "pointer",
    },
  };
});

export default useStyles;
