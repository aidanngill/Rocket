import React from "react";
import { Container } from "react-bootstrap";

import Config from "../Config";

const Contact = () => {
  return (
    <Container>
      <h1>Contact</h1>
      <p>You can reach the site maintainer at the following points.</p>
      {Config.social.email &&
        <div>
          <h3>Email</h3>
          <a href={"mailto:" + Config.social.email}>
            {Config.social.email}
          </a>
        </div>
      }
    </Container>
  );
}

export default Contact;