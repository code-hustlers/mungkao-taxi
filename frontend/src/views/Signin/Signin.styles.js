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
