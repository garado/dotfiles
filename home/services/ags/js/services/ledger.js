
// █░░ █▀▀ █▀▄ █▀▀ █▀▀ █▀█   █▀ █▀▀ █▀█ █░█ █ █▀▀ █▀▀
// █▄▄ ██▄ █▄▀ █▄█ ██▄ █▀▄   ▄█ ██▄ █▀▄ ▀▄▀ █ █▄▄ ██▄

import Service from 'resource:///com/github/Aylur/ags/service.js'
import UserConfig from '../../userconfig.js'
import Gio from 'gi://Gio'

const includeFile = ` -f ${UserConfig.ledger.ledger_file_path}`
  
const CsvFieldsEnum = {
  Date: 0,
  Account: 1,
  Description: 2,
  Amount: 3,
}


function DebtData(account = 'NoAccount', transactions = []) {
  /** */
  this.account = account

  this.transactions = transactions
}

// prefix w underscore to indicate private?
function TransactionAccountData(account, amount) {
  /** Account name 
   * @type string */
  this.account = account

  /** Amount  
   * @type string */
  this.amount = amount
}

function TransactionData(date, targets = [], sources = [], description, amount, isIncome = false) {
  /** Date of transaction.
   * @type string */
  this.date = date
  
  /** Target accounts
   * @type TransactionAccountData*/
  this.targets = targets

  /** Source accounts
   * @type TransactionAccountData*/
  this.sources = sources

  /** Transaction description
    * @type string */
  this.description = description
  
  /** Transaction amount
    * @type string */
  this.amount = amount

  this.isIncome = isIncome
}

/** Turn command output into array of tdata
 * @param out array of lines
 * @param sep Custom separator
 * @return Array of TransactionAccountData */
const convertToTransactionDatas = (lines, sep = '@,@') => {
  // array of lines for a similar transaction
  let rawTransactions = []

  let currentTransactionLines = []
  let currentTransactionDesc = ""

  for (let i = 0; i < lines.length; i++) {
    const fields = lines[i].split(sep)
    const desc = fields[CsvFieldsEnum.Description]

    if (desc != currentTransactionDesc) {
      // Handle previous transaction
      rawTransactions.push(currentTransactionLines)

      // Start collecting lines from next transaction
      currentTransactionDesc = desc
      currentTransactionLines = []
    }
      
    currentTransactionLines.push(fields)
  }

  // Push the final one
  rawTransactions.push(currentTransactionLines)

  // Now that all similar lines are grouped together,
  // try to build a TransactionData instance from them
  return rawTransactions.map(rawTransactionArrays => {
    if (rawTransactionArrays.length == 0) return // why is it even 0

    let currDate = ""
    let currDesc = ""
    let currTargets = []
    let currSources = []
   
    // Iterate to determine target and source accounts
    for (let i = 0; i < rawTransactionArrays.length; i++) {
      const currentLine = rawTransactionArrays[i]

      const account = currentLine[CsvFieldsEnum.Account]
      const amount = currentLine[CsvFieldsEnum.Amount]

      if (amount.includes('-')) {
        currSources.push(new TransactionAccountData(account, amount))
      } else {
        currTargets.push(new TransactionAccountData(account, amount))
      }

      if (i === 0) {
        currDate = currentLine[CsvFieldsEnum.Date]
        currDesc = currentLine[CsvFieldsEnum.Description]
      }
    }

    // Find transaction total by adding source values
    const sourceAmounts = currSources.map(s =>
      s.amount.replace(/[^0-9.]/g, ''))

    let currAmount = 0
    sourceAmounts.forEach(n => currAmount += Number(n))

    // Determine if income
    let isIncome = false
    currSources.forEach(s => {
      if (s.account.includes("Income") || s.account.includes("Reimbursements")) {
        isIncome = true
      }
    })

    // why the fuck is destructuring not working
    const ret = new TransactionData(
      currDate,
      currTargets,
      currSources,
      currDesc,
      currAmount,
      isIncome,
    )
    // const ret = new TransactionData(currDate, currTargets, currSources, currDesc)
    return ret
  })
}

/** Interface for ledger-cli. **/
class LedgerService extends Service {
  static {
    Service.register (
      this,
      { // Signals
        'accounts-changed': ['jsobject'],
        'transactions-changed': ['jsobject'],
        'yearly-balances-changed': ['jsobject'],
        'debts': ['jsobject'],
      },
      { // Properties
      },
    )
  }

  // Private variables emitted through signals
  #accountData = []
  #transactionData = []
  #yearlyBalances = []
  #debts = []

  constructor() {
    super()

    this.#initAll()
   
    // Watch ledger file for changes
    Utils.monitorFile(UserConfig.ledger.ledger_file_path, (file, event) => {
      if (event === Gio.FileMonitorEvent.CHANGED) {
        this.#initAll()
      }
    })
  }

