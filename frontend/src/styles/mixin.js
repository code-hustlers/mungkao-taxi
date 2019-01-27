import { css } from "styled-components";

export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardStyle = css`
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.11);
  background-color: white;
  border-radius: ${props => props.theme.spacing.unit}rem;
  padding: ${props => props.theme.spacing.gutter || props.padding}rem;
`;
export const RaisedCardStyle = css`
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
  border-radius: ${props => props.theme.spacing.unit}rem;
  padding: ${props => props.theme.spacing.gutter || props.padding}rem;
`;
