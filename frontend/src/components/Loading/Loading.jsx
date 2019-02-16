import React from "react";
import { SyncLoader } from "react-spinners";
import styled from "styled-components";
import { flexCenter } from "../../styles/mixin";

const Container = styled.div`
  /* align-self: stretch;
  flex: 1; */
  position: fixed;
  width: 100vw;
  height: 100vh;
  ${flexCenter};
  display: ${({ loading }) => (loading ? "flex" : "none")};
  background: rgba(73, 80, 87, 0.8);
`;

export default function Loading({ loading }) {
  return (
    <Container loading={loading}>
      <SyncLoader color={"rgb(80, 227, 194)"} loading={loading} />
    </Container>
  );
}
