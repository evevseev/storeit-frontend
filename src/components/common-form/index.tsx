import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormInputField } from "./text-field";
import { FormSubmitButton } from "./submit-button";
import React from "react";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField: FormInputField,
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
});

export function FormBlock({
  children,
}: Readonly<{ children?: React.ReactNode }>) {
  return <div className="flex flex-col gap-4 pb-6">{children}</div>;
}

export function FormBlockRow({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

export { FormBlockTitle } from "./block-title";
export { FormSubmitButton } from "./submit-button";
export { FormInputField } from "./text-field";
