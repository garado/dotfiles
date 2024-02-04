
// █░░ █▀▀ █▀▄ █▀▀ █▀▀ █▀█   █▀ █▀▀ █▀█ █░█ █ █▀▀ █▀▀
// █▄▄ ██▄ █▄▀ █▄█ ██▄ █▀▄   ▄█ ██▄ █▀▄ ▀▄▀ █ █▄▄ ██▄

// Interface for communicating with ledger-cli.
// All ledger widgets get their data from this service.

import Service from 'resource:///com/github/Aylur/ags/service.js'

class LedgerService extends Service {
  static {
    Service.register (
      this,
      { // define signals
        'accounts-changed': ['jsobject'],
        'transactions-changed': ['jsobject'],
      },
      { // define properties
        'account-data': ['jsobject', 'r'],
        'transaction-data': ['jsobject', 'r'],
      },
    );
  }

  /* PRIVATE VARIABLES + GETTERS/SETTERS */
  // Array of Account objects
  #account_data = [];
  #transactionData = {};

  get account_data() {
    return this.#account_data;
  }

  get transaction_data() {
    return this.#transactionData;
  }

  constructor() {
    super();

    // Initialize
    this.#initAccountData()
    this.#initTransactionData()
  }

  /* Parse account data from ledger-cli. */
  #initAccountData() {
    // Clear old data
    this.#account_data = []

    // TODO: Make this a config option
    const accountList = [
      // Actual account name    // Display name
      ["Assets",                "Total"],
      ["Assets:Checking:NFCU",  "Checking"],
      ["Assets:Savings:Ally",   "Ally HYSA"],
      ["Income",                "Income this month"],
      ["Expenses",              "Expenses this month"],
    ]

    const ACCOUNT_NAME = 0;
    const DISPLAY_NAME = 1;
    
    // NOTE: Income/Expenses are always the last 2 elements 
    // in the array.
    const INCOME_EXPENSE_START_INDEX = accountList.length - 2;

    let parsed = 0;
    accountList.map((accountInfo, index) => {
      let cmdArray = ['ledger', 'balance', accountInfo[ACCOUNT_NAME], '--depth', '1',
        '--balance_format', '%(display_total)']

      // For Income/Expenses, get this month only
      if (index >= INCOME_EXPENSE_START_INDEX) {
        cmdArray.push.apply(['--begin', Utils.exec("date +%B")])
      }
    
      Utils.execAsync(cmdArray)
        .then(balance => {
          const currency = balance.replace(/[0-9.,-]/g, '')
          balance = balance.replace(/[^0-9.,]/g, '')
          this.#account_data.splice(index, 0, {
            account_name: accountList[index][ACCOUNT_NAME],
            display_name: accountList[index][DISPLAY_NAME],
            currency: currency,
            balance: balance ? balance : "0.00",
            is_income_or_expense: index >= INCOME_EXPENSE_START_INDEX,
          })

          if (++parsed == accountList.length) {
            this.emit('accounts-changed', this.#account_data)
          }
        })
        .catch(err => print(err));
    })
  }
}

const service = new LedgerService;

export default service;
