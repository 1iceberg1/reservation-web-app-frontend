import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';
import axios, { endpoints } from 'src/utils/axios';
import saveFileToServer from 'src/utils/save-file-to-server';

import { useAuthContext } from 'src/auth/hooks';

import { useSnackbar } from 'src/components/snackbar';
import DatePickerFormItem from 'src/components/custom/form/date-picker';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type UserType = {
  name: string;
  email: string;
  avatar: any;
  phoneNumber: string;
  cpf: string;
  birthday: Date;
  province: string;
  city: string;
  street: string;
  zipCode: string;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, logout } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string()
      .required('E-mail é obrigatório')
      .email('E-mail deve ser um endereço de e-mail válido'),
    avatar: Yup.mixed<any>().nullable().required('Avatar é obrigatório'),
    phoneNumber: Yup.string().required('Número de telefone é obrigatório'),
    cpf: Yup.string().required('CPF é obrigatório'),
    birthday: Yup.date().required('Aniversário é obrigatório'),
    province: Yup.string(),
    city: Yup.string(),
    street: Yup.string(),
    zipCode: Yup.string()
  });

  const router = useRouter();

  const defaultValues: UserType = {
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || null,
    phoneNumber: user?.phoneNumber || '',
    cpf: user?.cpf || '',
    birthday: user?.birthday || null,
    province: user?.province || '',
    city: user?.city || '',
    street: user?.street || '',
    zipCode: user?.zipCode || ''
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = handleSubmit(async data => {
    try {
      const avatar =
        data?.avatar?.id ?
          data.avatar
        : await saveFileToServer(data?.avatar, 'userAvatar');

      if (!avatar) {
        throw new Error('File is not saved successfully');
      }

      await axios.put(endpoints.auth.profile, { ...data, avatar });
      enqueueSnackbar('Atualizar sucesso!');
    } catch (error) {
      console.error(error);
    }
  });

  const removeAccount = async () => {
    try {
      await axios.delete(endpoints.auth.profile);
      enqueueSnackbar('Remove success!');
      await logout();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file)
      });

      if (file) {
        setValue('avatar', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="avatar"
              maxSize={10 * 1024 * 1024}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled'
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(10 * 1024 * 1024)}
                </Typography>
              }
            />

            <Button
              variant="soft"
              color="error"
              sx={{ mt: 3 }}
              onClick={removeAccount}
            >
              Excluir usuário
            </Button>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)'
              }}
            >
              <RHFTextField name="name" label="Nome" />
              <RHFTextField name="email" label="E-mail" />
              <RHFTextField
                name="phoneNumber"
                label="Telefone"
                mask="(99)99999-9999"
              />
              <RHFTextField
                name="cpf"
                label="Número do CPF"
                mask="999.999.999-99"
                helperText="Digite no formato 000.000.000-00"
              />
              <DatePickerFormItem name="birthday" label="Aniversário" />
              <RHFTextField name="province" label="Province" />
              <RHFTextField name="street" label="Street" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="zipCode" label="Zip Code" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Salvar alterações
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
