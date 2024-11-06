// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      background: `linear-gradient(to top, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    },
    content: {
      color: theme.palette.common.white,
      padding: "6px 90px",
      "& > p": {
        margin: 0,
        fontWeight: "300",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "7px 50px",
      },
    },
  };
});

export default useStyles;
