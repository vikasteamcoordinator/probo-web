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
    cardMain: {
      position: "relative",
      cursor: "pointer",
      "&:hover": {
        "& > a > div > div": {
          opacity: 1,
        },
      },
    },
    imageContainer: {
      display: "grid",
    },
    cardImageHover: {
      opacity: "0",
      transition: "opacity .2s",
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    productImage: {
      aspectRatio: "3/3.5",
    },
    title: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      [theme.breakpoints.down("sm")]: {
        fontSize: "15px !important",
      },
    },
    discount: {
      position: "absolute",
      top: "10px",
      left: "10px",
      padding: "3px 8px 0px",
      fontSize: "12px",
      fontWeight: "500",
      borderRadius: "5px",
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      [theme.breakpoints.down("sm")]: {
        top: "5px",
        left: "5px",
        padding: "2px 6px",
        fontSize: "10px",
      },
    },
    trendingIcon: {
      display: "grid",
      placeItems: "center",
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: theme.palette.common.white,
      borderRadius: "50%",
      border: `1px solid ${theme.palette.grey[400]}`,
      width: "35px",
      height: "35px",
      "& > img": {
        padding: "5px",
        [theme.breakpoints.down("sm")]: {
          padding: "3px",
        },
      },
      [theme.breakpoints.down("sm")]: {
        top: "5px",
        right: "5px",
        width: "25px",
        height: "25px",
      },
    },
    wishlistIcon: {
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: theme.palette.common.white,
      borderRadius: "20px",
      fontSize: "1.5em",
      padding: "3px",
      [theme.breakpoints.down("sm")]: {
        top: "10px",
        right: "10px",
        fontSize: "1.2em",
      },
    },
    cardContent: {
      margin: "15px 0",
      textAlign: "center",
      [theme.breakpoints.down("sm")]: {
        padding: "0 5px",
        margin: "10px 0",
      },
    },
    price: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
    salePrice: {
      fontSize: "16px !important",
      color: theme.palette.error.light,
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
  };
});

export default useStyles;
