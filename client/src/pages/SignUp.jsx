import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            setError(false);
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setLoading(false);
            if (data.success === false) {
                setError(true);
                console.error('Signup failed:', data.message);
                return;
            }
            navigate('/sign-in');
        } catch (error) {
            setLoading(false);
            setError(true);
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="mx-auto p-3 max-w-lg">
            <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="bg-slate-200 p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="bg-slate-200 p-3 rounded-lg"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="bg-slate-200 p-3 rounded-lg"
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
                    type="submit"
                >
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                <OAuth/>
            </form>
            <div className="flex mt-5 gap-2">
                <p>Have an account?</p>
                <Link to="/sign-in">
                    <span className="text-blue-500">Sign In</span>
                </Link>
            </div>
            <p className="text-red-700 mt-5">{error && 'Something went wrong'}</p>
        </div>
    );
}
