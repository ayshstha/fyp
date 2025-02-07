import * as React from "react";
import "../../App.css";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

export default function MyTextField(props) {
  const { label, name, control } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          id={`outlined-${name}`}
          onChange={onChange}
          value={value}
          label={label}
          variant="outlined"
          className={"myForm"}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}
