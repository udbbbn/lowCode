import styles from './index.less';

interface Props {
  children: React.ReactChild;
}

export default function Layout({ children }: Props) {
  return (
    <div className={styles.layout}>
      <div className={styles.title}></div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
