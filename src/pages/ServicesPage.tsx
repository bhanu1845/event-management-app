import React from 'react';

/**
 * Event Services Page:
 * This is a placeholder component. Later, you will replace this with
 * the actual layout for displaying all your event categories and vendors.
 */
const ServicesPage: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-6 text-primary">
        Explore Our Event Services
      </h1>
      
      {/* Placeholder Content */}
      <p className="text-lg text-muted-foreground mb-4">
        Discover top vendors for all your event needs, including Photography, Catering, and Decor.
      </p>

      {/* A simple list to fill space */}
      <ul className="list-disc list-inside space-y-2 ml-4">
        <li>Weddings (Pelli Sambharalu)</li>
        <li>Corporate Events (Karyakramalu)</li>
        <li>Birthday Parties (Puttinaroju)</li>
        <li>Photography & Videography</li>
        <li>Catering & Food Services</li>
      </ul>

    </div>
  );
};

// 🛑 Ee line chala mukhyam 🛑
// App.tsx lo 'import ServicesPage from...' dwara access cheyadaniki idhi kaavali.
export default ServicesPage;