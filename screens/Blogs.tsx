import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const categories = ['All', 'AI Trends', 'Startup Growth', 'Pitching', 'Product Development'];

const mockPosts = [
    { id: 1, title: "5 Mistakes to Avoid in Your Investor Pitch Deck", excerpt: "We've seen thousands of decks. Here are the most common unforced errors that founders make when pitching VCs.", author: "Alex Chen", date: "August 1, 2024", category: 'Pitching' },
    { id: 2, title: "How AI is Changing Venture Capital Due Diligence", excerpt: "Explore how generative AI and large language models are transforming the way investors analyze startups.", author: "Samantha Rao", date: "July 22, 2024", category: 'AI Trends' },
    { id: 3, title: "Designing a Brand Identity that Lasts", excerpt: "Your brand is more than a logo. A deep dive into creating a cohesive brand that resonates with your customers.", author: "David Kim", date: "July 15, 2024", category: 'Startup Growth' },
    { id: 4, title: "Shipping Your MVP: A Founder's Guide", excerpt: "A step-by-step guide to launching your Minimum Viable Product and gathering crucial user feedback.", author: "Samantha Rao", date: "July 5, 2024", category: 'Product Development' },
];

const BlogPostCard: React.FC<typeof mockPosts[0]> = ({ id, title, excerpt, author, date }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 flex-grow mb-4">{excerpt}</p>
        <div className="text-sm text-gray-500 mb-4">{author} &bull; {date}</div>
        <Link to={`/blogs/${id}`} className="font-semibold text-[#E87C4D] hover:underline self-start">
            Read More &rarr;
        </Link>
    </div>
);

const Blogs: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredPosts = selectedCategory === 'All'
        ? mockPosts
        : mockPosts.filter(post => post.category === selectedCategory);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">From the Blog</h1>
                <p className="text-xl text-gray-600 mt-4">Insights on startups, AI, and presentation design from the sun ai startup team.</p>
            </div>

            <div className="flex justify-center flex-wrap gap-2 mb-8">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                            selectedCategory === category
                                ? 'bg-brand-orange text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                        aria-pressed={selectedCategory === category}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredPosts.map(post => (
                        <BlogPostCard key={post.id} {...post} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">No Posts Found</h3>
                    <p className="text-gray-600 mt-2">There are no blog posts in the "{selectedCategory}" category yet.</p>
                </div>
            )}
        </div>
    );
};

export default Blogs;