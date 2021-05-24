import { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import Layout from '@/layout';
import { v4 as uuidv4 } from 'uuid';
import Base, { FormData } from './base';
import styles from './index.less';
import { template } from './component';

export default function IndexPage() {
  const [formData, setFormData] = useState<FormData[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = template.find((el) => el.type === 'text')!;
    target.id = uuidv4();
    setFormData([target]);
  }, []);

  function onClose() {}

  return (
    <>
      <Layout>
        <div className={styles.wrapper}>
          <div className={styles.title}>基本信息</div>
          <Base formData={formData}></Base>
        </div>
      </Layout>
      <Drawer
        title="属性设置"
        placement="right"
        visible={visible}
        onClose={onClose}
      ></Drawer>
    </>
  );
}
