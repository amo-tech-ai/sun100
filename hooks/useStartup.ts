
import { useContext } from 'react';
import { StartupContext } from '../contexts/StartupContext';

export const useStartup = () => {
    const context = useContext(StartupContext);
    if (context === undefined) {
        throw new Error('useStartup must be used within a StartupProvider');
    }
    return context;
};
