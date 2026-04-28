import { useEffect, useState, useCallback } from 'react';
import { fetchTasks, createTask, toggleTask, deleteTask } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    const loadTasks = useCallback(async () => {
        try {
            const { data } = await fetchTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to load tasks:", error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    }, [navigate]);

    useEffect(() => {
        const initDashboard = async () => {
            await loadTasks();
        };
        
        initDashboard();
    }, [loadTasks]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            await createTask({ title });
            setTitle('');
            await loadTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleToggle = async (id) => {
        try {
            await toggleTask(id);
            await loadTasks();
        } catch (error) {
            console.error("Toggle failed:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(id);
                await loadTasks();
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Task Dashboard</h1>
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Add Task Form */}
                <form onSubmit={handleAdd} className="flex gap-2 mb-8">
                    <input 
                        className="flex-1 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Add a new task..."
                    />
                    <button 
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
                    >
                        Add
                    </button>
                </form>

                {/* Task List */}
                <div className="space-y-3">
                    {tasks.length === 0 ? (
                        <p className="text-center text-gray-400 py-10">No tasks found. Start by adding one above!</p>
                    ) : (
                        tasks.map((task) => (
                            <div 
                                key={task.id} 
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition group"
                            >
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 cursor-pointer accent-blue-600"
                                        checked={task.status === 'Completed'} 
                                        onChange={() => handleToggle(task.id)}
                                    />
                                    <span 
                                        className={`text-lg transition ${
                                            task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-700 font-medium'
                                        }`}
                                    >
                                        {task.title}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => handleDelete(task.id)} 
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition p-1"
                                    title="Delete Task"
                                >
                                    <span className="text-xl">🗑️</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}