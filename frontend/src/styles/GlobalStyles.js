import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    padding: 0;
    margin: 0;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
  }
  input, button {
    outline: none;
    border: none;
  }
  button {
    &:hover, &:active {
      cursor: pointer;
    }
  }
`;

export default GlobalStyles;
