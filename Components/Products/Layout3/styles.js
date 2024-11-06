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
      padding: "4px 8px",
      fontSize: "12px",
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey[200]}`,
      color: theme.palette.error.dark,
      [theme.breakpoints.down("sm")]: {
        top: "5px",
        left: "5px",
        padding: "2px 6px",
        fontSize: "10px",
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
      fontWeight: "700",
      color: theme.palette.error.light,
      paddingLeft: "10px",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: "5px",
      },
    },
    regularPrice: {
      opacity: "0.4",
      textDecoration: "line-through",
    },
    variantCtn: {
      display: "inline-flex",
      justifyContent: "center",
      marginTop: "5px",
      overflowX: "auto",
      width: "100%",
    },
    variant: {
      position: "relative",
      display: "inline-block",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      marginRight: "7px",
      cursor: "pointer",
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
      },
      "&::before": {
        border: `1px solid ${theme.palette.grey[400]}`, // First border color
        zIndex: 1,
      },
      "&::after": {
        border: `3px solid ${theme.palette.common.white}`, // Second border color
      },
    },
  };
});

export default useStyles;
