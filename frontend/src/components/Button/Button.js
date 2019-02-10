import styled from "styled-components";

const Button = styled.button`
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

export default Button;
