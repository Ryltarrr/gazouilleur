const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    reloadOnPrerender: process.env.NODE_ENV === "development",
    localePath: path.resolve("./public/locales"),
  },
};
