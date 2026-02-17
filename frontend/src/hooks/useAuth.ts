//generate code for useAuth hook in React to manage user authentication state
import { useState, useEffect } from 'react';
interface UseAuthProps {
    apiEndpoint: string;
}
interface UseAuthReturn {
    user: any;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}
function useAuth({ apiEndpoint }: UseAuthProps): UseAuthReturn {
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);
    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(`${apiEndpoint}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },  
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            setUser(data.user);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('authToken', data.token);
        } catch (error) {
            console.error('Error during login: ', error);
            throw error;
        }
    };
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };  
    return { user, isAuthenticated, login, logout };
}
export default useAuth;