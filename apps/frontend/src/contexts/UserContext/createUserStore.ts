import type { AuthProps, AuthStore } from "@contexts/AuthContext/createAuthStore";
import type { INotificationContext } from "@contexts/NotificationContext/NotificationContext";
import { createUrl } from "@utils";
import { createStore } from "zustand";

interface UserProps {
  profile?: any
}

interface UserActions {
  loadProfile: () => Promise<any>
  reset: () => void
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

    const fetchProfile = async (): Promise<any> => {
      const response = await fetch(createUrl('/user/profile'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getState().session?.accessToken}`
        }
      })
      if (!response.ok) {
        const isRefreshed = await getState().refresh()
        if (!isRefreshed) {
          throw new Error('User is not logged in anymore')
        }
        return fetchProfile()
      }
      return await response.json()
    }

    return {
      loadProfile: async () => {
        try {
          const profile = await fetchProfile()
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