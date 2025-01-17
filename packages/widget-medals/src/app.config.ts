// Default values for configuration
const DEFAULT_MEDALS_ENDPOINT = '/assets/medals.json';
const DEFAULT_FLAGS_BASE_URL = '/assets/flags';

// Safe environment variable access
const getEnvVar = (key: string, defaultValue: string): string => {
    try {
        return (process.env as any)[key] || defaultValue;
    } catch {
        return defaultValue;
    }
};

// Configuration values that can be overridden via environment variables
export const medalsDataEndpoint: string = getEnvVar('MEDALS_DATA_ENDPOINT', DEFAULT_MEDALS_ENDPOINT);

// Base URL for flag assets can be configured
const flagAssetsBaseUrl: string = getEnvVar('FLAG_ASSETS_BASE_URL', DEFAULT_FLAGS_BASE_URL);
export const getFlagAssetUrl = (flagKey: string): string => `${flagAssetsBaseUrl}/${flagKey}.png`;