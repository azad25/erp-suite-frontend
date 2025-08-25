import { useState, useEffect } from 'react';

// Define the types
interface AppItem {
    name: string;
    icon: React.ReactNode;
    path: string;
    color?: string; // Add optional color to match AppDrawer
}

interface AppUsageData {
    count: number;
    lastVisited: number;
}

interface AppUsage {
    [key: string]: AppUsageData;
}

interface UseFrequentlyVisitedReturn {
    frequentlyVisited: AppItem[];
    trackAppUsage: (appPath: string) => void;
    resetUsage: () => void;
}

const STORAGE_KEY = 'erpAppUsage';

export const useFrequentlyVisited = (appItems: AppItem[]): UseFrequentlyVisitedReturn => {
    const [appUsage, setAppUsage] = useState<AppUsage>(() => {
        // Synchronously load from localStorage on initial render
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading app usage data:', error);
            return {};
        }
    });

    // Initialize frequentlyVisited based on appUsage
    const [frequentlyVisited, setFrequentlyVisited] = useState<AppItem[]>(() => {
        const sortedApps = Object.entries(appUsage)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 4) // Show top 4 most visited
            .map(([path]) => appItems.find((app) => app.path === path))
            .filter((app): app is AppItem => app !== undefined); // Type guard
        return sortedApps;
    });

    // Save to localStorage when appUsage changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(appUsage));
        } catch (error) {
            console.error('Error saving app usage data:', error);
        }
    }, [appUsage]);

    // Update frequentlyVisited when appUsage or appItems change
    useEffect(() => {
        const sortedApps = Object.entries(appUsage)
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 4) // Show top 4 most visited
            .map(([path]) => appItems.find((app) => app.path === path))
            .filter((app): app is AppItem => app !== undefined); // Type guard

        setFrequentlyVisited(sortedApps);
        console.log('Updated frequentlyVisited:', sortedApps); // Debugging
    }, [appUsage, appItems]);

    // Track app usage
    const trackAppUsage = (appPath: string): void => {
        setAppUsage((prev) => ({
            ...prev,
            [appPath]: {
                count: (prev[appPath]?.count || 0) + 1,
                lastVisited: Date.now(),
            },
        }));
        console.log('Tracked app usage:', appPath); // Debugging
    };

    // Reset usage data
    const resetUsage = (): void => {
        setAppUsage({});
        setFrequentlyVisited([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
            console.log('Reset app usage data'); // Debugging
        } catch (error) {
            console.error('Error removing app usage data:', error);
        }
    };

    return { frequentlyVisited, trackAppUsage, resetUsage };
};