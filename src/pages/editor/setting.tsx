import { useState, useEffect } from 'react';
import { Input, Button, Popconfirm } from 'antd';
import { Template, template, tempMap } from './component';
import { DeleteOutlined } from '@ant-design/icons';
import { ItemBox } from './base';
import styles from './index.less';

type KeyToLabel = {
  [key in keyof Template]: ValueOf<Template>;
};

const keyToLabel: KeyToLabel = {
  type: '类型',
  label: '标签名',
  labelWidth: '标签宽度',
  placeholder: '提示文本',
  value: '默认值',
  options: '可选项',
  mode: '模式',
};

interface Props extends Template {
  onUpdate: (item: Template) => void;
  onDel: (idx: number | null) => void;
}

type Key = keyof typeof keyToLabel;
type ValueOf<T> = T[keyof T];

export default function Setting(props: Props) {
  const { onUpdate, onDel } = props;
  const [attr, setAttr] = useState<Partial<KeyToLabel>>({});

  useEffect(() => {
    setAttr({ ...props });
  }, []);

  function onInputChange(key: Key, value: string) {
    (attr[key] as ValueOf<KeyToLabel>) = value;
    setAttr({ ...attr });
  }

  function onSave() {
    onUpdate({ ...attr, labelWidth: Number(attr.labelWidth) } as Template);
  }

  return (
    <div className={styles.setting__wrapper}>
      {/* <div className={styles.title}>组件属性</div> */}
      {(Object.keys(attr) as Key[]).map(
        (key: Key) =>
          keyToLabel[key] && (
            <ItemBox
              isSetting
              key={attr.id + '_' + key}
              label={keyToLabel[key] as string}
              labelWidth={60}
            >
              {attr.type === 'text' || attr.value === 'textarea' ? (
                <Input
                  disabled={key === 'type'}
                  className={styles.item}
                  value={attr[key] as string}
                  onChange={({ target: { value } }) =>
                    onInputChange(key, value)
                  }
                ></Input>
              ) : null}
            </ItemBox>
          ),
      )}

      <Button type="primary" onClick={onSave} className={styles.button}>
        保存
      </Button>

      <Popconfirm title="是否确认删除" onConfirm={() => onDel(null)}>
        <DeleteOutlined className={styles.delete} />
      </Popconfirm>
    </div>
  );
}
