/* Portable custom build: do not install upstream auto-updates over our changes. */
export function autoUpdateEnabled(): boolean {
  return false;
}
export function setAutoUpdateEnabled(_enabled: boolean): void {
  /* Deliberately disabled for standalone build. */
}
