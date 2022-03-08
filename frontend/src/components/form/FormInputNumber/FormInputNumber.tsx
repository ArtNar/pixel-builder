import React from 'react';
import FormItem, { FormItemProps } from 'antd/lib/form/FormItem';
import { InputNumber, InputNumberType } from '../../InputNumber';

const FormInputNumber = ({ name, label, rules, ...rest }: FormItemProps & InputNumberType) => {
  return (
    <FormItem rules={rules} name={name} label={label}>
      <InputNumber {...rest} />
    </FormItem>
  );
};

export default FormInputNumber;
