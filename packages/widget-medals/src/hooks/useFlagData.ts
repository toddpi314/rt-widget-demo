import { getFlagAssetUrl } from '../app.config';
import { useCallback } from 'react';

export const useFlagData = () => {
    const getFlagCallback = useCallback((flagKey: string) => {
        if (!flagKey) return '';
        return getFlagAssetUrl(flagKey);
    }, []);

    return { getFlagAssetUrl: getFlagCallback };
};
