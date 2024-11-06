// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    content: {
      maxWidth: "1200px",
      padding: "75px",
      [theme.breakpoints.down("sm")]: {
        padding: "50px 20px",
      },
    },
  };
});

export default useStyles;
