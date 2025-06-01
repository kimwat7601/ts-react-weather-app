import type { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Error: FC<Props> = ({ children }) => {
  return (
    <div className="error-message-box">
      <div className="error-message">{children}</div>
    </div>
  );
};
export default Error;
