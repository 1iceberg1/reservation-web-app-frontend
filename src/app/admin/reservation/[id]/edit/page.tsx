import { ReservationEditView } from 'src/sections/reservation/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Painel de administração: edição do Reservation',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ReservationEditPage({ params }: Props) {
  const { id } = params;

  return <ReservationEditView id={id} />;
}
