const path = require("path");

// module.exports = {
//   i18n: {
//     defaultLocale: "en",
//     locales: ["en", "jp", "de", "ar"],
//     localePath: path.resolve("./public/locales"),
//   },
// };
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'], // List of supported locales
    defaultLocale: 'en', // The default locale
    localeDetection: true, // Optional: detects user locale
  },
};
