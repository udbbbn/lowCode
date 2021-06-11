import { SelectProps, Input, Radio, Checkbox, Select } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { HTMLAttributes } from 'react';

const { TextArea } = Input;
const { Option } = Select;

export interface Template {
  id?: string;
  type: Type;
  label: string;
  labelWidth: number;
  placeholder?: string;
  options?: { label: string; value: Value }[];
  defaultValue: Value | Value[];
  value: Value | Value[];
  mode?: SelectProps<unknown>['mode'];
}
export type Type = 'text' | 'radio' | 'checkbox' | 'textarea' | 'select';
type Value = string | number;
type DefaultValue = HTMLAttributes<unknown>['defaultValue'];

interface TempProps extends Template {
  onChange: (value: any) => void;
}

const template: Template[] = [
  {
    type: 'text',
    label: '文本框',
    labelWidth: 60,
    placeholder: '请输入内容',
    defaultValue: '',
    value: '',
  },
  {
    type: 'radio',
    label: '单选框',
    labelWidth: 60,
    options: [
      { label: '男', value: '0' },
      { label: '女', value: '1' },
    ],
    defaultValue: '0',
    value: '0',
  },
  {
    type: 'checkbox',
    label: '多选框',
    labelWidth: 60,
    options: [
      { label: '0-18 岁', value: '0' },
      { label: '18-28 岁', value: '1' },
    ],
    defaultValue: ['0'],
    value: ['0'],
  },
  {
    type: 'textarea',
    label: '多行文本',
    labelWidth: 60,
    placeholder: '请输入内容',
    defaultValue: '',
    value: '',
  },
  {
    type: 'select',
    label: '选择框',
    labelWidth: 60,
    placeholder: '请选择',
    mode: 'multiple',
    options: [
      { label: '中国', value: '0' },
      { label: '美国', value: '1' },
    ],
    defaultValue: [],
    value: [],
  },
];

const tempMap: {
  [key in Type]?: {
    component: (props: any) => JSX.Element;
  };
} = {
  text: {
    component: ({ placeholder, value, onChange }: TempProps) => (
      <Input
        placeholder={placeholder}
        value={value as DefaultValue}
        onChange={({ target: { value } }) => onChange(value)}
      ></Input>
    ),
  },
  radio: {
    component: ({ value, options, onChange }: TempProps) => (
      <Radio.Group
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
      >
        {options!.map((item) => (
          <Radio key={item.label} value={item.value}>
            {item.label}
          </Radio>
        ))}
      </Radio.Group>
    ),
  },
  checkbox: {
    component: ({ value, options, onChange }: TempProps) => (
      <Checkbox.Group
        value={value as CheckboxValueType[]}
        onChange={(value) => onChange(value)}
      >
        {options!.map((item) => (
          <Checkbox
            key={item.label}
            value={item.value}
            defaultChecked={(value as Value[]).includes(item.value)}
          >
            {item.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    ),
  },
  textarea: {
    component: ({ value, placeholder, onChange }: TempProps) => (
      <TextArea
        placeholder={placeholder}
        value={value as Value}
        onChange={({ target: { value } }) => onChange(value)}
      ></TextArea>
    ),
  },
  select: {
    component: ({ value, options, placeholder, onChange }: TempProps) => (
      <Select placeholder={placeholder} value={value} onChange={onChange}>
        {options!.map((item) => (
          <Option key={item.label} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    ),
  },
};

export { template, tempMap };
