import { writable } from 'svelte/store';

export const modal = writable({callback: null, active: false, message: "", cancel: false, ok: true});
export const compose = writable(false);
export const loading = writable(true);
export const minimize = writable(false);