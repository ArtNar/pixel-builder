import React from 'react';
import FormItem, { FormItemProps } from 'antd/lib/form/FormItem';
import { Input, InputType } from '../../Input';

const FormInput = ({ name, label, rules, ...rest }: FormItemProps & InputType) => {
  return (
    <FormItem rules={rules} name={name} label={label}>
      <Input {...rest} />
    </FormItem>
  );
};

export default FormInput;
