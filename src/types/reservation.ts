export type IReservationItem = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  province: string;
  city: string;
  street: string;
  zipCode: string;
  consumptions: [
    {
      consumption: any;
      quantity: number;
    },
  ];
  documents: any[];
  status: string;
  cost: number;
  createdBy: any;
};

export type IReservationTableFilterValue = string | string[];

export type IReservationTableFilters = {
  status: string[];
};
