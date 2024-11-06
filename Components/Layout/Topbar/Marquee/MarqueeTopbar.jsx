// ** Next, React And Locals Imports
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import Marquee from "react-fast-marquee";

function MarqueeTopbar({ settings }) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Marquee pauseOnHover={true} speed={50} gradient={false}>
        {Array(20)
          .fill()
          .map(() => (
            <Typography
              dangerouslySetInnerHTML={{
                __html: settings?.topbarContent,
              }}
              variant="subtitle1"
              className={classes.content}
            />
          ))}
      </Marquee>
    </div>
  );
}

export default MarqueeTopbar;
