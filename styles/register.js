// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    container: {
      width: "100vw",
      height: "100vh",
      backgroundImage: `url(${"/assets/bg.webp"})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    },
    form: {
      width: "95%",
      maxWidth: "500px",
      maxHeight: "95%",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      padding: "20px",
      overflowY: "auto",
    },
    formField: {
      width: "100%",
      margin: "20px 0px 10px",
      "& .MuiTextField-root": {
        width: "100%",
      },
    },
    actionBtn: {
      marginTop: "25px",
    },
  };
});

export default useStyles;
