// ** Next, React And Locals Imports
import { useState } from "react";
import Link from "next/link";
import CustomImage from "@/Components/Image/CustomImage";
import theme from "@/mui/theme.js";
import useStyles from "./styles.js";

// ** MUI Imports
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Third Party Imports
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

function Layout3({ settings }) {
  const { classes } = useStyles();

  // Slider
  const [sliderRef, setSliderRef] = useState(null);

  const sliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    lazyLoad: true,
    dots: true,
    pauseOnHover: true,
  };

  // Background image (based on screen size)
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const sliderImages = isLargeScreen
    ? settings?.heroImagesLarge
    : settings?.heroImagesSmall;

  return (
    <div className={classes.container}>
      <div className={classes.prevNextBtn}>
        <div onClick={sliderRef?.slickPrev} className={classes.arrow}>
          <BsChevronLeft fontSize={"2em"} />
        </div>
        <div onClick={sliderRef?.slickNext} className={classes.arrow}>
          <BsChevronRight fontSize={"2em"} />
        </div>
      </div>
      <Slider ref={setSliderRef} {...sliderSettings} className={classes.slider}>
        {sliderImages?.map((item, index) => {
          return (
            <div
              key={index}
              className={
                isLargeScreen ? classes.largeScreen : classes.smallScreen
              }
            >
              <Link href={settings.heroLink}>
                <CustomImage
                  src={process.env.NEXT_PUBLIC_BACKEND_URL + "uploads/" + item}
                  alt={item}
                  fill={true}
                  priority={true}
                />
              </Link>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default Layout3;
