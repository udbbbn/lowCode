import { useEffect, useRef, useState } from 'react';
import { Drawer } from 'antd';
import Layout from '@/layout';
import { v4 as uuidv4 } from 'uuid';
import Base, { ItemBox } from './base';
import { template, Template, tempMap } from './component';
import Setting from './setting';
import styles from './index.less';

export default function IndexPage() {
  const [formData, setFormData] = useState<Template[]>([]);
  const [visible, setVisible] = useState(false);
  const compRef = useRef<{ item: Template; idx: number } | null>(null);

  useEffect(() => {
    const target = template.find((el) => el.type === 'text')!;
    target.id = uuidv4();
    setFormData([target]);
  }, []);

  function onClose() {
    setVisible(false);
  }
  function onFocus(item: Template, idx: number) {
    setVisible(true);
    compRef.current = { item, idx };
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
          <Base formData={formData} onFocus={onFocus} onDel={onDel}></Base>
        </div>
      </Layout>
      <Drawer
        title="设置"
        placement="right"
        visible={visible}
        onClose={onClose}
      >
        <Setting
          {...(compRef.current?.item as Template)}
          onUpdate={onSettingUpdate}
          onDel={onDel}
        ></Setting>
      </Drawer>
    </>
  );
}
