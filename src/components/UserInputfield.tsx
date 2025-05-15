import { InputField } from "./inputfield";

interface UserInputFieldProps {
  id: string;
  label?: string;
  name?: string;
  placeholder?: string;
  pattern?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserInputField = (props: UserInputFieldProps) => {
  return (
    <InputField
      id={props.id}
      name={props.name}
      label={props.label}
      placeholder={props.placeholder}
      pattern={props.pattern}
      handleChange={props.handleChange}
    ></InputField>
  );
};
