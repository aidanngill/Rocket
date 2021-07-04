import React from "react";
import { useSelector } from "react-redux";
import { Button, Card, Container } from "react-bootstrap";

import Config from "../Config";

const Tools = () => {
  const user = useSelector(store => store.user);

  function sxUrl(anonymous = false) {
    let base = Config.apiUrl + "/tool/sharex";

    if (anonymous)
      base += "?anonymous=true";
    else
      base += "?apikey=" + user.apikey;

    return base;
  }

  return (
    <Container>
      <h1>Tools</h1>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>ShareX</Card.Title>
          <Card.Text>
            Download a configuration file for ShareX.
          </Card.Text>
          <Button href={sxUrl()} variant="primary">Download</Button>{" "}
          <Button href={sxUrl(true)} variant="secondary">Anonymous</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Tools;