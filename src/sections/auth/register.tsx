'use client';

import React from 'react';
import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  role?: 'admin' | 'guest';
};

export default function Register({ role = 'guest' }: Props) {
  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Nome de usuário é obrigatório'),
    email: Yup.string()
      .required('E-mail é obrigatório')
      .email('E-mail deve ser um endereço de e-mail válido'),
    password: Yup.string().required('A senha é obrigatória'),
  });

  const defaultValues = {
    name: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async data => {
    try {
      await register?.(data.email, data.password, data.name, role);

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Já tem uma conta? </Typography>

        <Link href={paths.login} component={RouterLink} variant="subtitle2">
          Entrar
        </Link>
      </Stack>
    </Stack>
  );

  // const renderTerms = (
  //   <Typography
  //     component="div"
  //     sx={{
  //       mt: 2.5,
  //       textAlign: 'center',
  //       typography: 'caption',
  //       color: 'text.secondary',
  //     }}
  //   >
  //     {'Ao me inscrever, concordo com '}
  //     <Link underline="always" color="text.primary">
  //       Termos de serviço
  //     </Link>
  //     {' and '}
  //     <Link underline="always" color="text.primary">
  //       Política de privacidade
  //     </Link>
  //     .
  //   </Typography>
  // );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="name" label="Nome de usuário" />

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
                    password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
      >
        Registrar
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderHead}

        {renderForm}

        {/* {renderTerms} */}
      </FormProvider>
    </>
  );
}
