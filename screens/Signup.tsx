import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            // FIX: The Supabase `signUp` function expects a single object with email and password properties.
            const { error } = await signup({ email, password });
            if (error) {
                throw error;
            }
            // On successful signup, Supabase sends a confirmation email.
            // You might want to navigate to a "Please check your email" page here.
            // For now, navigating to dashboard assumes auto-confirmation is enabled.
            alert('Signup successful! Please check your email to confirm your account.');
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <title>Sign Up - sun ai startup</title>
            <meta name="description" content="Create a new sun ai startup account." />
            <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-md mx-auto">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">Create an Account</h1>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D] sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E87C4D] focus:border-[#E87C4D] sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E87C4D] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E87C4D] disabled:bg-gray-400"
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-[#E87C4D] hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </>
    );
};

export default Signup;