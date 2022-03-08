import React from 'react';
import FormItem, { FormItemProps } from 'antd/lib/form/FormItem';
import { InputDate, InputDateType } from '../../InputDate';

const FormInputDate = ({ name, label, rules, ...rest }: FormItemProps & InputDateType) => {
  return (
    <FormItem rules={rules} name={name} label={label}>
      <InputDate {...rest} />
    </FormItem>
  );
};

export default FormInputDate;
