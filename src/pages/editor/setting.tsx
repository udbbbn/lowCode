import { template, tempMap } from './component';

export default function Setting() {
  return (
    <div>
      <div>选择类型</div>
      {template.map(({ type }) => {
        const CP = tempMap[type]?.component;
      })}
    </div>
  );
}
