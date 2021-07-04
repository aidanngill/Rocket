# Rocket
Front end interface for [Space](https://github.com/ramadan8/Space), a file hosting API.

## Requirements
* npm
* [Space](https://github.com/ramadan8/Space)

## Getting Started
```bash
git clone https://github.com/ramadan8/Rocket.git && cd Rocket
npm i
```

The following environment variables should be set according to your own Space setup.

```bash
export REACT_APP_NAME="Golf"
export REACT_APP_DESCRIPTION="The coolest file host ever."
export REACT_APP_RETURN_URL="https://on.wii.golf"
export REACT_APP_API_URL="https://api.wii.golf"
export REACT_APP_REGISTRATION="closed"
export REACT_APP_SOCIAL_EMAIL="webmaster@wii.golf"
export REACT_APP_CAPTCHA_KEY="google_recaptcha_key"
```

* `REACT_APP_NAME` is the display name of the website, shown in the navbar and titles.
* `REACT_APP_DESCRIPTION` is the meta description for the website that will show up on modern embeds on other websites.
* `REACT_APP_RETURN_URL` is the URL at which your files are hosted.
* `REACT_APP_API_URL` is the API URL for Space.
* `REACT_APP_REGISTRATION` is whether or not users have to use an invite code to sign up, `closed` will mean that an invite is necessary, whilst `open` (or anything else) will mean the opposite.
* `REACT_APP_CAPTCHA_KEY` is your Google reCAPTCHA public key. Make sure you *never* put your secret key within this project.

## Building
```bash
npm run build
```

After building, simply move everything from the `build` folder onto your web server.