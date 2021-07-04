import React, { useRef, useState } from "react";
import { Redirect } from "react-router";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Form } from "react-bootstrap";

import store from "store";
import ReCAPTCHA from "react-google-recaptcha";

import Config from "../../Config";
import Instance from "../../Session";

const Login = () => {
  const [captcha, setCaptcha] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    password: ""
  });

  const recaptchaRef:any = useRef({});

  const dispatch = useDispatch();
  const user = useSelector(store => store.user);

  const { addToast } = useToasts();

  const onCaptchaChange = ( value ) => {
    setCaptcha(value);
  }
  
  const onCaptchaExpired = () => {
    recaptchaRef.current.reset();
  }

  const onUserDataChange = ( event ) => {
    const targetName = event.target.name;
    const targetVal = event.target.value;

    setUserData({ ...userData, [targetName]: targetVal });
  }

  const handleSubmit = ( event ) => {
    event.preventDefault();

    if (!captcha)
      return addToast("Please finish the Google reCAPTCHA challenge.", {
        appearance: "error"
      });

    var bodyForm = new FormData(event.target);

    bodyForm.append("captcha", captcha);
    bodyForm.delete("g-recaptcha-response");

    Instance.request({
      method: "POST",
      url: "/auth/login",
      data: bodyForm,
    })
    .then(resp => resp.data)
    .then(data => {
      store.set("user", data.user);
      dispatch({ type: "auth/user", payload: data.user });

      addToast("Successfully signed in.", {
        appearance: "success"
      });
    })
    .catch(function(error) {
      let errorMessage = "";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "API is unavailable.";
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "Unexpected error occured.";
      } else {
        errorMessage = error.message;
      }

      recaptchaRef.current.reset();
      addToast(errorMessage, {
        appearance: "error"
      });
    });
  }

  return (
    <Container>
      { Object.keys(user).length > 0 ? <Redirect to="/user/dashboard" /> : "" }
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="form-username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username..."
            name="username"
            value={userData.username}
            onChange={onUserDataChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="form-password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password..."
            name="password"
            value={userData.password}
            onChange={onUserDataChange}
            required
          />
        </Form.Group>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={Config.captchaSitekey}
          onChange={onCaptchaChange}
          onExpired={onCaptchaExpired}
        />
        <Button variant="primary" type="submit" className="mt-2">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;