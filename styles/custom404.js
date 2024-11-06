// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      width: "100%",
    },
    main: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "100px 25px",
    },
    btns: {
      textAlign: "center",
      marginTop: "20px",
    },
    btn: {
      marginTop: "35px",
    },
  };
});

export default useStyles;
