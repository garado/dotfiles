
/* █▀▀ █▀▀ █▀▄▀█ █ █▄░█ █   ▄▀█ █▀█ █ */
/* █▄█ ██▄ █░▀░█ █ █░▀█ █   █▀█ █▀▀ █ */

/**
 * Idea and UI inspiration taken from kotontrion's chatgpt widget,
 * as posted in unixporn discord
 * (this code sucks btw)
 */

import Gtk from 'gi://Gtk?version=3.0'
import UserConfig from '../../userconfig.js'

/********************************************************
 * MODULE-LEVEL VARIABLES
 ********************************************************/

let responsesRaw = []
const responses = Variable([])

/********************************************************
 * FUNCTIONS
 ********************************************************/

/**
 * Escape single quotes (surprise)
 */
const escapeQuotes = (text) => {
  text = text.replaceAll("'", "\\'")
  text = text.replaceAll('"', '\\"')
  return text
}

/**
 * Gemini responses have markdown markup. GJS only renders Pango markup.
 * Convert it here.
 */
const markdownToPangoMarkup = (markdown) => {
  /* Replace bold, italics, strikethrough */
  markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  markdown = markdown.replace(/\*(.*?)\*/g, '<i>$1</i>');
  markdown = markdown.replace(/~(.*?)~/g, '<s>$1</s>');

  /* Replace monospace */
  markdown = markdown.replace(/`(.*?)`/g, '<tt>$1</tt>');

  /* Also strip final newline */
  markdown = markdown.trim()

  return markdown
}

/** 
 * Tokenize on code snippets
 */
const tokenizeCode = (markdown) => {
  const tokens = []

  let remainingStr = markdown
  let isCode = false

  while (remainingStr != '') {
    const match = remainingStr.match('```')

    if (match) {
      /* Grab language */
      let lang = undefined
      if (isCode) {
        lang = remainingStr.split(/\s+/)[0]
        remainingStr = remainingStr.slice(lang.length)
      }

      tokens.push({
        type: isCode ? 'code' : 'text',
        content: remainingStr.substring(0, (isCode ? match.index - lang.length : match.index)),
        language: lang
      })

      remainingStr = remainingStr.slice(tokens[tokens.length - 1].content.length + 3)
    } else {
      tokens.push({ type: 'text', content: remainingStr })
      remainingStr = ''
    }

    isCode = !isCode
  }

  return tokens
}

/**
 * Given a responses[] item, return either a prompt widget or response widget.
 */
const promptResults = (promptData) => {
  if ('prompt' == promptData.type) {
    return promptInput(promptData.content)
  } else if ('response' == promptData.type) {
    return promptOutput(promptData.content)
  }
}

/********************************************************
 * WIDGET DEFINITIONS
 ********************************************************/

/**
 * Section header and button to clear all prompts and responses.
 */
const header = Widget.CenterBox({
  vertical: false,
  className: 'section-header',
  startWidget: Widget.Label({
    hpack: 'start',
    xalign: 0,
    label: 'Gemini',
  }),
  endWidget: Widget.Button({
    hpack: 'end',
    className: 'clear',
    child: Widget.Box({
      spacing: 8,
      vertical: false,
      children: [
        Widget.Icon('trash-2'),
        Widget.Label({
          label: 'Clear'
        }),
      ]
    }),
    onClicked: () => {
      responsesRaw = []
      responses.setValue(responsesRaw)
    }
  }),
})

/**
 * Text entry box for prompts.
 * Also includes the Gemini API call.
 */
const entry = Widget.Box({
  spacing: 8,
  children: [
    Widget.Entry({
      className: 'entry',
      hexpand: true,
      placeholderText: '',
      onAccept: (self) => {
        const text = self.get_text()
        self.set_text('')

        responsesRaw.push({ type: 'prompt', content: text })
        responsesRaw.push({ type: 'response', content: 'Thinking...' })
        responses.setValue(responsesRaw)

        const cmd = `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${UserConfig.gemini.api}" \
          -H 'Content-Type: application/json' -X POST -d '{ "contents": [{ "parts":[{"text": "${text}"}] }] }'`

        Utils.execAsync(cmd)
          .then(out => {
            const result = JSON.parse(out)
            const output = result.candidates[0].content.parts[0].text

            responsesRaw[responsesRaw.length - 1].content = output
            responses.setValue(responsesRaw)

          })
          .catch(err => console.log(`Gemini: ${err}`))
      }
    }),
    Widget.Icon({
      icon: 'arrow-right-circle',
      size: 24,
    })
  ]
})

