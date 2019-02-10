import styled from "styled-components";
import { flexCenter } from "../../styles/mixin";

export const Container = styled.div`
  flex: 1;
  ${({
    theme: {
      color: { primary, secondary }
    }
  }) => `
    background: linear-gradient(${primary}, rgba(0, 0, 0, 0.5));
  `}

  ${flexCenter};
  flex-flow: column wrap;
  /* width: 500px; */
`;

export const Input = styled.input`
  font-size: 1rem;
  border-bottom: 1px solid #bbb;
  color: red;
  height: 2rem;
  align-self: inherit;
  padding: 0.5rem 1rem;
`;

export const Button = styled.button`
  align-self: inherit;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: ${({
    variant,
    theme: {
      color: { secondary }
    }
  }) => secondary};
  color: ${({
    variant,
    theme: {
      color: { primary }
    }
  }) => (variant === "primary" ? primary : "#fff")};

  font-size: 1rem;
`;
