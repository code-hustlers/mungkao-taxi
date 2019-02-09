import styled from "styled-components";

const SignoutButton = styled.button`
  padding: 1rem;
  background: ${({
    theme: {
      color: { primary }
    }
  }) => primary};
  border-radius: 2px;
  color: white;
  float: right;
`;

export default SignoutButton;
