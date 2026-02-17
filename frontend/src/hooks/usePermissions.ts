//generate code for usePermissions hook in React to manage user permissions
import { useState, useEffect } from 'react';
interface UsePermissionsProps {
    userId: string;
}
interface UsePermissionsReturn {
    permissions: string[];
    hasPermission: (permission: string) => boolean;
}
function usePermissions({ userId }: UsePermissionsProps): UsePermissionsReturn {
    const [permissions, setPermissions] = useState<string[]>([]);
    useEffect(() => {
        // Simulate fetching permissions from an API
        const fetchPermissions = async () => {
            try {
                // Replace with actual API call
                const response = await fetch(`/api/users/${userId}/permissions`);
                const data = await response.json();
                setPermissions(data.permissions);
            }
            catch (error) {
                console.error('Error fetching permissions: ', error);
            }
        };
        fetchPermissions();
    }
        , [userId]);
    const hasPermission = (permission: string) => {
        return permissions.includes(permission);
    };  
    return { permissions, hasPermission };
}
export default usePermissions;