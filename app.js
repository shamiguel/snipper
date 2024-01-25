require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 4000
const routes = require('./routes');
const {auth} = require('express-openid-connect')
app.use(express.json())

const {
  AUTH0_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_BASE_URL,
  } = process.env;
  
  const config = {
  authRequired: true, // this is different from the documentation
  auth0Logout: true,
  secret: AUTH0_SECRET,
  baseURL: AUTH0_AUDIENCE,
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: AUTH0_BASE_URL,
  };

app.use(auth(config));  

app.get('/', (req, res) => {
  console.log(req.oidc.user)
  res.send(req.oidc.isAuthenticated() ? 
  `
  <h1> Hi ${req.oidc.user.given_name}</h1>
  <p> you're logged in!</p>
  <form action="/logout">
		<button class="logout" type="submit">Sign out</button>
	</form>
  ` 
  :
  'Logged out');
});
// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.use('/users', routes.user)
app.use('/snippets', routes.snippet);