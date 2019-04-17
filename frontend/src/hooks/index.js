import { useState } from "react";

export function useInput(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  const onChange = e => {
    const {
      target: { value }
    } = e;

    setValue(value);
  };

  return { value, onChange };
}

export function useChk(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  const onChange = e => {
    setValue(!value);
  };

  return { value, onChange };
}
