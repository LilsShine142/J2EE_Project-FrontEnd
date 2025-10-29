import React from 'react';

interface HeroSectionProps {
  title: string;
  breadcrumbs: { label: string; href?: string; active?: boolean }[];
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  breadcrumbs,
  backgroundImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80'
}) => {
  return (
    <div className="relative h-64 bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-40">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-serif font-bold text-white mb-4">{title}</h1>
        
        {/* Breadcrumbs */}
        <div className="flex items-center justify-center gap-2 text-gray-300">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.href && !crumb.active ? (
                <a href={crumb.href} className="hover:text-amber-500 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className={crumb.active ? 'text-amber-500' : ''}>
                  {crumb.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && <span>›</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;