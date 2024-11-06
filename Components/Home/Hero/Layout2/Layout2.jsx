// ** Next, React And Locals Imports
import PrimaryButton from "@/Components/Button/PrimaryButton";
import theme from "@/mui/theme.js";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Third Party Imports
import Countdown, { zeroPad } from "react-countdown";
import { useTranslation } from "next-i18next";
import { BsCart2 } from "react-icons/bs";

function Layout2({ settings }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Background image (based on screen size)
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const bgImage = isLargeScreen
    ? settings?.heroImagesLarge?.[0]
    : settings?.heroImagesSmall?.[0];

  // Countdown timer
  const countDownTimer = settings?.heroCountdown;
  const now = new Date().getTime();
  const timeLeft = countDownTimer - now;

  const OnCounterComplete = () => <span> {t("home.hero.countdownEnds")}</span>;

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <OnCounterComplete />;
    } else {
      // Render a countdown
      return (
        <div className={classes.countDownContainer}>
          <div className={classes.countDownTimer}>
            <Typography variant="h2">{zeroPad(days)}</Typography>
            <Typography variant="h4" sx={{ pl: 1 }}>
              D
            </Typography>
          </div>
          <div className={classes.countDownTimer}>
            <Typography variant="h2">{zeroPad(hours)}</Typography>
            <Typography variant="h4" sx={{ pl: 1 }}>
              H
            </Typography>
          </div>
          <div className={classes.countDownTimer}>
            <Typography variant="h2">{zeroPad(minutes)}</Typography>
            <Typography variant="h4" sx={{ pl: 1 }}>
              M
            </Typography>
          </div>
          <div className={classes.countDownTimer}>
            <Typography variant="h2">{zeroPad(seconds)}</Typography>
            <Typography variant="h4" sx={{ pl: 1 }}>
              S
            </Typography>
          </div>
        </div>
      );
    }
  };

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
        {countDownTimer && (
          <>
            <Typography variant="h1" className={classes.heading}>
              {settings?.heroCountdownText}
            </Typography>
            <Countdown date={Date.now() + timeLeft} renderer={renderer} />
          </>
        )}
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

export default Layout2;
