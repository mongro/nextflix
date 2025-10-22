import React from "react";

interface InputErrorProps {
  error?: string | string[];
}

const InputError = ({ error }: InputErrorProps) => {
  if (!error) return null;

  const errorMessage = Array.isArray(error) ? error[0] : error;

  return <p className="text-destructive text-sm font-medium">{errorMessage}</p>;
};

export default InputError;
