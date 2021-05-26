import { Select, Form, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { MouseEvent, ReactNode } from 'react';
import { Type, tempMap, Template } from './component';
import styles from './index.less';

export type FormData = {
  type: Type;
  label: string;
};

interface Props {
  formData: Template[];
  onFocus: (item: Template, idx: number) => void;
  onDel: (idx: number) => void;
}

export const ItemBox = (props: {
  label: string;
  children: ReactNode;
  isSetting?: boolean;
  labelWidth?: number;
  onSetting?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDel?: (event?: React.MouseEvent<HTMLElement>) => void;
}) => (
  <div className={styles.template__wrapper} onClick={props.onSetting}>
    <span className={styles.label} style={{ width: props.labelWidth }}>
      {props.label}:
    </span>
    {props.children}
    {!props.isSetting && (
      <div className={styles.setting}>
        <span onClick={(e) => e.stopPropagation()}>
          <Popconfirm title="是否确认删除" onConfirm={props.onDel}>
            <DeleteOutlined />
          </Popconfirm>
        </span>
      </div>
    )}
  </div>
);

export default function Base({ formData, onFocus, onDel }: Props) {
  return (
    <Form name="customForm">
      {formData &&
        formData.map((item, idx) => {
          const CP = tempMap[item.type]!.component;
          return (
            <ItemBox
              label={item.label}
              labelWidth={item.labelWidth}
              key={item.type + '_' + idx}
              onSetting={() => onFocus(item, idx)}
              onDel={(e) => {
                onDel(idx);
              }}
            >
              <CP {...item} onFocus={onFocus}></CP>
            </ItemBox>
          );
        })}
    </Form>
  );
}
