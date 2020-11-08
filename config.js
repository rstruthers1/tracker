exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://rms-tracker.herokuapp.com/'
  : 'http://localhost:3000'
