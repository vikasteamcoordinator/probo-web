// ** Next, React And Locals Imports
import CustomImage from "@/Components/Image/CustomImage";
import theme from "@/mui/theme.js";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

function RiskReducers({ settings, loading }) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.reducersContainer}>
        {!loading ? (
          <>
            {settings?.riskReducersImages?.map((item, index) => (
              <div className={classes.riskReducer} key={index}>
                <div className={classes.riskReducerImage}>
                  <CustomImage
                    src={
                      process.env.NEXT_PUBLIC_BACKEND_URL + "uploads/" + item
                    }
                    alt="risk reducers icon"
                    width={60}
                    height={60}
                  />
                </div>
                <div>
                  <Typography variant="h5">
                    {settings.riskReducersHeading[index]}
                  </Typography>
                  <Typography variant="subtitle2">
                    {settings.riskReducersText[index]?.substring(0, 75)}
                  </Typography>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {Array.from({ length: 3 }, (_, index) => index).map((item) => (
              <div key={item} className={classes.riskReducer}>
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  width={"100%"}
                  height={"120px"}
                  sx={{
                    bgcolor: `${theme.palette.primary.light}25`,
                  }}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default RiskReducers;
