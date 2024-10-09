export type IUserTableFilterValue = string | string[];

export type IUserTableFilters = {
  name: string;
  role: string[];
  status: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserItem = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthday: Date;
  cpf: string;
  status: string;
  role: string;
  avatar: any;
  province: string;
  city: string;
  street: string;
  zipCode: string;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
