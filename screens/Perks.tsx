import React from 'react';
import { Link } from 'react-router-dom';

const Perks: React.FC = () => {
    return (
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md prose max-w-4xl mx-auto">
            <h1>Community Perks</h1>
            <p>This is a placeholder page for listing available perks for members of the Sun AI community.</p>
            <ul>
                <li><Link to="/perks/1">Perk Detail Page (Example)</Link></li>
            </ul>
        </div>
    );
};

export default Perks;
