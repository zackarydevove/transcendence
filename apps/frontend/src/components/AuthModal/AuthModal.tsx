import useAuthContext from "@contexts/AuthContext/useAuthContext"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"


import { FieldErrors, SubmitHandler, UseFormRegister, useForm } from 'react-hook-form'
import { useCallback, useEffect, useMemo } from "react"
import AuthModalForm from "./AuthModalForm"
import AuthModalFormLogin from "./AuthModalFormLogin"
import AuthModalFormRegister from "./AuthModalFormRegister"
import type { AuthProps } from "@contexts/AuthContext/createAuthStore"
import Button from "@mui/material/Button"


export interface AuthForm {
  username: string
  email: string
  password: string
}

const forms: Record<NonNullable<AuthProps['authMode']>, React.FC<{
  register: UseFormRegister<AuthForm>,
  errors: FieldErrors<AuthForm>
  getErrorMessage: (field: keyof AuthForm) => string | null
}>> = {
  login: AuthModalFormLogin,
  register: AuthModalFormRegister,
  forgotPassword: () => null
}

const AuthModal = () => {

  const modalOpen = useAuthContext((state) => state.modalOpen)
  const toggleModal = useAuthContext((state) => state.toggleModal)
  const login = useAuthContext((state) => state.login)
  const register = useAuthContext((state) => state.register)
  const authMode = useAuthContext((state) => state.authMode)
  const setAuthMode = useAuthContext((state) => state.setAuthMode)
  const authError = useAuthContext((state) => state.authError)

  const {
    register: registerField,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthForm>()


  const submit: SubmitHandler<AuthForm> = useCallback((body) => {
    if (authMode === 'login') {
      login({
        password: body.password,
        username: body.username
      })
    } else if (authMode === 'register') {
      register({
        email: body.email,
        password: body.password,
        username: body.username
      })
    }
  }, [authMode])

  const getErrorMessage = useCallback((field: keyof AuthForm) => {
    if (errors[field]) {
      return errors[field]?.message || 'Le champ est invalide'
    }
    return null
  }, [errors])

  const Form = useMemo(() => {
    return authMode ? forms[authMode] : null
  }, [authMode, authError])

  useEffect(() => {
    if (!authError) return

    if (authError.errors) {
      authError.errors.forEach((error) => {
        setError(error.property as keyof AuthForm, {
          type: "pattern",
          message: error.messages[0]
        }, {
          shouldFocus: true
        })
      })
    }
  }, [authError])

  return <Modal
    open={modalOpen}
    onClose={() => {
      toggleModal()
      reset()
    }}
    className="flex items-center justify-center"
    aria-labelledby="Modal de connexion / inscription"
    aria-describedby="Ce modal permet de se connecter ou de s'inscrire"
  >
    <Box className="max-w-[335px] flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8">

      <h1 className='text-3xl font-bold mb-8'>{authMode === "login" ? "LOG IN" : "SIGN UP"}</h1>

      <AuthModalForm onSubmit={handleSubmit(submit)}>
        {Form && <Form
          register={registerField}
          errors={errors}
          getErrorMessage={getErrorMessage}
        />}
      </AuthModalForm>

      <div className='relative w-full mb-4 py-5 mt-4'>
        <div className='w-full h-1 bg-gray-200'></div>
        <p className='absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-10 inline-block px-2 bg-white text-gray-500 border border-gray-200'>OR</p>
      </div>

      <div className='text-center flex gap-1 max-sm:flex-col'>
        <p className='text-gray-500'>{
          authMode === "login"
            ? "Need an account?"
            : "Already a user?"
        }</p>
        <a className='text-indigo-500 hover:underline cursor-pointer' onClick={() => {
          reset()
          setAuthMode(authMode === 'login' ? 'register' : 'login')
        }}>{
            authMode === "login"
              ? "SIGN UP"
              : "LOG IN"
          }</a>
      </div>
    </Box>
  </Modal>
}

export default AuthModal