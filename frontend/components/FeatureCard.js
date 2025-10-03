// components/FeatureCard.js
import { memo } from 'react';

const FeatureCard = memo(({ icon, title, description }) => {
  return (
    <div className="relative flex flex-col items-center text-center p-6 rounded-xl 
                    bg-white/10 backdrop-blur-md shadow-lg hover:scale-105 transition-transform cursor-pointer">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white/20">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-orange-400">{title}</h3>
      <p className="text-gray-100 opacity-90">{description}</p>
    </div>
  );
});

export default FeatureCard;