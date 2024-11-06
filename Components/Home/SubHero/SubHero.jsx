// ** Next, React And Locals Imports
import Link from "next/link";
import CustomImage from "@/Components/Image/CustomImage";
import theme from "@/mui/theme.js";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

function SubHero({ settings, loading }) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        {!loading ? (
          <>{settings?.subHeroTitle}</>
        ) : (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{
              bgcolor: `${theme.palette.primary.light}25`,
              maxWidth: "300px",
            }}
          />
        )}
      </Typography>
      <Grid container spacing={3}>
        {!loading ? (
          <>
            {settings?.subHeroImages?.map((item, index) => (
              <Grid
                key={index}
                item
                xl={4}
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className={classes.subHeroGrid}
              >
                <div className={classes.main}>
                  <CustomImage
                    src={
                      process.env.NEXT_PUBLIC_BACKEND_URL + "uploads/" + item
                    }
                    alt={settings.subHeroHeading[index]}
                    fill={true}
                  />
                  <div className={classes.subHeroContent}>
                    <Typography variant="h2" className={classes.subHeroText}>
                      {settings.subHeroHeading[index]}
                    </Typography>
                    <Link href={settings.subHeroLink[index]}>
                      <Typography
                        variant="subtitle1"
                        className={classes.action}
                      >
                        {settings.subHeroBtnText[index]}
                      </Typography>
                    </Link>
                  </div>
                </div>
              </Grid>
            ))}
          </>
        ) : (
          <>
            {Array.from({ length: 3 }, (_, index) => index).map((item) => (
              <Grid
                key={item}
                item
                xl={4}
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className={classes.subHeroGrid}
              >
                <div className={classes.main}>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width={"100%"}
                    height={"100%"}
                    sx={{
                      bgcolor: `${theme.palette.primary.light}25`,
                    }}
                  />
                </div>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </div>
  );
}

export default SubHero;
