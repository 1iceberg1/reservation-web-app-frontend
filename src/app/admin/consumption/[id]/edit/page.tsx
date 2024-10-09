import { ConsumptionEditView } from 'src/sections/consumption/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Painel de administração: edição de consumption',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ConsumptionEditPage({ params }: Props) {
  const { id } = params;

  return <ConsumptionEditView id={id} />;
}
