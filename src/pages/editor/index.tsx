import { useEffect, useRef, useState } from 'react';
import { Drawer, message } from 'antd';
import Layout from '@/layout';
import { v4 as uuidv4 } from 'uuid';
import Base, { ItemBox } from './base';
import { template, Template, tempMap } from './component';
import Setting, { SettingType } from './setting';
import styles from './index.less';

export default function IndexPage() {
  const [formData, setFormData] = useState<Template[]>([]);
  const [visible, setVisible] = useState(false);
  const compRef =
    useRef<{ item: Template | null; idx: number; type: SettingType } | null>(
      null,
    );

  useEffect(() => {
    const target = template.find((el) => el.type === 'text')!;
    setFormData([{ ...target, id: uuidv4() }]);
  }, []);

  function onClose() {
    setVisible(false);
  }
  function onFocus(item: Template, idx: number) {
    compRef.current = { item, idx, type: 'compSetting' };
    setVisible(true);
  }
  function onDel(idx: number | null) {
    // 从 drawer 中删除 没有 idx 直接从 ref 中获取
    formData.splice(idx || compRef.current!.idx, 1);
    setFormData([...formData]);
    // 从 drawer 删除需要同时关闭
    if (idx === null) {
      onClose();
    }
  }
  function onAdd(item: Template, idx: number) {
    const temp = template.find((el) => el.type === item.type);
    formData.splice(idx + 1, 0, { ...temp, id: uuidv4() } as Template);
    setFormData([...formData]);
    message.success('添加成功');
  }
  function onPrevAddComp() {
    compRef.current = { item: null, idx: -1, type: 'addComponent' };
    setVisible(true);
  }
  function onAddComp(idx: number) {
    const temp = template[idx];
    formData.push({ ...temp, id: uuidv4() });
    setFormData([...formData]);
    message.success('添加成功');
    onClose();
  }
  function onSettingUpdate(item: Template) {
    const { id } = item;
    let idx = formData.findIndex((el) => el.id === id);
    formData[idx] = { ...formData[idx], ...item };
    setFormData([...formData]);
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
            onAdd={onAdd}
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
