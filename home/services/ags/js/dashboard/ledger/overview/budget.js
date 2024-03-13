
// █▄▄ █░█ █▀▄ █▀▀ █▀▀ ▀█▀
// █▄█ █▄█ █▄▀ █▄█ ██▄ ░█░

import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import LedgerService from '../../../services/ledger.js'

/**
 * Create UI element for a budget bar given a data object.
 * */
const CreateBudgetEntry = (data) => {
  // Bounds checking
  if (data.currentValue > data.maxValue) {
    data.currentValue = data.maxValue
  }

  const Bar = Widget.LevelBar({
    className: 'levelbar',
    heightRequest: 40,
    widthRequest: 380,
    value: data.currentValue,
    maxValue: data.maxValue,
  })

  const spent = Math.round((data.currentValue / data.maxValue) * 100)

  const Labels = Widget.CenterBox({
    className: 'labels',
    hexpand: true,
    startWidget: Widget.Label({
      className: 'spent',
      hpack: 'start',
      label: `${String(spent)}%`
    }),
    endWidget: Widget.Label({
      className: 'remaining',
      hpack: 'end',
      label: `${String(100 - spent)}%`
    }) 
  })

  const BarOverlay = Widget.Overlay({
    className: 'bar',
    child: Bar,
    overlays: [
      Widget.Box({
        vertical: false,
        children: [ Labels ],
      })
    ],
  })

  const BottomBox = Widget.CenterBox({
    className: 'bottom',
    hexpand: true,
    startWidget: Widget.Label({
      className: 'spent',
      hpack: 'start',
      label: data.category,
    }),
    endWidget: Widget.Label({
      className: 'remaining',
      hpack: 'end',
      label: String(data.total),
    }) 
  })
  
  const BudgetEntry = Widget.Box({
    className: 'entry',
    vertical: true,
    children: [
      BarOverlay,
      BottomBox,
    ],
  })

  return BudgetEntry
}

/**
 * Container for all budget entries
 * */
const BudgetBox = () => Widget.Box({
    hexpand: true,
    class_name: 'budget',
    vertical: true,
    spacing: 20,
    children: [ 
      Widget.Label({
        class_name: 'placeholder-text',
        label: 'Nothing to see here.'
      })
    ],
    setup: (self) => {
    
      const sampleData = {
        'currentValue': 66.5,
        'maxValue': 100,
        'category': 'Transportation',
        'total': 1400.30,
      }

      self.children = [ 
        CreateBudgetEntry(sampleData), 
        CreateBudgetEntry(sampleData), 
        CreateBudgetEntry(sampleData), 
        CreateBudgetEntry(sampleData), 
      ]
    }
    // setup: self => self.hook(LedgerService, (self, debtData) => {
    //   if (debtData === undefined) return;
    //   self.children = debtData.map(x => createDebtWidget(x))
    // }, 'debts'),
})

export default () => {
  return Widget.Box({
    vertical: true,
    vexpand: true,
    hexpand: true,
    children: [
      Widget.Label({
        label: 'Budget',
        class_name: 'widget-header',
      }),
      BudgetBox(),
    ]
  })
}
