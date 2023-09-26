import type { AuthProps, AuthStore } from "@contexts/AuthContext/createAuthStore";
import type { INotificationContext } from "@contexts/NotificationContext/NotificationContext";
import { createUrl } from "@utils";
import { createStore } from "zustand";

interface UserProps {
  profile?: {
    [key: string]: any
    twoFactorEnabled: boolean
  }
}

interface UserActions {
  loadProfile: () => Promise<any>
  reset: () => void
  toggleTwoFactor: () => void
}

type UserState = UserProps & UserActions;
type UserStore = ReturnType<typeof createUserStore>

type CreateUserStoreOptions = {
  initialState?: Partial<UserProps>;
  notificationContext: INotificationContext
  authStore: AuthStore
}

const createUserStore = (options: CreateUserStoreOptions) => {

  const {
    initialState = {},
    notificationContext,
  } = options;

  const { getState, setState } = options.authStore

  return createStore<UserState>((set, get) => {

    const safeUserRequest = async (
      url: string,
      method: 'GET' | 'PATCH' | 'POST'
    ): Promise<any> => {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${getState().session?.accessToken}`
        }
      })
      if (!response.ok) {
        const isRefreshed = await getState().refresh()
        if (!isRefreshed) {
          throw new Error('User is not logged in anymore')
        }
        return safeUserRequest(url, method)
      }
      return await response.json()
    }


    return {
      loadProfile: async () => {
        try {
          const profile = await safeUserRequest(createUrl('/user/profile'), 'GET')
          set({
            profile,
          })
        } catch (e) {
          notificationContext.enqueueNotification({
            type: 'warning',
            message: (e as Error).message
          })
        }
      },
      reset: () => {
        set({
          profile: undefined,
        })
      },
      toggleTwoFactor: async () => {
        const twoFactor = await safeUserRequest(createUrl('/user/2fa'), 'PATCH')

        console.log(twoFactor)

        if (twoFactor.message) {
          notificationContext.enqueueNotification({
            type: 'success',
            message: twoFactor.message
          })
          set({
            profile: {
              ...get().profile,
              twoFactorEnabled: twoFactor.twoFactorEnabled
            }
          })
        }

      }
    }
  })
}

export type {
  UserStore,
  UserState,
  UserProps,
  UserActions,
}

export default createUserStore;