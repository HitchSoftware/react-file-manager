// REPO: @hitchsoftware/react-file-manager
// FILE: src/validators/propValidators.ts

import { Validator } from "prop-types";

export const dateStringValidator: Validator<string> = (
  props: Record<string, any>,
  propName: string,
  componentName: string
): Error | null => {
  const value = props[propName];

  if (value && isNaN(Date.parse(value))) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a valid date string (ISO 8601) but received \`${value}\`.`
    );
  }

  return null;
};

export const urlValidator: Validator<string> = (
  props: Record<string, any>,
  propName: string,
  componentName: string
): Error | null => {
  const url = props[propName];

  try {
    new URL(url);
    return null;
  } catch {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a valid URL but received \`${url}\`.`
    );
  }
};
