// ** Next, React And Locals Imports
import { useState } from "react";
import useStyles from "./styles.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Skeleton from "@mui/material/Skeleton";

// ** Third Party Imports
import { useTranslation } from "next-i18next";
import { BsFilterCircle } from "react-icons/bs";

function SortingPanel({ handleSortBy, handleFilterMenu, totalCount }) {
  const { classes } = useStyles();

  //Translation
  const { t } = useTranslation();

  // Filters State
  const [sortingFilter, setSortingFilter] = useState(t("shop.sort.newest"));

  // Sorting
  const sortBy = [
    t("shop.sort.newest"),
    t("shop.sort.priceLowToHigh"),
    t("shop.sort.priceHighToLow"),
  ];

  const handleSortbyFilter = (e) => {
    setSortingFilter(e.target.value);

    const convertedString = e.target.value
      .replace(/: /g, "") // Remove colon and space
      .replace(/ /g, "") // Remove spaces
      .replace(/([a-z])([A-Z])/g, "$1$2"); // Convert to camel case

    handleSortBy(convertedString);
  };

  return (
    <div className={classes.sortingCtn}>
      <Typography variant="subtitle1" sx={{ width: "100%" }}>
        {totalCount ? (
          <>{totalCount + " " + t("shop.items.found")}</>
        ) : (
          <Skeleton
            animation="wave"
            variant="text"
            sx={{
              bgcolor: `${theme.palette.primary.light}25`,
              maxWidth: "150px",
            }}
          />
        )}
      </Typography>
      <div>
        <FormControl className={classes.sortBy} size="small">
          <Select
            displayEmpty
            value={sortingFilter}
            onChange={handleSortbyFilter}
            renderValue={(selected) => (
              <span>
                {t("shop.sort.text")}:{" "}
                <span className={classes.sortText}>{selected}</span>
              </span>
            )}
          >
            {sortBy.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <BsFilterCircle
          className={classes.filterIcon}
          onClick={handleFilterMenu}
        />
      </div>
    </div>
  );
}

export default SortingPanel;
