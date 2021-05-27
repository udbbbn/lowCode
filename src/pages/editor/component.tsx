import { SelectProps, Input, Radio, Checkbox, Select } from 'antd';
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
  value: Value | Value[];
  mode?: SelectProps<unknown>['mode'];
}
export type Type = 'text' | 'radio' | 'checkbox' | 'textarea' | 'select';
type Value = string | number;
type DefaultValue = HTMLAttributes<unknown>['defaultValue'];

interface TempProps extends Template {
  onFocus: (item: FormData, idx: number) => void;
}

const template: Template[] = [
  {
    type: 'text',
    label: '文本框',
    labelWidth: 60,
    placeholder: '请输入内容',
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
    value: ['0', '1'],
  },
  {
    type: 'textarea',
    label: '多行文本',
    labelWidth: 60,
    placeholder: '请输入内容',
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
    value: [],
  },
];

const tempMap: {
  [key in Type]?: {
    component: (props: any) => JSX.Element;
  };
} = {
  text: {
    component: ({ placeholder, value }: TempProps) => (
      <Input
        placeholder={placeholder}
        defaultValue={value as DefaultValue}
      ></Input>
    ),
  },
  radio: {
    component: ({ value, options }: TempProps) => (
      <Radio.Group defaultValue={value}>
        {options!.map((item) => (
          <Radio key={item.label} value={item.value}>
            {item.label}
          </Radio>
        ))}
      </Radio.Group>
    ),
  },
  checkbox: {
    component: ({ value, options }: TempProps) => (
      <Checkbox.Group>
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
    component: ({ value, placeholder }: TempProps) => (
      <TextArea
        placeholder={placeholder}
        defaultValue={value as Value}
      ></TextArea>
    ),
  },
  select: {
    component: ({ value, options, placeholder }: TempProps) => (
      <Select placeholder={placeholder} defaultValue={value}>
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