/**
 * Text displaying prompt.
 */
const promptInput = (input) => {
  return Widget.Box({
    className: 'prompt-input',
    vertical: true,
    vexpand: false,
    hexpand: false,
    children: [
      Widget.Label({
        xalign: 0,
        className: 'header',
        label: 'alexis',
      }),
      Widget.Label({
        vexpand: false,
        hexpand: false,
        xalign: 0,
        className: 'content',
        label: input,
        justification: 'left',
        useMarkup: true,
        wrap: true,
      }),
    ]
  })
}

/**
 * Text displaying response to prompt.
 */
const promptOutput = (output) => {
  /**
   * Helper function to create text widget
   */
  const _promptOutputText = (token) => {
    return Widget.Label({
      vexpand: false,
      hexpand: false,
      xalign: 0,
      className: 'content',
      label: markdownToPangoMarkup(token.content.trim()),
      useMarkup: true,
      wrap: true,
    })
  }

  /**
   * Helper function to create code block widget
   */
  const _promptOutputCode = (token) => {
    return Widget.Box({
      className: 'code-block',
      vertical: true,
      hexpand: false,
      children: [
        Widget.CenterBox({
          hexpand: false,
          className: 'code-block-header',
          startWidget: Widget.Label({
            hpack: 'start',
            label: token.language.trim().charAt(0).toUpperCase() + token.language.trim().slice(1)
          }),
          endWidget: Widget.Button({
            attribute: {content: escapeQuotes(token.content.trim())},
            hpack: 'end',
            hexpand: false,
            className: 'copy-btn',
            child: Widget.Box({
              hexpand: false,
              spacing: 5,
              vertical: false,
              children: [
                Widget.Icon('copy'),
                Widget.Label('Copy'),
              ]
            }),
            onClicked: (self) => {
              const cmd = `bash -c "echo '${self.attribute.content.trim()}' | wl-copy 2>/dev/null"`
              Utils.execAsync(cmd).catch(err => print)
            }
          })
        }),
        Widget.Box({
          className: 'code-block-content',
          hexpand: false,
          vexpand: true,
          children: [
            Widget.Scrollable({
              overlayScrolling: true,
              hscroll: 'automatic',
              vscroll: 'automatic',
              vexpand: true,
              hexpand: true,
              child: Widget.Label({
                className: 'code-block-content',
                label: token.content.trim(),
                xalign: 0,
              }),
            })
          ]
        }),
      ],
    })
  }
  
  /**
   * Helper function to create code block widget
   */
  const _createPromptOutputWidgets = (token) => {
    if ('text' == token.type) {
      return _promptOutputText(token)
    } else if ('code' == token.type) {
      return _promptOutputCode(token)
    }
  }

  /* Tokenize on code snippets */
  let tokens = []
  if (output.includes('```')) {
    tokens = tokenizeCode(output)
  } else {
    tokens = [{type: 'text', content: output}]
  }

  return Widget.Box({
    className: 'prompt-output',
    vertical: true,
    vexpand: false,
    hexpand: false,
    children: [
      Widget.Label({
        xalign: 0,
        className: 'header',
        label: 'Gemini',
      }),
      Widget.Box({
        vertical: true,
        spacing: 6,
        children: tokens.map(_createPromptOutputWidgets)
      })
    ]
  })
}

const contentContainer = Widget.Scrollable({
  hscroll: 'never',
  vscroll: 'always',
  vexpand: true,
  hexpand: false,
  css: 'padding: 1px',
  child: Widget.Box({
    className: 'response-container',
    spacing: 12,
    vertical: true,
    children: responses.bind().as(x => x.map(promptResults))
  }),
})

/**
 * Final widget composition
 */
export default () => Widget.Box({
  className: 'gemini',
  vexpand: true,
  hexpand: false,
  vertical: true,
  children: [
    header,
    contentContainer,
    entry,
  ]
})
