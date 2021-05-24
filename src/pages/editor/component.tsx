import { SelectProps, Input, Radio, Checkbox, Select } from 'antd';
import { HTMLAttributes, ReactNode } from 'react';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

interface Template {
  id?: string;
  type: Type;
  label: string;
  placeholder?: string;
  options?: { label: string; value: Value }[];
  value: Value | Value[];
  mode?: SelectProps<unknown>['mode'];
}
export type Type = 'text' | 'radio' | 'checkbox' | 'textarea' | 'select';
type Value = string | number;
type DefaultValue = HTMLAttributes<unknown>['defaultValue'];

const template: Template[] = [
  {
    type: 'text',
    label: '文本框',
    placeholder: '请输入内容',
    value: '',
  },
  {
    type: 'radio',
    label: '单选框',
    options: [
      { label: '男', value: 0 },
      { label: '女', value: 1 },
    ],
    value: 0,
  },
  {
    type: 'checkbox',
    label: '多选框',
    options: [
      { label: '0-18 岁', value: 0 },
      { label: '18-28 岁', value: 1 },
    ],
    value: [0, 1],
  },
  {
    type: 'textarea',
    label: '多行文本',
    placeholder: '请输入内容',
    value: '',
  },
  {
    type: 'select',
    label: '选择框',
    placeholder: '请选择',
    mode: 'multiple',
    options: [
      { label: '中国', value: 0 },
      { label: '美国', value: 1 },
    ],
    value: [],
  },
];

const ItemBox = (props: { label: string; children: ReactNode }) => (
  <div className={styles.template__wrapper}>
    <span className={styles.label}>{props.label}:</span>
    {props.children}
  </div>
);

const tempMap: {
  [key in Type]?: {
    component: (props: any) => JSX.Element;
  };
} = {
  text: {
    component: ({ label, placeholder, value }: Template) => (
      <ItemBox label={label}>
        <Input
          placeholder={placeholder}
          defaultValue={value as DefaultValue}
        ></Input>
      </ItemBox>
    ),
  },
  radio: {
    component: ({ label, value, options }: Template) => (
      <ItemBox label={label}>
        <Radio.Group defaultValue={value}>
          {options!.map((item) => (
            <Radio key={item.label} value={item.value}>
              {item.label}
            </Radio>
          ))}
        </Radio.Group>
      </ItemBox>
    ),
  },
  checkbox: {
    component: ({ label, value, options }: Template) => (
      <ItemBox label={label}>
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
      </ItemBox>
    ),
  },
  textarea: {
    component: ({ label, value, placeholder }: Template) => (
      <ItemBox label={label}>
        <TextArea
          placeholder={placeholder}
          defaultValue={value as Value}
        ></TextArea>
      </ItemBox>
    ),
  },
  select: {
    component: ({ label, value, options, placeholder }: Template) => (
      <ItemBox label={label}>
        <Select placeholder={placeholder} defaultValue={value}>
          {options!.map((item) => (
            <Option key={item.label} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </ItemBox>
    ),
  },
};

export { template, tempMap };
