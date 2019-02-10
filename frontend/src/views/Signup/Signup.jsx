import React, { useState } from "react";
import styled from "styled-components";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Container = styled.div`
  /* background: pink; */
  display: flex;
  flex-flow: column wrap;
`;

function Signup() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  console.log("TCL: Signup -> id,pw", id, pw);

  const handleSignup = () => {
    console.log("TCL: handleSignup -> log");
  };

  return (
    <Container>
      <Input
        value={id}
        onChange={event => setId(event.target.value)}
        placeholder="id"
      />
      <Input
        value={pw}
        onChange={event => setPw(event.target.value)}
        placeholder="password"
      />
      <Button onClick={handleSignup}>Signup</Button>
    </Container>
  );
}

export default Signup;
