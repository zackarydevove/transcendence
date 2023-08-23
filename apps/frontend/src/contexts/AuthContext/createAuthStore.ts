import type { INotificationContext } from "@contexts/NotificationContext/NotificationContext";
import { createStore } from "zustand";
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { createUrl } from "@utils";

type LoginOptions = {
  username: string; // it can be an email or a username
  password: string;
}

type RegisterOptions = {
  username: string;
  email: string;
  password: string;
}

interface AuthProps {
  modalOpen: boolean;
  isLogged: boolean;
  session?: {
    accessToken: string;
    refreshToken: string;
    oauthToken?: string;
  }
  authMode?: 'login' | 'register' | 'forgotPassword';
  authError?: {
    statusCode: number;
    message?: string;
    errors?: {
      property: string;
      messages: string[]
    }[]
  }
}

interface AuthActions {
  startAuth: (authMode: AuthProps['authMode']) => void;
  setAuthMode: (authMode: AuthProps['authMode']) => void;
  login: (options: LoginOptions) => void;
  register: (options: RegisterOptions) => void;
  logout: () => void;
  toggleModal: () => void;
  refresh: () => Promise<boolean>;
}

type AuthState = AuthProps & AuthActions;
type AuthStore = ReturnType<typeof createAuthStore>

type CreateAuthStoreOptions = {
  initialState?: Partial<AuthProps>;
  notificationContext: INotificationContext
}

const createAuthStore = (options: CreateAuthStoreOptions) => {

  const {
    initialState = {},
    notificationContext,
  } = options;

  return createStore<AuthState>((set, get) => {

    const createSession = (session: AuthProps['session']) => {
      setCookie(
        process.env.NEXT_PUBLIC_AUTH_SESSION_KEY || 'session',
        JSON.stringify(session)
      )
      set({
        session,
        isLogged: true,
      })
    }

    const deleteSession = () => {
      deleteCookie(process.env.NEXT_PUBLIC_AUTH_SESSION_KEY || 'session')
      set({
        session: undefined,
        isLogged: false,
      })
    }

    return {
      ...initialState,
      modalOpen: false,
      isLogged: initialState.session ? true : false,
      setAuthMode: (authMode) => set((state) => ({ authMode })),
      toggleModal: () => set((state) => ({
        modalOpen: !state.modalOpen,
      })),
      startAuth: (authMode) => set((state) => ({
        modalOpen: true,
        authMode,
      })),
      login: async (options) => {
        const body: Record<string, any> = {
          password: options.password
        }
        if (options.username.includes('@')) {
          body.email = options.username
        } else {
          body.username = options.username
        }

        const response = await fetch(createUrl("/auth/signin"), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })

        const data = await response.json()
        if (!response.ok) {
          notificationContext.enqueueNotification({
            message: data?.message || 'Something went wrong',
            type: 'error'
          })
        }

        if (data.accessToken && data.refreshToken) {
          createSession(data)
          notificationContext.enqueueNotification({
            message: 'You are now logged in',
            type: 'success'
          })
          get().toggleModal()
        }
      },
      register: async (options) => {
        const response = await fetch(createUrl("/auth/signup"), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(options),
        })

        const data = await response.json()

        if (response.status === 422) {
          set({
            authError: data
          })
          return
        } else if (response.status === 409) {
          notificationContext.enqueueNotification({
            message: data?.message || 'Something went wrong',
            type: 'error'
          })
        }

        if (data.accessToken && data.refreshToken) {
          createSession(data)
          notificationContext.enqueueNotification({
            message: 'You are now registered and logged in',
            type: 'success'
          })
          get().toggleModal()
        }
      },
      refresh: async () => {
        const response = await fetch(createUrl('/auth/refresh'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: get().session?.refreshToken
          })
        })
        const data = await response.json()
        if (!response.ok) {
          console.log(data)
          deleteSession()
          return false
        }
        createSession(data)
        return true
      },
      logout: async () => {
        const response = await fetch(createUrl('/auth/signout'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${get().session?.accessToken}`
          }
        })
        if (response.ok) {
          deleteSession()
          notificationContext.enqueueNotification({
            message: 'You are now logged out',
            type: 'success'
          })
        }
      }
    }
  })
}

export type {
  AuthProps,
  AuthState,
  AuthActions,
  AuthStore,
}

export default createAuthStore;