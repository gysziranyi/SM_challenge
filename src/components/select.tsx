export interface SelectProps {
  id: string;
  name: string;
  label?: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
}

export interface Option {
  label: string;
  value: string;
}

export const Select = (props: SelectProps) => {
  return (
    <div className="flex gap-2">
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      <select
        className="border-b-[2px] bg-inputFieldBlue border-gray focus:bg-darkGreen focus:border-valid focus:border-teal focus:outline-none focus:ring-0"
        id={props.id}
        name={props.name}
        onChange={props.handleChange}
      >
        {props.options.map((option) => (<option value={option.value}>{option.label}</option>))}
      </select>
    </div>
  );
};
