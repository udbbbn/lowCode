import { useState, useEffect } from 'react';
import { Input, Button, Popconfirm, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
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

export type SettingType = 'compSetting' | 'addComponent';
interface Props {
  comp: Template;
  type: SettingType;
  onUpdate: (item: Template) => void;
  onDel: (idx: number | null) => void;
  onAdd: (idx: number) => void;
}

type Key = keyof typeof keyToLabel;

export default function Setting(props: Props) {
  const { comp, type, onUpdate, onDel, onAdd } = props;
  const [attr, setAttr] = useState<Partial<KeyToLabel>>({});
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    comp && setAttr({ ...comp });
  }, [comp]);

  function onInputChange(key: Key, value: string) {
    (attr[key] as ValueOf<KeyToLabel>) = value;
    setAttr({ ...attr });
  }

  function onSave() {
    onUpdate({ ...attr, labelWidth: Number(attr.labelWidth) } as Template);
  }

  function onRadioChange({ target: { value } }: RadioChangeEvent) {
    setIdx(value);
  }

  function onRadioSave() {
    setIdx(0);
    onAdd(idx);
  }

  return (
    <div className={styles.setting__wrapper}>
      {/* <div className={styles.title}>组件属性</div> */}

      {type === 'compSetting' && (
        <>
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
        </>
      )}

      {type === 'addComponent' && (
        <>
          <Radio.Group
            className={styles.radio}
            onChange={onRadioChange}
            value={idx}
          >
            {template.map((item, idx) => {
              const CP = tempMap[item.type]!.component;

              return (
                <Radio value={idx} key={item.type + '_' + idx}>
                  <ItemBox label={item.label} labelWidth={60} isSetting>
                    <CP {...item}></CP>
                  </ItemBox>
                </Radio>
              );
            })}
          </Radio.Group>

          <Button
            type="primary"
            onClick={onRadioSave}
            className={styles.button}
          >
            添加
          </Button>
        </>
      )}
    </div>
  );
}
