import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBF8F5] text-center p-4">
      <h1 className="text-8xl font-bold text-[#E87C4D]">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or maybe it never existed.
      </p>
      <Link
        to="/"
        className="inline-block bg-[#E87C4D] text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors duration-200 shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;