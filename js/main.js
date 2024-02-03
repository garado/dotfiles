import Bar from './bar/bar.js'
// import Dashboard from './dashboard/dashboard.js'

export default {
  style: App.configDir + '/style.css',
  windows: [
    Bar(0),
    // Dashboard(),
  ],
};
