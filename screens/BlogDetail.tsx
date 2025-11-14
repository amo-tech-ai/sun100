import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogDetail: React.FC = () => {
    const { id } = useParams();
    return (
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-md prose prose-lg mx-auto">
            <Link to="/blogs" className="text-[#E87C4D] no-underline hover:underline">&larr; Back to all posts</Link>
            <h1 className="mt-4">5 Mistakes to Avoid in Your Investor Pitch Deck</h1>
            <p className="text-base text-gray-500">By Alex Chen on August 1, 2024</p>
            
            <p>This is placeholder content for blog post #{id}.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
            <h2>The First Mistake: A Weak Opening</h2>
            <p>Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue.</p>
        </div>
    );
};

export default BlogDetail;