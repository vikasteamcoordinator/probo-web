// ** Next, React And Locals Imports
import Seo from "@/Components/Seo/Seo";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import useStyles from "@/styles/custom404.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

export default function Custom404() {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Seo title={"Not Found"} />
      <div className={classes.main}>
        <div>
          <Typography
            variant="h2"
            sx={{ fontSize: "5rem !important", fontWeight: "bolder" }}
            align="center"
          >
            404
          </Typography>
          <Typography variant="h2" sx={{ pt: 2 }} align="center">
            Page Not Found
          </Typography>
          <Typography variant="h5" sx={{ pt: 4 }} align="center">
            Perhaps we can help you find what you’re looking for...
          </Typography>
          <div className={classes.btns}>
            <div className={classes.btn}>
              <PrimaryButton href="/" text="Go To Home" fullWidth={true} />
            </div>
            <div className={classes.btn}>
              <SecondaryButton
                href="/shop"
                text="Go To Shop"
                fullWidth={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
