// ** Next, React And Locals Imports
import { useState, useEffect } from "react";
import CapitalizeText from "@/Helpers/CapitalizeText.js";
import useStyles from "./styles.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Third Party Imports
import { useTranslation } from "next-i18next";
import { HiChevronDown } from "react-icons/hi";

function Filters({
  handleFilters,
  handleFilterMenu,
  filterMenu,
  productSettings,
  pathname,
}) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // States
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [inStock, setInStock] = useState(false);
  const [trending, setTrending] = useState(false);

  // To check small screen
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!isSmallScreen) {
      applyFilters();
    }
  }, [categories, priceRange, trending, inStock, isSmallScreen]);

  // Setting category for category page
  useEffect(() => {
    if (pathname) {
      setCategories([pathname]);
    }
  }, [pathname]);

  //  To handle filters change
  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCategories((prevCategories) => [...prevCategories, value]);
    } else {
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category !== value)
      );
    }
  };

  const handlePriceRangeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setPriceRange((prevPriceRange) => [...prevPriceRange, value]);
    } else {
      setPriceRange((prevPriceRange) =>
        prevPriceRange.filter((range) => range !== value)
      );
    }
  };

  const handleStockChange = (event) => {
    setInStock(event.target.checked);
  };

  const handleTrendingChange = (event) => {
    setTrending(event.target.checked);
  };

  // To apply all filters
  const applyFilters = () => {
    handleFilters(categories, priceRange, trending, inStock);
  };

  // To clear all filters
  const handleClearFilters = () => {
    setCategories([]);
    setPriceRange([]);
    setTrending(false);
    setInStock(false);
  };

  return (
    <div
      className={`${classes.filtersPanel} ${filterMenu && classes.filterMenu}`}
    >
      <div className={classes.filtersPanelTop}>
        <Typography variant="subtitle1">{t("shop.filters.text")}</Typography>
        <Typography variant="subtitle1" onClick={handleClearFilters}>
          {t("shop.filters.clear")}
        </Typography>
      </div>
      {/* Categories */}
      <Accordion className={classes.accordion} disableGutters>
        <AccordionSummary expandIcon={<HiChevronDown />}>
          <Typography variant="subtitle1">
            {t("shop.filters.category")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {productSettings?.categories?.map((category, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    value={category}
                    checked={categories.includes(category)}
                    onChange={handleCategoryChange}
                  />
                }
                label={CapitalizeText(category)}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      {/* Price */}
      <Accordion className={classes.accordion} disableGutters>
        <AccordionSummary expandIcon={<HiChevronDown />}>
          <Typography variant="subtitle1">{t("shop.filters.price")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  value="0/200"
                  checked={priceRange.includes("0/200")}
                  onChange={handlePriceRangeChange}
                />
              }
              label="0 - 200"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="300/500"
                  checked={priceRange.includes("300/500")}
                  onChange={handlePriceRangeChange}
                />
              }
              label="300 - 500"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      {/* Availability */}
      <Accordion className={classes.accordion} disableGutters>
        <AccordionSummary expandIcon={<HiChevronDown />}>
          <Typography variant="subtitle1">
            {t("shop.filters.availability")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={inStock} onChange={handleStockChange} />
              }
              label={t("shop.filters.inStock")}
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      {/* Trending */}
      <Accordion className={classes.accordion} disableGutters>
        <AccordionSummary expandIcon={<HiChevronDown />}>
          <Typography variant="subtitle1">
            {t("shop.filters.trending")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={trending} onChange={handleTrendingChange} />
              }
              label={t("shop.filters.trending")}
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <div className={classes.filtersPanelAction}>
        <Typography
          variant="subtitle1"
          onClick={() => {
            handleFilterMenu();
            handleClearFilters();
          }}
        >
          {t("shop.filters.close")}
        </Typography>
        <Typography
          variant="subtitle1"
          onClick={() => {
            applyFilters();
            handleFilterMenu();
          }}
        >
          {t("shop.filters.apply")}
        </Typography>
      </div>
    </div>
  );
}

export default Filters;
