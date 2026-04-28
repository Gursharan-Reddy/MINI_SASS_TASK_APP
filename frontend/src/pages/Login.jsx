import { useState } from 'react';
import { login } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ email, password });
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert("Login Failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-10 bg-white shadow-2xl rounded-2xl w-96 border border-gray-100">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600 tracking-tight">Welcome Back</h2>
                
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <button className="w-full mt-6 p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                    Login
                </button>
                
                <p className="mt-6 text-center text-sm text-gray-500">
                    No account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}