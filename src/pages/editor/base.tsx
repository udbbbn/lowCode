import { Select, Form, Popconfirm, Button } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import React, { CSSProperties, MouseEvent, ReactNode } from 'react';
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
  onAdd: (item: Template, idx: number) => void;
  onAddComp: () => void;
}

export const ItemBox = (props: {
  label: string;
  children: ReactNode;
  isSetting?: boolean;
  labelWidth?: number;
  wrapStyle?: CSSProperties;
  onSetting?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDel?: (event?: React.MouseEvent<HTMLElement>) => void;
  onAdd?: () => void;
}) => (
  <div className={styles.template__wrapper} style={{ ...props.wrapStyle }}>
    <span className={styles.label} style={{ width: props.labelWidth }}>
      {props.label}:
    </span>
    {props.children}
    {!props.isSetting && (
      <div className={styles.setting}>
        <EditOutlined onClick={props.onSetting} />
        <PlusCircleOutlined
          onClick={(e) => {
            e.stopPropagation();
            props?.onAdd?.();
          }}
        />
        <span onClick={(e) => e.stopPropagation()}>
          <Popconfirm title="是否确认删除" onConfirm={props.onDel}>
            <DeleteOutlined />
          </Popconfirm>
        </span>
      </div>
    )}
  </div>
);

export default function Base({
  formData,
  onFocus,
  onDel,
  onAdd,
  onAddComp,
}: Props) {
  return (
    <Form name="customForm" className={styles.base__wrapper}>
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
              onAdd={() => {
                onAdd(item, idx);
              }}
            >
              <CP {...item} onFocus={onFocus}></CP>
            </ItemBox>
          );
        })}
      <div className={styles.base__btn}>
        <Button type="primary" onClick={onAddComp}>
          添加组件
        </Button>
      </div>
    </Form>
  );
}
