import styled from "styled-components";
import { flexCenter, RaisedCardStyle, CardStyle } from "../../styles/mixin";

export const CardForm = styled.form`
  ${flexCenter};
  flex-flow: column wrap;
  flex: 1;
  align-self: stretch;
  padding: 1rem;
  ${({ card }) => card && CardStyle}
  transition: 0.5s;
  &:focus,
  &:hover {
    transition: 0.5s;
    ${({ card }) => card && RaisedCardStyle}
  }
`;
