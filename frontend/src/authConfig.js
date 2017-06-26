var config = {
  authHeader: 'Authorization',
  authToken: 'JWT',
  // Our Node API is being served from localhost:3001
  baseUrl: 'https://regretless.life/data',
  // The API specifies that new users register at the POST /users enpoint.
  loginRedirect: null,
  logoutRedirect: null,
  signupUrl: 'register',
  signupRedirect: '#/login',
  // Logins happen at the POST /sessions/create endpoint.
  loginUrl: 'auth',
  // The API serves its tokens with a key of id_token which differs from
  // aureliauth's standard.
  tokenName: 'access_token'
}


export default config;