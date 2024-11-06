// ** Third Party Imports
import Axios from "axios";
import Cookies from "js-cookie";

const CurrencyConverter = (price) => {
  // Currency conversion api
  const currencyApi = process.env.NEXT_PUBLIC_CURRENCY_CONVERSION_API;

  // Getting currency from cookie
  const currencyFromCookie = Cookies.get("myCurrency");

  // Currency format
  const formatCurrency = (rate, currency, locale) => {
    // To prevent hydration issue
    if (price === undefined || price === null || isNaN(price)) {
      return;
    }

    // Total price
    const totalPrice = (rate * price).toFixed(2);

    // Currency formatting
    const formattedCurrency = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toLowerCase(),
    }).format(totalPrice);

    return " " + formattedCurrency + " ";
  };

  if (currencyFromCookie && JSON.parse(currencyFromCookie)) {
    // Currency & rate
    const currency = JSON.parse(currencyFromCookie).currency;
    const rate = JSON.parse(currencyFromCookie).rate;
    const locale = JSON.parse(currencyFromCookie).locale;

    return formatCurrency(rate, currency, locale);
  } else {
    // Setting default currency (i.e: USD)
    Axios.get(currencyApi).then((res) => {
      // Current rate of the currency
      const currencyWithRate = {
        currency: "USD",
        locale: "en-US",
        rate: res.data.usd["usd"],
      };

      //Set current as a cookie
      Cookies.set("myCurrency", JSON.stringify(currencyWithRate));

      return formatCurrency(
        currencyWithRate.rate,
        currencyWithRate.currency,
        currencyWithRate.locale
      );
    });
  }
};

export default CurrencyConverter;
