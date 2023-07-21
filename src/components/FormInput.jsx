import { useState } from 'react';

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, ...inputProps } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="flex flex-col w-[280px] md:w-full">
      <label className="text-sm text-gray-1000">{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() => inputProps.name === 'confirmPassword' && setFocused(true)}
        focused={focused.toString()}
        className="p-3 my-3 mx-0 rounded-md border border-gray-1000 focus:outline-none focus:border-md_green"
      />
      <span className="hidden text-[12px] p-2 text-red">{errorMessage}</span>
    </div>
  );
};

export default FormInput;
