import { useEffect, useRef, useState } from 'react';
import { Drawer } from 'antd';
import Layout from '@/layout';
import { v4 as uuidv4 } from 'uuid';
import Base, { ItemBox } from './base';
import styles from './index.less';
import { template, Template, tempMap } from './component';

export default function IndexPage() {
  const [formData, setFormData] = useState<Template[]>([]);
  const [visible, setVisible] = useState(false);
  const compRef = useRef<Template | null>(null);

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
    compRef.current = item;
  }
  function onDel(idx: number) {
    formData.splice(idx, 1);
    setFormData([...formData]);
  }

  const CP = compRef.current ? tempMap[compRef.current!.type]!.component : null;
  return (
    <>
      <Layout>
        <div className={styles.wrapper}>
          <div className={styles.title}>基本信息</div>
          <Base formData={formData} onFocus={onFocus} onDel={onDel}></Base>
        </div>
      </Layout>
      <Drawer
        title="属性设置"
        placement="right"
        visible={visible}
        onClose={onClose}
      >
        {CP && (
          <ItemBox label={compRef.current!.label} isSetting>
            <CP {...compRef.current} onFocus={onFocus}></CP>
          </ItemBox>
        )}
      </Drawer>
    </>
  );
}
