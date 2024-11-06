// ** Next, React And Locals Imports
import { useState } from "react";
import { useRouter } from "next/router";
import GetCountryFlag from "@/Helpers/GetCountryFlag.js";
import CustomImage from "@/Components/Image/CustomImage";
import currencies from "./currencies.json";
import useStyles from "./styles.js";

// ** MUI Imports
import Typography from "@mui/material/Typography";

// ** Third Party Imports
import Cookies from "js-cookie";
import Axios from "axios";
import { useTranslation } from "next-i18next";
import { MdClose } from "react-icons/md";

function LangCurrency({ handleIntlModal }) {
  const { classes } = useStyles();
  const router = useRouter();

  //Translation
  const { t } = useTranslation();

  const { locales } = router;

  // Switcher
  const [switcher, setSwitcher] = useState("language");

  // Getting from cookies
  const langFromCookie = Cookies.get("NEXT_LOCALE");
  const currencyFromCookie = Cookies.get("myCurrency");

  // Current Language & Currency
  const [currentLang, setCurrentLang] = useState(langFromCookie);
  const [currentCurrency, setCurrentCurrency] = useState(
    currencyFromCookie && JSON.parse(currencyFromCookie).currency
  );

  // Setting language & currency in cookies on change
  const handleLang = (e) => {
    if (e.target.textContent.length === 0) {
      return;
    }

    const language = e.target.textContent.toLowerCase();

    Cookies.set("NEXT_LOCALE", language);

    setCurrentLang(language);

    router.push(router.route, router.asPath, {
      locale: language,
    });

    handleIntlModal();
  };

  const handleCurrency = (e) => {
    if (e.target.textContent.length === 0) {
      return;
    }

    const currency = e.target.textContent.toLowerCase();

    // Currency conversion api
    const currencyApi = process.env.NEXT_PUBLIC_CURRENCY_CONVERSION_API;

    Axios.get(currencyApi).then((res) => {
      // Getting locale from currencies json
      const locale = currencies.currencies.find(
        (item) => item.currency.toLowerCase() === currency
      );

      const currencyWithRate = {
        currency: currency,
        locale: locale.locale,
        rate: res.data.usd[currency],
      };

      //Set currency as a cookie
      Cookies.set("myCurrency", JSON.stringify(currencyWithRate));
    });

    setCurrentCurrency(currency);

    router.push(router.route, router.asPath, {
      locale: currentLang,
    });

    handleIntlModal();
  };

  return (
    <div className={classes.container}>
      <div className={classes.closeIcon}>
        <MdClose fontSize={"1.5em"} onClick={() => handleIntlModal()} />
      </div>
      <Typography variant="h4" sx={{ pb: 5 }}>
        {t("header.langCurrency.text1")}{" "}
        <span
          onClick={() => setSwitcher("language")}
          className={`${classes.switcher} ${
            switcher === "language" && classes.activeSwitcher
          }`}
        >
          {t("header.langCurrency.text2")}
        </span>{" "}
        {t("header.langCurrency.text3")}{" "}
        <span
          onClick={() => setSwitcher("currency")}
          className={`${classes.switcher} ${
            switcher === "currency" && classes.activeSwitcher
          }`}
        >
          {t("header.langCurrency.text4")}
        </span>
      </Typography>
      {switcher === "language" && (
        <div>
          {locales.map((lang) => (
            <div
              key={lang}
              className={`${classes.menu} ${
                lang === currentLang && classes.activeItem
              }`}
              onClick={(e) => {
                e.preventDefault();

                handleLang(e);
              }}
            >
              <CustomImage
                src={GetCountryFlag(lang)}
                alt={lang + "flag"}
                width={45}
                height={30}
              />
              <Typography variant="subtitle1" className={classes.text}>
                {lang.toUpperCase()}
              </Typography>
            </div>
          ))}
        </div>
      )}

      {switcher === "currency" && (
        <div>
          {currencies.currencies.map((item) => {
            const locale = item.locale.slice(-2).toLowerCase();
            return (
              <div
                key={item}
                className={`${classes.menu} ${
                  item.currency.toLowerCase() === currentCurrency &&
                  classes.activeItem
                }`}
                onClick={(e) => {
                  e.preventDefault();

                  handleCurrency(e);
                }}
              >
                <CustomImage
                  src={GetCountryFlag(locale)}
                  alt={locale + "flag"}
                  width={45}
                  height={30}
                />
                <Typography variant="body2" className={classes.text}>
                  {item.currency}
                </Typography>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LangCurrency;
