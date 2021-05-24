import { Select, Form } from 'antd';
import { Type, tempMap } from './component';

export type FormData = {
  type: Type;
};

interface Props {
  formData: FormData[];
}

export default function Base({ formData }: Props) {
  return (
    <Form name="customForm">
      {formData &&
        formData.map((item, idx) => {
          const CP = tempMap[item.type]!.component;
          return <CP key={item.type + '_' + idx} {...item}></CP>;
        })}
    </Form>
  );
}
