// import { create } from "zustand"
// import { persist } from "zustand/middleware"
// import type { User } from "../types"

// interface AuthStore {
//   user: User | null
//   login: (email: string, password: string) => Promise<boolean>
//   logout: () => void
//   isAuthenticated: () => boolean
// }

// export const useAuthStore = create<AuthStore>()(
//   persist(
//     (set, get) => ({
//       // get user from database

//       user: null,
      
//       login: async (email, password) => {
//         try {
//           const response = await fetch('/api/users', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password }),
//           });
          
//           if (!response.ok) {
//             throw new Error('Login failed');
//           }
          
//           const data = await response.json();
//           const user = data.user;
//           set({ user });
//           return true;
//         } catch (error) {
//           console.error('Login failed:', error);
//           return false;
//         }
//       },

//       logout: () => {
//         set({ user: null })
//       },

//       isAuthenticated: () => {
//         return get().user !== null
//       },
//     }),
//     {
//       name: "auth-storage",
//     },
//   ),
// )





import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "../types"
import { TaxStatus } from "@prisma/client"
interface AuthStore {
  user: User & {taxStatus?: TaxStatus} | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  isAuthenticated: () => boolean
  checkAuth: () => Promise<void> // Check if user is still valid
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          if (!response.ok) {
            throw new Error('Login failed');
          }
          
          const data = await response.json();
          const user = data.user;
          
          set({ user, isLoading: false });

          return user;
        } catch (error) {
          console.error('Login failed:', error);
          set({ isLoading: false });
          return null;
        }
      },

      logout: async () => {
        try {
          // Call logout endpoint to invalidate session on server
          await fetch('/api/auth/logout', {
            method: 'POST',
          });
          window.location.reload(); // Reload the page to clear the state
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          set({ user: null });
        }
      },
      isAuthenticated: () => {
        return get().user !== null;
      },

      checkAuth: async () => {

        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/me');
          
          if (response.ok) {
            const data = await response.json();
            set({ user: data.user });
          } else {
            // Token is invalid, clear everything
            set({ user: null });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist the user data, not loading states
      // partialize: (state) => ({ user: state.user }),
    },
  ),
)