
// █░█ █▀ █▀▀ █▀█   █▀▀ █▀█ █▄░█ █▀▀ █ █▀▀
// █▄█ ▄█ ██▄ █▀▄   █▄▄ █▄█ █░▀█ █▀░ █ █▄█

export default {

  ledger: {
    accountList: [
      // Actual account name    Display name
      ["Assets",                "Total"],
      ["Assets:Checking:NFCU",  "Checking"],
      ["Assets:Savings:Ally",   "Ally HYSA"],
      ["Income",                "Income this month"],
      ["Expenses",              "Expenses this month"],
    ],

    // Absolute path to ledger file.
    ledger_file_path: "~/Documents/Ledger/2024.ledger"
  },

  github: {
    username: "garado",
  },

  openweather: {
    apiKey: "",
    latitude: "37.553689",
    longitude: "-121.974107",
    units: "imperial",
  },

}
