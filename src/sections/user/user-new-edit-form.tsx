import * as Yup from 'yup';
import React, { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fData } from 'src/utils/format-number';
import axios, { endpoints } from 'src/utils/axios';
import saveFileToServer from 'src/utils/save-file-to-server';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import DatePickerFormItem from 'src/components/custom/form/date-picker';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

type UserType = {
  name: string;
  email: string;
  password: string;
  avatar: any;
  phoneNumber: string;
  cpf: string;
  birthday: Date;
  role: string;
  status: string;
  province: string;
  city: string;
  street: string;
  zipCode: string;
};

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'guest', label: 'Guest' }
];

export default function UserNewEditForm(props) {
  const { currentUser } = props;
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string()
      .required('E-mail é obrigatório')
      .email('E-mail deve ser um endereço de e-mail válido'),
    password: Yup.string().required('Senha é obrigatória'),
    avatar: Yup.mixed<any>().nullable().required('Avatar é obrigatório'),
    phoneNumber: Yup.string().required('Número de telefone é obrigatório'),
    cpf: Yup.string().required('CPF é obrigatório'),
    birthday: Yup.date().required('Aniversário é obrigatório'),
    role: Yup.string().required('A função é obrigatória'),
    status: Yup.string(),
    province: Yup.string(),
    city: Yup.string(),
    street: Yup.string(),
    zipCode: Yup.string()
  });

  const defaultValues: UserType = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: '',
      avatar: currentUser?.avatar || null,
      phoneNumber: currentUser?.phoneNumber || '',
      cpf: currentUser?.cpf || '',
      birthday: currentUser?.birthday || new Date(),
      role: currentUser?.role || '',
      status: currentUser?.status || '',
      province: currentUser?.province || '',
      city: currentUser?.city || '',
      street: currentUser?.street || '',
      zipCode: currentUser?.zipCode || ''
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async data => {
    try {
      const avatar =
        data?.avatar?.id ?
          data.avatar
          : await saveFileToServer(data?.avatar, 'userAvatar');

      if (!avatar) throw new Error('File is not saved successfully');

      if (currentUser) {
        await axios.put(`${endpoints.user}/${currentUser.id}`, {
          ...data,
          avatar
        });
      } else {
        await axios.post(endpoints.user, {
          ...data,
          avatar,
          status: 'active'
        });
      }
      reset();
      enqueueSnackbar(currentUser ? 'Atualizar sucesso!' : 'Criar sucesso!');
      router.push(paths.admin.user.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

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
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={(values.status === 'active' && 'success') || 'error'}
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status === 'active' ? 'Ativo' : 'Desativado'}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
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
                    Permitido *.jpeg, *.jpg, *.png, *.gif
                    <br /> tamanho máximo de {fData(10 * 1024 * 1024)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={event =>
                          field.onChange(
                            event.target.checked ? 'deactive' : 'active'
                          )
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Deactive
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      Aplicar desabilitar conta
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Excluir usuário
                </Button>
              </Stack>
            )}
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
              <RHFTextField name="name" label="Nome completo" />
              <RHFTextField name="email" label="E-mail" />
              <RHFTextField
                name="password"
                label="Senha"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={
                            password.value ? 'solar:eye-bold' : (
                              'solar:eye-closed-bold'
                            )
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
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
              <RHFAutocomplete
                name="role"
                label="Papel"
                placeholder="Choose a role"
                fullWidth
                options={roles.map(option => option.value)}
                isOptionEqualToValue={(option, value) => option === value}
              />
              <RHFTextField name="province" label="Province" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="street" label="Street" />
              <RHFTextField name="zipCode" label="Zip Code" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {!currentUser ? 'Create User' : 'Salvar alterações'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
