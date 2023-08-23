import type { BaseSyntheticEvent } from "react"


type AuthModalFormProps = React.PropsWithChildren<{
  onSubmit: (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>
}>

const AuthModalForm: React.FC<AuthModalFormProps> = ({ children, onSubmit }) => {
  return <form className="flex flex-col gap-4" onSubmit={onSubmit}>
    {children}
  </form>
}

export default AuthModalForm