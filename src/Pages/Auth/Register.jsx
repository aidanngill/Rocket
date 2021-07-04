import React, { useRef, useState } from "react";
import { Redirect } from "react-router";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Form } from "react-bootstrap";

import store from "store";
import validator from "validator";
import ReCAPTCHA from "react-google-recaptcha";

import Config from "../../Config";
import Instance from "../../Session";

const Register = () => {
  const [captcha, setCaptcha] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: "",
    invite: ""
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

    addToast("Signing up...", {
      appearance: "info"
    });

    if (!captcha)
      return addToast("Please finish the Google reCAPTCHA challenge.", {
        appearance: "error"
      });

    if (!validator.isEmail(event.target.email.value))
      return addToast("Invalid email address was given.", {
        appearance: "error"
      });

    var bodyForm = new FormData(event.target);
    
    bodyForm.append("captcha", captcha);
    bodyForm.delete("g-recaptcha-response");

    Instance.request({
      method: "POST",
      url: "/auth/register",
      data: bodyForm,
    })
    .then(data => {
      store.set("user", data.data.user);
      dispatch({ type: "auth/user", payload: data.data.user });

      addToast("Successfully signed up.", {
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
      <h1>Register</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="form-email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email..."
            name="email"
            value={userData.email}
            onChange={onUserDataChange}
            required
          />
        </Form.Group>
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
        <Form.Group controlId="form-invite">
          <Form.Label>Invite</Form.Label>
          <Form.Control
            type="password"
            placeholder="Invite code here..."
            name="invite"
            value={userData.invite}
            onChange={onUserDataChange}
            disabled={Config.registration !== "closed"}
            required={Config.registration === "closed"}
          />
        </Form.Group>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={Config.captchaSitekey}
          onChange={onCaptchaChange}
          onExpired={onCaptchaExpired}
        />
        <Button variant="primary" type="submit" className="mt-2">
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default Register;