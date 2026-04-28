import { useState } from 'react';
import { signup } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup({ email, password });
            alert("Account created! Redirecting to login...");
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert("Signup failed. Use a different email.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-2xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Register</h2>
                <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="w-full p-2 mb-6 border rounded" onChange={e => setPassword(e.target.value)} required />
                <button className="w-full p-2 text-white bg-green-600 rounded font-bold">Sign Up</button>
                <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
            </form>
        </div>
    );
}