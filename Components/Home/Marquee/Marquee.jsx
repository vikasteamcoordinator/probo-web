// ** Next, React And Locals Imports
import theme from "@/mui/theme.js";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import HomeMarquee from "react-fast-marquee";

function Marquee({ settings, loading }) {
  const { classes } = useStyles();

  return (
    <>
      {!loading ? (
        <>
          {settings?.marquee && (
            <div className={classes.container}>
              <HomeMarquee speed={60} gradient={false}>
                {Array(20)
                  .fill()
                  .map(() => (
                    <Typography
                      dangerouslySetInnerHTML={{
                        __html: settings.marqueeText,
                      }}
                      variant="h2"
                      className={classes.content}
                    />
                  ))}
              </HomeMarquee>
            </div>
          )}
        </>
      ) : (
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"100%"}
          height={"90px"}
          sx={{
            bgcolor: `${theme.palette.primary.light}25`,
          }}
        />
      )}
    </>
  );
}

export default Marquee;
