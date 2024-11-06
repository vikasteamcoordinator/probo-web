// ** MUI Imports
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => {
  return {
    bgImg: {
      width: "100vw",
      height: "100vh",
      backgroundImage: `url(${"/assets/banner2.webp"})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(2px)",
    },
    form: {
      width: "400px",
      maxWidth: "90%",
      maxHeight: "80%",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      padding: "20px",
      overflowY: "auto",
    },
    content: {
      padding: "10px 0",
      "& div": {
        display: "flex",
      },
    },
    formField: {
      width: "100%",
      margin: "20px 0px 10px",
      "& .MuiTextField-root": {
        width: "100%",
      },
    },
    actionBtn: {
      margin: "25px 0 10px",
    },
  };
});

export default useStyles;