  #initAll() {
    this.#initAccountData()
    this.#initTransactionData()
    this.#initYearlyBalanceTrends()
    this.#initDebts()
  }

  /** Parse account data from ledger-cli. */
  #initAccountData() {
    this.#accountData = []
    
    const accountList = UserConfig.ledger.accountList

    const ACCOUNT_NAME = 0
    const DISPLAY_NAME = 1
    
    // Income/Expenses are always the last 2 elements in the array.
    const INCOME_EXPENSE_START_INDEX = accountList.length - 2

    let parsed = 0
    accountList.map((accountInfo, index) => {
      let cmdArray = ['ledger', 'balance', accountInfo[ACCOUNT_NAME], '--depth', '1',
        '--balance_format', '%(display_total)']

      // For Income/Expenses, add flags to get this month only
      if (index >= INCOME_EXPENSE_START_INDEX) {
        cmdArray = cmdArray.concat(['--begin', Utils.exec("date +%B")])
      }

      Utils.execAsync(cmdArray)
        .then(balance => {
          const currency = balance.replace(/[0-9.,-]/g, '')
          balance = balance.replace(/[^0-9.,]/g, '')

          this.#accountData.splice(index, 0, {
            account_name: accountList[index][ACCOUNT_NAME],
            display_name: accountList[index][DISPLAY_NAME],
            currency: currency,
            balance: balance ? balance : "0.00",
            is_income_or_expense: index >= INCOME_EXPENSE_START_INDEX,
          })

          if (++parsed == accountList.length) {
            this.emit('accounts-changed', this.#accountData)
          }
        })
        .catch(err => print(err))
    })
  }

  /** Parse transaction data from ledger-cli. */
  #initTransactionData() {
    this.#transactionData = []

    const SEP = '@,@'
    const numTransactions = 40

    const cmd = [ 'ledger', 'csv', '--head', `${numTransactions}`,
      '--csv_format', `%(date)${SEP}%(account)${SEP}%(payee)${SEP}%t\n`]

    Utils.execAsync(cmd)
      .then(out => {
        const tdata = convertToTransactionDatas(out.split('\n'), SEP)
        this.#transactionData = tdata
        this.emit('transactions-changed', this.#transactionData)
      })
      .catch(err => print(err))

  }

  /** Parse balance trends. */
  #initYearlyBalanceTrends() {
    this.#yearlyBalances = []

    // Init to start of the current year
    let ts = new Date(new Date().getFullYear(), 0, 1).valueOf()
    const now = Date.now().valueOf()

    let cmd = ""
    let baseCmd = "ledger bal Assets --depth 1"
    const MILLISECONDS_PER_WEEK = 7 * 24 * 60 * 60 * 200

    while (ts < now) {
      const month = new Date(ts).getMonth() + 1
      const date  = new Date(ts).getDate()
      cmd += `${baseCmd} -e ${month}/${date} ; \n`
      ts += MILLISECONDS_PER_WEEK
    }

    Utils.execAsync(['bash', '-c', cmd])
      .then(out => {
        this.#yearlyBalances = out.split('\n').map(x => x.replace(/[^0-9.]/g, ''))
        this.emit('yearly-balances-changed', this.#yearlyBalances)
      })
  }

  /** Parse debts and (TODO) liabilties */
  #initDebts() {
    const SEP = '@,@'
    const cmd = `ledger csv Reimbursements Liabilities --group-by account --pending \
      --csv-format '%(date)${SEP}%(account)${SEP}%(payee)${SEP}%(total)\n'`
    Utils.execAsync(['bash', '-c', cmd])
      .then(out => {
        if (out === "") { return }

        const rawData = out.split(/\n\n/)
        this.#debts = rawData.map(x => {
          const lines = x.split('\n')
        
          let ret = new DebtData()

          // Get account name
          const lastColonPos = lines[0].lastIndexOf(':')
          ret.account = lines[0].substring(lastColonPos + 1)
          
          // Get all uncleared transactions for that account
          const rawTransactions = lines.slice(1)

          // Output gives running total, so subtract previous running total
          // to get the transaction's debt amount
          let runningTotal = 0

          rawTransactions.map(x => {
            const fields = x.split(SEP)
            const amount = Number(fields[3].replace(/[^0-9.-]/g, '')) - runningTotal
            runningTotal += amount
            ret.transactions.push({
              amount: amount,
              description: fields[2],
            })
          })

          return ret
        })

        this.emit('debts', this.#debts)
      })
      .catch(err => print(err))
  }

  // Given an account, return the feather icon it should display
  tdataToIcon = (transaction, account) => {
    for (let term in UserConfig.ledger.icon_maps.transaction_name) {
      if (transaction.includes(term))
        return UserConfig.ledger.icon_maps.transaction_name[term]
    }
    
    for (let term in UserConfig.ledger.icon_maps.account) {
      if (account.includes(term))
        return UserConfig.ledger.icon_maps.account[term]
    }

    return UserConfig.ledger.icon_maps.default
  }
}

const service = new LedgerService

export default service
