import { useContext } from 'react';
import { AuthContext } from '../src/contexts/AuthContext'; // ✅ Fixed: Contexts moved to src/contexts/

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
