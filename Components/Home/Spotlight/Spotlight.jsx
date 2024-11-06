// ** Next, React And Locals Imports
import Link from "next/link";
import CustomImage from "@/Components/Image/CustomImage";
import theme from "@/mui/theme.js";
import useStyles from "./styles.js";

// ** MUI Imports
import Skeleton from "@mui/material/Skeleton";

function Spotlight({ spotlight, settings, loading }) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      {!loading ? (
        <>
          {settings?.spotlight1 && spotlight === "spotlight1" && (
            <Link href={settings.spotlight1Link}>
              {settings.spotlight1Image && (
                <CustomImage
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "uploads/" +
                    settings.spotlight1Image
                  }
                  alt={"spotlight"}
                  fill={"true"}
                  style={classes.spotlightImage}
                />
              )}
            </Link>
          )}
          {settings?.spotlight2 && spotlight === "spotlight2" && (
            <Link href={settings.spotlight2Link}>
              {settings.spotlight2Image && (
                <CustomImage
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "uploads/" +
                    settings.spotlight2Image
                  }
                  alt={"spotlight"}
                  fill={"true"}
                  style={classes.spotlightImage}
                />
              )}
            </Link>
          )}
        </>
      ) : (
        <Skeleton
          animation="wave"
          variant="rounded"
          width={"100%"}
          height={"100%"}
          sx={{
            bgcolor: `${theme.palette.primary.light}25`,
          }}
          className={classes.spotlightImage}
        />
      )}
    </div>
  );
}

export default Spotlight;
