import { useEffect, useRef, useState } from 'react';
import { Drawer, message } from 'antd';
import Layout from '@/layout';
import { v4 as uuidV4 } from 'uuid';
import Base, { ItemBox } from './base';
import { template, Template, tempMap } from './component';
import Setting, { SettingType } from './setting';
import { useImmer } from 'use-immer';
import styles from './index.less';

export default function IndexPage() {
  const [formData, setFormData] = useImmer<Template[]>([]);
  const [visible, setVisible] = useState(false);
  const compRef =
    useRef<{ item: Template | null; idx: number; type: SettingType } | null>(
      null,
    );

  useEffect(() => {
    const target = template.find((el) => el.type === 'text')!;
    setFormData([{ ...target, id: uuidV4() }]);
  }, []);

  function onClose() {
    setVisible(false);
  }

  // 聚焦显示组件设置
  function onFocus(item: Template, idx: number) {
    compRef.current = { item, idx, type: 'compSetting' };
    setVisible(true);
  }
  function onBaseChange(value: string, idx: number) {}

  // 组件删除处理
  function onDel(idx: number | null) {
    // 从 drawer 中删除 没有 idx 直接从 ref 中获取
    setFormData((draft) => {
      draft.splice(idx || compRef.current!.idx, 1);
    });
    // 从 drawer 删除需要同时关闭
    if (idx === null) {
      onClose();
    }
  }

  // 显示组件选择 drawer
  function onPrevAddComp() {
    compRef.current = { item: null, idx: -1, type: 'addComponent' };
    setVisible(true);
  }

  // 复制组件处理
  function onCopy(item: Template, idx: number) {
    const temp = template.find((el) => el.type === item.type);
    setFormData((draft) => {
      draft.splice(idx + 1, 0, { ...temp, id: uuidV4() } as Template);
    });
    message.success('添加成功');
  }

  // 新增组件处理
  function onAddComp(idx: number) {
    const temp = template[idx];
    setFormData((draft) => {
      draft.push({ ...temp, id: uuidV4() });
    });
    message.success('添加成功');
    onClose();
  }

  function onSettingUpdate(item: Template) {
    const { id } = item;
    let idx = formData.findIndex((el) => el.id === id);
    setFormData((draft) => {
      draft[idx] = { ...draft[idx], ...item };
    });
    onClose();
  }

  return (
    <>
      <Layout>
        <div className={styles.wrapper}>
          <div className={styles.title}>基本信息</div>
          <Base
            formData={formData}
            onFocus={onFocus}
            onChange={onBaseChange}
            onAdd={onCopy}
            onDel={onDel}
            onAddComp={onPrevAddComp}
          ></Base>
        </div>
      </Layout>
      <Drawer
        title="设置"
        placement="right"
        visible={visible}
        onClose={onClose}
      >
        <Setting
          comp={compRef.current?.item as Template}
          type={compRef.current?.type as SettingType}
          onUpdate={onSettingUpdate}
          onAdd={onAddComp}
          onDel={onDel}
        ></Setting>
      </Drawer>
    </>
  );
}
