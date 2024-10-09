import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Painel do vendedor: edição do usuário',
};

type Props = {
  params: {
    id: string;
  };
};

export default function UserEditPage({ params }: Props) {
  const { id } = params;

  return <UserEditView id={id} />;
}
