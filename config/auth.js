module.exports = {
  facebookAuth: {
    clientID: process.env.F_CLIENT_ID,
    clientSecret: process.env.F_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },

  googleAuth: {
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: process.env.G_CALLBACK_URL
  }
};
