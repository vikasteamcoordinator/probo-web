// ** Next, React And Locals Imports
import PrimaryButton from "@/Components/Button/PrimaryButton";
import theme from "@/mui/theme.js";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Third Party Imports
import { BsCart2 } from "react-icons/bs";

function Layout1({ settings }) {
  const { classes } = useStyles();

  // Background image (based on screen size)
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const bgImage = isLargeScreen
    ? settings?.heroImagesLarge?.[0]
    : settings?.heroImagesSmall?.[0];

  return (
    <div
      className={`${classes.container} ${
        isLargeScreen ? classes.largeScreen : classes.smallScreen
      }`}
      style={{
        backgroundImage: `url(
            ${process.env.NEXT_PUBLIC_BACKEND_URL + "uploads/" + bgImage})`,
      }}
    >
      <div className={classes.content}>
        <Typography variant="h1" className={classes.heading}>
          {settings?.heroHeading}
        </Typography>
        <Typography variant="subtitle1" className={classes.subHeading}>
          {settings?.heroSubHeading}
        </Typography>
        <PrimaryButton
          href={settings?.heroLink}
          text={settings?.heroBtnText}
          endIcon={<BsCart2 />}
          style={classes.btn}
        />
      </div>
    </div>
  );
}

export default Layout1;
