import React from 'react';
import FormItem, { FormItemProps } from 'antd/lib/form/FormItem';
import { InputCheckbox, InputCheckboxType } from '../../InputCheckbox';

const FormCheckbox = ({ name, label, rules, valuePropName, ...rest }: FormItemProps & InputCheckboxType) => {
  return (
    <FormItem rules={rules} name={name} label={label} valuePropName={valuePropName}>
      <InputCheckbox {...rest} />
    </FormItem>
  );
};

export default FormCheckbox;
