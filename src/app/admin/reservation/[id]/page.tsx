import { ReservationDetailsView } from 'src/sections/reservation/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Painel de administração: detalhes da reserva',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ReservationDetailsPage({ params }: Props) {
  const { id } = params;

  return <ReservationDetailsView id={id} />;
}
