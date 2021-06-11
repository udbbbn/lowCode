import { useState, useEffect, Fragment } from 'react';
import { Input, Button, Popconfirm, Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { useImmer } from 'use-immer';
import produce from 'immer';
import cloneDeep from 'lodash.clonedeep';
import { Template, template, tempMap } from './component';
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { v4 as uuidV4 } from 'uuid';
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
type OptionChangeType = 'change' | 'del' | 'add';

export default function Setting(props: Props) {
  const { comp, type, onUpdate, onDel, onAdd } = props;
  const [attr, setAttr] = useImmer<Partial<Template>>({});
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    comp && setAttr({ ...comp });
  }, [comp]);

  function onInputChange(key: Key, value: string) {
    setAttr((draft) => {
      (draft[key] as ValueOf<KeyToLabel>) = value;
    });
  }

  function onRadioChange({ target: { value } }: RadioChangeEvent) {
    setIdx(value);
  }

  function onDefaultRadioChange({ target: { value } }: RadioChangeEvent) {
    setAttr((draft) => {
      draft.value = value;
    });
  }

  function onOptionChange(
    type: OptionChangeType,
    label: string,
    value: string,
  ) {
    if (attr.options) {
      const idx = attr.options.findIndex((el) => el.value === value);
      setAttr((draft) => {
        if (type === 'change') {
          draft.options![idx].label = label;
        } else if (type === 'del') {
          draft.options!.splice(idx, 1);
        } else {
          draft.options!.splice(idx + 1, 0, { label, value: uuidV4() });
        }
      });
    }
  }

  function onSave() {
    onUpdate(
      produce(attr, (draft) => {
        draft.labelWidth = Number(attr.labelWidth);
      }) as Template,
    );
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
                  {...(key === 'options'
                    ? { wrapStyle: { alignItems: 'flex-start' } }
                    : {})}
                >
                  {key === 'options' ? (
                    <OptionSetting
                      options={attr.options as Template['options']}
                      onOptionChange={onOptionChange}
                    ></OptionSetting>
                  ) : attr.type === 'radio' && key === 'value' ? (
                    <Radio.Group
                      defaultValue={attr.value}
                      onChange={onDefaultRadioChange}
                    >
                      {attr.options?.map((el) => (
                        <Fragment key={el.value}>
                          {el.label && el.label !== '' && (
                            <Radio value={el.value}>{el.label}</Radio>
                          )}
                        </Fragment>
                      ))}
                    </Radio.Group>
                  ) : key === 'mode' ? null : (
                    <Input
                      disabled={key === 'type'}
                      className={styles.item}
                      value={attr[key] as string}
                      onChange={({ target: { value } }) =>
                        onInputChange(key, value)
                      }
                    ></Input>
                  )}
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

interface OptionProps {
  options: Template['options'];
  onOptionChange: (
    type: OptionChangeType,
    label: string,
    value: string,
  ) => void;
}

function OptionSetting({ options, onOptionChange }: OptionProps) {
  return (
    <div className={styles.options_wrapper}>
      {options?.map((item) => (
        <div className={styles.options_item} key={item.value}>
          <Input
            value={item.label}
            onChange={({ target: { value } }) => {
              onOptionChange('change', value, item.value as string);
            }}
            style={{ flex: 1 }}
          ></Input>
          {options.length > 1 && (
            <MinusCircleOutlined
              style={{ marginLeft: 10 }}
              onClick={() => onOptionChange('del', '', item.value as string)}
            />
          )}
          <PlusCircleOutlined
            style={{ marginLeft: 5 }}
            onClick={() => onOptionChange('add', '', item.value as string)}
          />
        </div>
      ))}
    </div>
  );
}
