
/* █▀▀ █▀▀ █▀▄▀█ █ █▄░█ █   ▄▀█ █▀█ █ */
/* █▄█ ██▄ █░▀░█ █ █░▀█ █   █▀█ █▀▀ █ */

/**
 * Idea and UI inspiration taken from kotontrion's chatgpt widget,
 * as posted in unixporn discord
 * (this code sucks btw)
 */

import Gio from 'gi://Gio'
import Gtk from 'gi://Gtk?version=3.0'
import GtkSource from 'gi://GtkSource?version=3.0'
import GLib from 'gi://GLib'
import UserConfig from '../../userconfig.js'

/********************************************************
 * MODULE-LEVEL VARIABLES
 ********************************************************/

const CUSTOM_SOURCEVIEW_SCHEME_PATH = `${App.configDir}/assets/gtksourceview/nord.xml`

const GEMINI_API_KEY = UserConfig.gemini.api

let responsesRaw = []
const responses = Variable([])

/********************************************************
 * FUNCTIONS
 ********************************************************/

/**
 * Escape quotes
 * (CANNOT get this to work so im just removing it all for now)
 */
const escapeQuotes = (text) => {
  text = text.replaceAll('"', '')
  text = text.replaceAll("'", '')
  return text
}

/**
 * Gemini responses have markdown markup. GJS only renders Pango markup.
 * Convert it here.
 * @TODO some errors - ask it this to see if fixed
 * what is this from I hate to hear you talk about all women as if they were fine ladies instead of rational creatures. None of us want to be in calm waters all our lives.
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

/**
 * Language reported by Gemini for code snippets doesn't exactly match the 
 * GtkSourceView language; convert here
 */
const sourceviewSubstitueLang = (lang) => {
  const substitutions = {
    /* from -> to */
    'bash': 'sh',
    'javascript': 'js',
    'c++': 'cpp',
  }

  return substitutions[lang] ? substitutions[lang] : lang
}

/**
 * Load custom colorscheme for GtkSourceView
 */
const sourceviewLoadScheme = (path = CUSTOM_SOURCEVIEW_SCHEME_PATH) => {
  const file = Gio.File.new_for_path(path)
  const [success, contents] = file.load_contents(null)

  if (!success) {
    console.log('sourceviewLoadScheme: Failed to load theme XML file');
    return
  }

  /* Parse the XML content and set the Style Scheme */
  const schemeManager = GtkSource.StyleSchemeManager.get_default()
  schemeManager.append_search_path(file.get_parent().get_path())
}

sourceviewLoadScheme()

/********************************************************
 * WIDGET DEFINITIONS
 ********************************************************/

/**
 * Section header and button to clear all prompts and responses.
 */
const Header = () => Widget.CenterBox({
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
 * Return code highlighted with GtkSourceView
 */
const HighlightedCode = (content, lang) => {
  const buffer = new GtkSource.Buffer()
  const sourceView = new GtkSource.View({
    buffer: buffer,
    wrap_mode: Gtk.WrapMode.NONE,
    editable: false,
    canFocus: false,
  })
  
  /* Set language */
  const langManager = GtkSource.LanguageManager.get_default()
  let displayLang = langManager.get_language(sourceviewSubstitueLang(lang)) // Set your preferred language
  if (displayLang) {
    buffer.set_language(displayLang)
  }

  /* Apply theme */
  const schemeManager = GtkSource.StyleSchemeManager.get_default()
  buffer.set_style_scheme(schemeManager.get_scheme(UserConfig.currentTheme))

  /* Set content */
  buffer.set_text(content.trim(), -1)

  /* Hot reload theme */
  systemTheme.connect('changed', (theme) => {
    buffer.set_style_scheme(schemeManager.get_scheme(theme.value))
  })

  return sourceView
}

/**
 * Text entry box for prompts.
 * Also includes the Gemini API call.
 */
const EntryBox = () => {
  const entryBox = Widget.Entry({
    className: 'entry',
    hexpand: true,
    placeholderText: 'Talk to Gemini',
    onAccept: (self) => {
      const text = self.get_text()
      if (text == '') return

      self.set_text('')

      responsesRaw.push({ type: 'prompt', content: text })
      responsesRaw.push({ type: 'response', content: 'Thinking...' })
      responses.setValue(responsesRaw)

      const cmd = `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}" \
                  -H 'Content-Type: application/json' -X POST -d '{ "contents": [{ "parts":[{"text": "${escapeQuotes(text)}"}] }] }'`

      Utils.execAsync(cmd)
        .then(out => {
          const result = JSON.parse(out)
          const output = result.candidates[0].content.parts[0].text

          responsesRaw[responsesRaw.length - 1].content = output
          responses.setValue(responsesRaw)

        })
        .catch(err => console.log(`Gemini: ${err}`))
    }
  })

  return Widget.Box({
    className: 'entry-container',
    hexpand: true,
    children: [
      entryBox,
      Widget.Icon({
        widthRequest: 24,
        icon: 'arrow-up',
      }),
    ]
  })
}

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
  const promptOutputCodeSnippet = (token) => {
    const codeSnippetHeader = Widget.CenterBox({
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
    })

    let codeSnippetContent

    codeSnippetContent = Widget.Box({
      className: 'code-block-content',
      hexpand: false,
      vexpand: true,
      children: [
        Widget.Scrollable({
          overlayScrolling: true,
          canFocus: false,
          hscroll: 'automatic',
          vscroll: 'never',
          vexpand: true,
          hexpand: true,
          child: HighlightedCode(token.content.trim(), token.language),
        })
      ]
    })

    return Widget.Box({
      className: 'code-block',
      vertical: true,
      hexpand: false,
      children: [
        codeSnippetHeader,
        codeSnippetContent,
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
      return promptOutputCodeSnippet(token)
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

const ContentContainer = () => Widget.Scrollable({
  hscroll: 'never',
  vscroll: 'always',
  vexpand: true,
  hexpand: false,
  canFocus: false,
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
    Header(),
    ContentContainer(),
    EntryBox(),
  ]
})
