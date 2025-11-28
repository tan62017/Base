import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
export * from './counter';

export const pinia = createPinia().use(piniaPluginPersistedstate);
