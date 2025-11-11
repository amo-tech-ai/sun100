import React from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail: React.FC = () => {
    const { id } = useParams();
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md prose max-w-4xl mx-auto">
            <h1>Blog Post: {id}</h1>
            <p>This is a placeholder page for a single blog post. Content to be added soon.</p>
        </div>
    );
};

export default BlogDetail;
