'use client';

import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister
} from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors,
  value?: string
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  placeholder, 
  id, 
  type, 
  required, 
  register,
  value 
}) => {
  return (
    <div className="relative w-full">
      <input
        value={value}
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="
          text-light-1
          placeholder:text-light-1
          py-2
          px-4
          bg-primary-500 
          w-full 
          rounded-full
          focus:outline-none
        "
      />
    </div>
   );
}
 
export default MessageInput;