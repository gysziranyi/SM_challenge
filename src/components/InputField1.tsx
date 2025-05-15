interface InputFieldProps {
  id: string;
  label?: string;
  name?: string;
  placeholder?: string;
  pattern?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = (props: InputFieldProps) => {
  return (
    <div className="flex gap-2">
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      <input
        className="border-b-[2px] bg-inputFieldBlue border-gray focus:bg-darkGreen focus:border-valid focus:border-teal focus:outline-none focus:ring-0"
        type="text"
        placeholder={props.placeholder}
        id={props.id}
        name={props.id}
        pattern={props.pattern}
        onChange={props.handleChange}
      />
    </div>
  );
};
