// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GET_SEARCH_RESULTS } from "@/Queries/Search.js";
import FormatLink from "@/Helpers/FormatLink.js";
import useStyles from "./styles.js";

// ** MUI Imports
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";

// ** Third Party Imports
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { AiOutlineSearch } from "react-icons/ai";
import { MdClose } from "react-icons/md";

function SearchBar() {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState(false);

  // Queries
  const [startSearch, { loading, data }] = useLazyQuery(GET_SEARCH_RESULTS);

  useEffect(() => {
    setSearch(false);
  }, [router.asPath]);

  //To fetch products from database
  const handleInputChange = (searchTerm) => {
    if (searchTerm.length > 0) {
      setSearchTerm(searchTerm);
      startSearch({ variables: { searchTerm } });
    }
  };

  //To redirect to product page
  const handleSelect = (event, option) => {
    if (option.title) {
      router.push(`/product/${FormatLink(option.title)}/id_${option._id}`);
    }
  };

  //To redirect to search page
  const handleGoToSearch = (keypress, search) => {
    if (keypress.key === "Enter" || (search && searchTerm.length > 0)) {
      setSearch(false);
      router.push(`/search/?query=${searchTerm}`);
    }
  };

  return (
    <div>
      {search && (
        <div className={classes.container}>
          <div className={classes.searchBar}>
            <Autocomplete
              options={data?.getSearchResults || []}
              loading={loading}
              disableClearable
              getOptionLabel={(option) => option.title}
              popupIcon={false}
              noOptionsText={t("header.search.noOptionsText") + "..."}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  onChange={(event) => handleInputChange(event.target.value)}
                  placeholder={t("header.search.barText") + "..."}
                  InputProps={{
                    ...params.InputProps,
                    onKeyPress: (event) => handleGoToSearch(event, false),
                    startAdornment: (
                      <InputAdornment position="start">
                        <AiOutlineSearch
                          fontSize={"2em"}
                          onClick={(event) => handleGoToSearch(false, event)}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <MdClose
                          fontSize={"2em"}
                          onClick={() => setSearch(!search)}
                          style={{ cursor: "pointer" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              onChange={handleSelect}
            />
          </div>
        </div>
      )}
      {!search && (
        <AiOutlineSearch fontSize={"2em"} onClick={() => setSearch(!search)} />
      )}
    </div>
  );
}

export default SearchBar;
