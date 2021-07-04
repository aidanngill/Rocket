const Config = {
  appName: process.env.REACT_APP_NAME,
  returnUrl: process.env.REACT_APP_RETURN_URL,
  apiUrl: process.env.REACT_APP_API_URL,
  registration: process.env.REACT_APP_REGISTRATION,
  social: {
    email: process.env.REACT_APP_SOCIAL_EMAIL
  },
  captchaSitekey: process.env.REACT_APP_CAPTCHA_KEY
};

export default Config;