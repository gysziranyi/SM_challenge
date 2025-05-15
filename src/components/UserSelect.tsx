import { Option, Select } from "./select";

export interface UserSelectProps {
  id: string;
  name: string;
  label?: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
}

export const UserSelect = (props: UserSelectProps) => {
  return (
    <Select
      id={props.id}
      name={props.name}
      label={props.label}
      options={props.options}
      handleChange={props.handleChange}
    ></Select>
  );
};
