import React from "react";
import styled from "styled-components";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { CardForm } from "../../components/Card/CardForm";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { useInput } from "../../hooks";

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
  padding: 0.5rem;
`;

function Signup(props) {
  const id = useInput("");
  const pw = useInput("");

  console.log("TCL: Signup -> id,pw", id, pw);

  const handleSignup = async event => {
    event.preventDefault();

    const {
      REACT_APP_SERVER_URL,
      REACT_APP_SERVER_PORT,
      REACT_APP_SERVER_API_PREFIX
    } = process.env;
    const {
      history: { push }
    } = props;

    try {
      const {
        data: { result, msg }
      } = await axios.post(
        `${REACT_APP_SERVER_URL}:${REACT_APP_SERVER_PORT}${REACT_APP_SERVER_API_PREFIX}/signup`,
        { id, pw }
      );

      // const 문자로 리팩토링 필요
      if (result === 1) {
        alert(msg);
        push("/");
      } else {
        alert(`[Error Code : ${result}] : ${msg}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <CardForm card>
        <Input {...id} placeholder="id" />
        <Input {...pw} placeholder="password" />
        <Button onClick={handleSignup}>Signup</Button>
      </CardForm>
    </Container>
  );
}

export default withRouter(Signup);
