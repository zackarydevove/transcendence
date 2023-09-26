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
  twoFactorModal?: boolean;
  twoFactorUserId?: string;
  twoFactorRetryCredentials?: LoginOptions;
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
  startOAuth: (provider: '42') => void;
  completeTwoFactor: (code: string) => void;
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
      setAuthMode: (authMode) => set(() => ({ authMode })),
      toggleModal: () => set((state) => ({
        modalOpen: !state.modalOpen,
        twoFactorModal: false,
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

        if (data.message && data.userId) {
          notificationContext.enqueueNotification({
            message: 'Please enter the code sent to your email',
            type: 'info'
          })
          set({
            twoFactorModal: true,
            twoFactorUserId: data.userId,
            twoFactorRetryCredentials: options,
          })
          return
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
      },
      startOAuth: async (provider) => {

        const redirectUriResponse = await fetch(createUrl('/42/oauth'))
        if (!redirectUriResponse.ok) {
          notificationContext.enqueueNotification({
            message: 'Could not start OAuth process',
            type: 'error'
          })
          return
        }

        const { url } = await redirectUriResponse.json()

        const popup = window.open(url, 'popup', 'popup=true,width=500,height=500')

        // add event on popup when url change

        const timer = setInterval(async () => {
          try {
            if (popup?.closed || !popup?.location.href) {
              clearInterval(timer)
              notificationContext.enqueueNotification({
                message: 'Could not complete OAuth process',
                type: 'error'
              })
              return
            }

            const popupUrl = new URL(popup.location.href)
            const appUrl = new URL(window.location.href)
            if (popupUrl.origin !== appUrl.origin) {
              return
            }

            const accessToken = popupUrl.searchParams.get('accessToken')
            const refreshToken = popupUrl.searchParams.get('refreshToken')
            const oauthToken = popupUrl.searchParams.get('oauthToken')
            const error = popupUrl.searchParams.get('error')

            if (!accessToken || !refreshToken || !oauthToken || error) {
              notificationContext.enqueueNotification({
                message: 'Something went wrong during OAuth process',
                type: 'error'
              })
              clearInterval(timer)
              popup.close()
              return
            }

            createSession({
              accessToken,
              refreshToken,
              oauthToken,
            })
            notificationContext.enqueueNotification({
              message: 'You are now logged in with 42',
              type: 'success'
            })
            get().toggleModal()
            clearInterval(timer)
            popup.close()
          } catch (e) {
            console.error(e)
            notificationContext.enqueueNotification({
              message: 'Something went wrong during OAuth process',
              type: 'error'
            })
            clearInterval(timer)
            popup?.close()
          }
        }, 400)

        if (popup?.focus) {
          popup.focus()
        }
      },
      completeTwoFactor: async (code) => {
        const response = await fetch(createUrl('/auth/2fa/callback'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: get().twoFactorUserId,
            secretCode: code,
          })
        })
        const data = await response.json()

        if (!response.ok) {
          notificationContext.enqueueNotification({
            message: 'Something went wrong during 2FA process, please try again',
            type: 'error'
          })
          return
        }

        if (data.accessToken && data.refreshToken) {
          createSession(data)
          notificationContext.enqueueNotification({
            message: 'You are now registered and logged in',
            type: 'success'
          })
          get().toggleModal()
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