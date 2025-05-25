import { type FC } from 'react';

type InputTextProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputText: FC<InputTextProps> = (props) => {
  return (
    <label htmlFor={props.id}>
      <input type="text" {...props} />
    </label>
  );
};

export default InputText;
