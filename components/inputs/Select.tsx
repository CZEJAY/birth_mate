'use client';

import ReactSelect from 'react-select'

interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  return ( 
    <div className="z-[100]">
      <label
        className="
          block 
          text-sm 
          font-medium 
          leading-6 
          text-light-1
        "
      >
        {label}
      </label>
      <div className="mt-2">
      <ReactSelect
        isDisabled={disabled}
        value={value}
        onChange={onChange}
        isMulti
        options={options}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menu: (base) => ({ ...base, background: "#000000" }),
          option: (base, state) => ({
            ...base,
            background: state.isSelected ? "#121417" : "#000000",
            color: state.isSelected ? "#EFEFEF" : "#ffffff",
          }),
          
        }}
        classNames={{
          control: () => 'text-sm',

        }}
      />
      </div>
    </div>
   );
}
 
export default Select;