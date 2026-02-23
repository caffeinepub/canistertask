/**
 * Feature flags configuration
 * 
 * TEST_MODE_ENABLED: Controls visibility of test mode features
 * - Set to `true` to enable test mode UI (FREE TEST buttons, test stats)
 * - Set to `false` before production deployment to remove all test mode elements
 * 
 * Can be overridden via environment variable: VITE_TEST_MODE
 */
export const TEST_MODE_ENABLED = import.meta.env.VITE_TEST_MODE === 'false' ? false : true;
