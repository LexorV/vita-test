import { defineStore } from 'pinia';
import type { User } from 'src/types/types';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
  }),

  getters: {
    hasCurrentUser: (state) => !!state.currentUser,
  },

  actions: {
    setCurrentUser(user: User | null) {
      this.currentUser = user;
    },
    clearCurrentUser() {
      this.currentUser = null;
    },
  },
});

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
// }
