import { getFlagAssetUrl } from '../app.config';
import { useCallback, useMemo } from 'react';

export const useFlagData = () => {
    const flagCache = useMemo(() => new Map<string, string>(), []);

    const getFlagCallback = useCallback((flagKey: string) => {
        if (!flagKey) return '';
        
        if (flagCache.has(flagKey)) {
            return flagCache.get(flagKey)!;
        }

        const url = getFlagAssetUrl(flagKey);
        flagCache.set(flagKey, url);
        return url;
    }, [flagCache]);

    return { getFlagAssetUrl: getFlagCallback };
};
