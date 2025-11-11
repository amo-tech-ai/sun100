import React from 'react';
import { Link } from 'react-router-dom';

const Blogs: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md prose max-w-4xl mx-auto">
            <h1>Sun AI Blog</h1>
            <p>This is a placeholder page for the community blog and articles.</p>
            <ul>
                <li><Link to="/blogs/1">Blog Detail Page (Example)</Link></li>
            </ul>
        </div>
    );
};

export default Blogs;
