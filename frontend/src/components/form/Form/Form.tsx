import React from 'react';
import AntForm from 'antd/lib/form/Form';

const Form = ({ children, ...rest }) => {
  return <AntForm {...rest}>{children}</AntForm>;
};

export default Form;
