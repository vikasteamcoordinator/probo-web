// ** Next, React And Locals Imports
import { useState } from "react";
import Link from "next/link";
import CustomImage from "@/Components/Image/CustomImage";
import theme from "@/mui/theme.js";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

function ShopByCategory({ settings, loading }) {
  const { classes } = useStyles();

  // Slider
  const [sliderRef, setSliderRef] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        {!loading ? (
          <>{settings?.categoryTitle}</>
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
      <div className={classes.prevNextBtn}>
        <div onClick={sliderRef?.slickPrev} className={classes.arrow}>
          <BsChevronLeft />
        </div>
        <div onClick={sliderRef?.slickNext} className={classes.arrow}>
          <BsChevronRight />
        </div>
      </div>
      {!loading ? (
        <Slider
          {...sliderSettings}
          ref={setSliderRef}
          className={classes.slider}
        >
          {settings?.categoryImages?.map((item, index) => (
            <div className={classes.main} key={index}>
              <Link href={settings.categoryLink[index]}>
                <CustomImage
                  src={process.env.NEXT_PUBLIC_BACKEND_URL + "uploads/" + item}
                  alt={settings.categoryHeading[index]}
                  fill={true}
                />
                <div className={classes.categoryContent}>
                  <Typography variant="h5" className={classes.categoryText}>
                    {settings.categoryHeading[index]}
                  </Typography>
                  <Typography variant="subtitle1" className={classes.action}>
                    {settings.categoryText[index]}
                  </Typography>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      ) : (
        <Slider
          {...sliderSettings}
          ref={setSliderRef}
          className={classes.slider}
        >
          {Array.from({ length: 3 }, (_, index) => index).map((item) => (
            <div key={item} className={classes.main}>
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
          ))}
        </Slider>
      )}
    </div>
  );
}

export default ShopByCategory;
