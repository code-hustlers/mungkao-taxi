import React from "react";
import styled from "styled-components";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { CardForm } from "../../components/Card/CardForm";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { useInput, useChk } from "../../hooks";

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
  padding: 0.5rem;
  margin: auto 0;
`;

function Signup(props) {
  const id = useInput("");
  const pw = useInput("");
  const name = useInput('');
  const isPosition = useChk(false);

  console.log("TCL: Signup -> id,pw", id, pw, name, isPosition);

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

    let position = isPosition ? 1 : 0; // 1: 운전자, 0: 탑승자
    console.log({id}, {pw}, {name}, {position});
    
    return axios({
      method: 'POST',
      url: `${REACT_APP_SERVER_URL}:${REACT_APP_SERVER_PORT}${REACT_APP_SERVER_API_PREFIX}/signup`,
      data: {
        id: id.value,
        pw: pw.value,
        name: name.value,
        position: position,
        status: 0 // 0: 대기, 1: 운행중
      }
    }).then(res => {
      alert(res.data.msg);
      push('/');
    }).catch(err => {
      console.log(err);
    });

    // try {
    //   const {
    //     data: { result, msg }
    //   } = await axios.post(
    //     `${REACT_APP_SERVER_URL}:${REACT_APP_SERVER_PORT}${REACT_APP_SERVER_API_PREFIX}/signup`,
    //     { id, pw }
    //   );

    //   // const 문자로 리팩토링 필요
    //   if (result === 1) {
    //     alert(msg);
    //     push("/");
    //   } else {
    //     alert(`[Error Code : ${result}] : ${msg}`);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <Container>
      <CardForm card>
        <Input {...id} placeholder="id" />
        <Input {...pw} placeholder="password" />
        <Input {...name} placeholder="name" />
        <Input {...isPosition} type="checkbox" />
        <Button onClick={handleSignup}>Signup</Button>
      </CardForm>
    </Container>
  );
}

export default withRouter(Signup);
