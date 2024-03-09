
// █░█ █▀ █▀▀ █▀█   █▀▀ █▀█ █▄░█ █▀▀ █ █▀▀
// █▄█ ▄█ ██▄ █▀▄   █▄▄ █▄█ █░▀█ █▀░ █ █▄█

export default {

  // Must be absolute path
  pfp: "/home/alexis/Downloads/vladdy.jpg",

  quick_actions: [
    // Quickaction
    {
      "icon": "zap",
      "name": "",
      "function": function() {
        print('clicked')
      }
    },
  ],

  ledger: {
    // List of accounts to display in top bar
    accountList: [
      // Actual account name    Display name
      ["Assets",                "Total"],
      ["Assets:Checking:NFCU",  "Checking"],
      ["Assets:Savings:Ally",   "Ally HYSA"],
      ["Income",                "Income this month"],
      ["Expenses",              "Expenses this month"],
    ],

    // Absolute path to ledger file.
    ledger_file_path: "/home/alexis/Documents/Ledger/2024.ledger",

    // Rules for setting icons for the 'Transactions' widget
    // If nothing in transaction_name matches, then it will
    // search through account
    icon_maps: {
      transaction_name: {
        'Spotify': 'music',
      },

      account: {
        'Groceries': 'shopping-cart',
        'Household': 'home',
        'Salary': 'briefcase',
        'Wifi': 'wifi',
        'Utilities': 'zap',
        'Engineering': 'tool',
      },

      default: 'dollar-sign',
    },
  },

  github: {
    username: "garado",
  },

  openweather: {
    apiKey: "", // TODO set as env var
    latitude: "37.553689",
    longitude: "-121.974107",
    units: "imperial",
  },
}
