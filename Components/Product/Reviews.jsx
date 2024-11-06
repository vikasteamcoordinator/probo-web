// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import CapitalizeText from "@/Helpers/CapitalizeText.js";
import CustomImage from "@/Components/Image/CustomImage";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import Skeletons from "@/Components/Skeletons/Skeletons";
import useStyles from "./styles.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import { useTranslation } from "next-i18next";
import { MdReviews } from "react-icons/md";

function Reviews({ product, averageRating, totalRatings }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Reviews
  const reviews = product?.reviews;
  const [visibleReviews, setVisibleReviews] = useState([]);
  const reviewsToShow = 10; // Default

  useEffect(() => {
    if (reviews) {
      const initialReviews = reviews.slice(0, reviewsToShow);
      setVisibleReviews(initialReviews);
    }
  }, [reviews]);

  // To show more reviews on click
  const handleShowMoreReviews = () => {
    const currentlyVisibleReviews = visibleReviews.length;

    const nextReviews = reviews.slice(
      currentlyVisibleReviews,
      currentlyVisibleReviews + reviewsToShow
    );

    setVisibleReviews([...visibleReviews, ...nextReviews]);
  };

  const showMoreButtonVisible = visibleReviews.length < reviews?.length;

  return (
    <div>
      <Typography variant="h2" className={classes.reviewsTitle}>
        {product ? (
          <>{!isNaN(averageRating) && t("product.reviews.text")}</>
        ) : (
          <Skeleton
            animation="wave"
            variant="rounded"
            width="200px"
            sx={{
              bgcolor: `${theme.palette.primary.light}25`,
              margin: "0 auto",
            }}
          />
        )}
      </Typography>
      <div className={classes.averageRating}>
        {product ? (
          <>
            {!isNaN(averageRating) && (
              <div>
                <Rating
                  value={averageRating}
                  size="large"
                  precision={0.5}
                  readOnly
                  className={classes.rating}
                />
                <Typography variant="h2" sx={{ ml: 2, mb: -1 }}>
                  {averageRating}
                </Typography>
              </div>
            )}
          </>
        ) : (
          <Skeleton
            animation="wave"
            variant="rounded"
            width="200px"
            sx={{
              bgcolor: `${theme.palette.primary.light}25`,
            }}
          />
        )}
        <Typography variant="subtitle1" className={classes.totalReviews}>
          {product ? (
            <>
              {!isNaN(averageRating) && (
                <>
                  {totalRatings} <MdReviews />
                </>
              )}
            </>
          ) : (
            <Skeleton
              animation="wave"
              variant="rounded"
              width="200px"
              sx={{
                bgcolor: `${theme.palette.primary.light}25`,
              }}
            />
          )}
        </Typography>
      </div>
      {product ? (
        <>
          {visibleReviews?.length > 0 && (
            <Box className={classes.reviewsMasonry}>
              <Masonry
                columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                spacing={2}
              >
                {visibleReviews.map((review, index) => (
                  <div key={index} className={classes.reviewCard}>
                    {review.media && (
                      <div className={classes.reviewImage}>
                        <CustomImage
                          src={
                            process.env.NEXT_PUBLIC_BACKEND_URL +
                            "reviews/" +
                            review.media
                          }
                          alt={"review"}
                          fill={true}
                        />
                      </div>
                    )}
                    <div className={classes.reviewContent}>
                      <Typography variant="subtitle1">
                        {`${CapitalizeText(review.customer?.firstName) || ""} ${
                          CapitalizeText(
                            review.customer?.lastName?.slice(0, 1) + "."
                          ) || ""
                        }`}
                      </Typography>
                      <Rating
                        value={review.rating}
                        precision={0.5}
                        size="small"
                        readOnly
                        className={classes.rating}
                      />
                      <Typography variant="subtitle1" sx={{ opacity: "0.9" }}>
                        {review.comment}
                      </Typography>
                    </div>
                  </div>
                ))}
              </Masonry>
            </Box>
          )}
        </>
      ) : (
        <Box className={classes.reviewsMasonry}>
          <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={2}>
            {Array.from({ length: 10 }, (_, index) => index).map((item) => (
              <div key={item}>
                <Skeletons type="review" />
              </div>
            ))}
          </Masonry>
        </Box>
      )}
      {showMoreButtonVisible && (
        <div className={classes.showMoreBtn}>
          <SecondaryButton
            text={t("product.reviews.showMore")}
            onClick={handleShowMoreReviews}
            isLoading={!product}
          />
        </div>
      )}
    </div>
  );
}

export default Reviews;
