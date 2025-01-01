
// █▀▀ █░░ █▀█ █▄▄ ▄▀█ █░░
// █▄█ █▄▄ █▄█ █▄█ █▀█ █▄▄

// Global project definitions

const logFlags = {
  // Main execution (windows opening, SASS reload, etc)
  program:  false,
  bar:      false,
  dash:     false,
  notrofi:  false,
  kitty:    false,
  notif:    false,

  // Service logging
  dashService:      false,

  taskService:      true,

  gcalcliService:   false,
  
  goalService:      true,
  
  habitifyService:  false,
  
  lifeService:      false,
  
  ledgerService:    false,
};

export function log(section, str) {
  if (logFlags[section]) {
    console.log(`${section.toUpperCase()}: ${str}`)
  }
}
