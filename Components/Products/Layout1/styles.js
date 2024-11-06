// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "100px 0",
      [theme.breakpoints.down("md")]: {
        margin: "75px 0",
      },
    },
    sectionTitle: {
      width: "100%",
      marginBottom: "50px",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    cardContainer: {
      width: "100%",
      maxWidth: "1400px",
    },
    card: {
      [theme.breakpoints.down("sm")]: {
        border: `0.5px solid ${theme.palette.grey[50]}`,
      },
    },
    slider: {
      outline: "none",
      "&  .slick-dots": {
        bottom: "20px !important",
        "&  li": {
          margin: 0,
          opacity: 0,
          "&.slick-active > button:before": {
            color: theme.palette.primary.dark,
          },
          "& button": {
            "&:before": {
              color: theme.palette.common.white,
              fontSize: "6px",
              opacity: 1,
            },
          },
        },
      },
      "&:hover": {
        "&  .slick-dots": {
          "&  li": {
            opacity: 1,
          },
        },
      },
    },
    productImage: {
      aspectRatio: "3/3.5",
    },
    cardContent: {
      marginTop: "5px",
      [theme.breakpoints.down("sm")]: {
        padding: "0 5px 10px",
        marginTop: "0",
      },
    },
    wishListIcon: {
      position: "absolute",
      top: "15px",
      right: "15px",
      fontSize: "1.5em",
      color: theme.palette.common.white,
      cursor: "pointer",
      [theme.breakpoints.down("sm")]: {
        top: "10px",
        right: "10px",
        fontSize: "1.3em",
      },
    },
    title: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      [theme.breakpoints.down("sm")]: {
        fontSize: "15px !important",
      },
    },
    price: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
    salePrice: {
      fontSize: "16px !important",
    },
    regularPrice: {
      opacity: "0.4",
      textDecoration: "line-through",
      paddingLeft: "7px",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: "3px",
        fontSize: "13px !important",
      },
    },
    discount: {
      color: theme.palette.error.light,
      paddingLeft: "7px",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: "3px",
        fontSize: "13px !important",
      },
    },
  };
});

export default useStyles;
