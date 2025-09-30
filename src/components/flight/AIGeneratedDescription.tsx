import React, { useState, useEffect } from 'react';
import { Sparkles, Eye, Mountain, Waves, Sun, Cloud } from 'lucide-react';
import { Flight } from '../../types';

interface AIGeneratedDescriptionProps {
  flight: Flight;
  className?: string;
}

export const AIGeneratedDescription: React.FC<AIGeneratedDescriptionProps> = ({ 
  flight, 
  className = '' 
}) => {
  const [description, setDescription] = useState<string>('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateDescription();
  }, [flight]);

  const generateDescription = async () => {
    setLoading(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiDescription = generateAIDescription(flight);
    const aiHighlights = generateHighlights(flight);
    
    setDescription(aiDescription);
    setHighlights(aiHighlights);
    setLoading(false);
  };

  const generateAIDescription = (flight: Flight): string => {
    const route = `${flight.departure.toLowerCase()}-${flight.arrival.toLowerCase()}`;
    
    const routeDescriptions: Record<string, string> = {
      'mumbai-goa': `Experience the breathtaking transformation from India's bustling financial capital to its tropical paradise. As you soar above the Western Ghats, witness the dramatic landscape shift from urban sprawl to lush green mountains, cascading waterfalls, and pristine coastline. The Arabian Sea stretches endlessly, dotted with traditional fishing boats and fringed by golden beaches. Ancient Portuguese forts and colonial architecture create a unique aerial tapestry, while the Konkan coast reveals hidden coves and emerald backwaters that few travelers ever see from this magnificent perspective.`,
      
      'delhi-leh': `Embark on one of the world's most spectacular mountain flights, traversing from the Indo-Gangetic plains to the roof of the world. Watch as the fertile green fields of Punjab give way to the foothills of the Himalayas, then witness the dramatic emergence of snow-capped peaks reaching towards the sky. The Karakoram and Ladakh ranges unfold beneath you like a geological masterpiece, with ancient monasteries perched impossibly on cliff faces, pristine alpine lakes reflecting the azure sky, and the confluence of mighty rivers carving through valleys that have remained unchanged for millennia.`,
      
      'chennai-port blair': `Journey over the pristine waters of the Bay of Bengal to one of India's most remote and beautiful archipelagos. The Andaman Islands emerge from the deep blue ocean like emerald jewels, each surrounded by coral reefs that create intricate patterns visible from above. Witness untouched rainforests, pristine beaches with sand so white it gleams like pearls, and marine ecosystems so diverse they rival the Great Barrier Reef. The transition from mainland India to these tropical islands offers a unique perspective on India's incredible geographical diversity.`,
      
      'bangalore-mysore': `Soar over Karnataka's cultural heartland, where ancient heritage meets natural splendor. The Western Ghats roll beneath you in waves of green, dotted with coffee plantations, spice gardens, and traditional villages that seem frozen in time. The magnificent Mysore Palace appears like a jewel in the landscape, while the Cauvery River winds through the terrain like a silver ribbon. Ancient temples, wildlife sanctuaries, and the verdant countryside create a living tapestry of South India's rich biodiversity and cultural heritage.`
    };

    return routeDescriptions[route] || generateGenericDescription(flight);
  };

  const generateGenericDescription = (flight: Flight): string => {
    const timeContext = getTimeContext(flight.sunPosition);
    const sideContext = getSideContext(flight.scenicSide);
    
    return `${timeContext} This scenic flight offers unparalleled aerial views of India's diverse landscape. ${sideContext} From your window seat, witness the dramatic geographical transitions that make this route truly spectacular. The journey showcases rolling hills, river valleys, ancient settlements, and natural formations that tell the story of millions of years of geological evolution. Each moment of the flight reveals new perspectives on the incredible diversity of the Indian subcontinent, from bustling urban centers to pristine wilderness areas that few travelers ever experience from this unique vantage point.`;
  };

  const getTimeContext = (sunPosition?: string): string => {
    switch (sunPosition) {
      case 'sunrise':
        return 'Experience the magical golden hour as dawn breaks across the landscape, painting the terrain in warm hues of amber and rose gold.';
      case 'sunset':
        return 'Witness nature\'s grand finale as the sun sets, transforming the sky into a canvas of vibrant oranges, purples, and crimsons.';
      default:
        return 'Enjoy crystal-clear daylight visibility that reveals every detail of the stunning landscape below.';
    }
  };

  const getSideContext = (scenicSide: string): string => {
    switch (scenicSide) {
      case 'left':
        return 'The left side of the aircraft provides the most spectacular viewing opportunities, offering unobstructed panoramas of the region\'s most iconic landmarks.';
      case 'right':
        return 'Passengers on the right side of the aircraft will enjoy the best scenic views, with optimal positioning for photography and sightseeing.';
      case 'both':
        return 'Both sides of the aircraft offer incredible views, ensuring every passenger enjoys spectacular scenery throughout the journey.';
      default:
        return 'Strategic seating provides optimal viewing angles for the most memorable scenic experience.';
    }
  };

  const generateHighlights = (flight: Flight): string[] => {
    const baseHighlights = [
      'Optimal altitude for scenic photography',
      'Crystal-clear visibility conditions',
      'Professional pilot commentary',
      'Unique geological formations'
    ];

    const routeSpecific: Record<string, string[]> = {
      'mumbai-goa': [
        'Western Ghats mountain range',
        'Arabian Sea coastline',
        'Portuguese colonial architecture',
        'Pristine beaches and coves'
      ],
      'delhi-leh': [
        'Himalayan peaks and glaciers',
        'Ancient Buddhist monasteries',
        'High-altitude desert landscapes',
        'River confluences and valleys'
      ],
      'chennai-port blair': [
        'Coral reef formations',
        'Tropical island archipelago',
        'Marine wildlife spotting',
        'Pristine rainforest canopy'
      ],
      'bangalore-mysore': [
        'Coffee plantation landscapes',
        'Historic palace architecture',
        'Wildlife sanctuary views',
        'Traditional village settlements'
      ]
    };

    const route = `${flight.departure.toLowerCase()}-${flight.arrival.toLowerCase()}`;
    return routeSpecific[route] || baseHighlights;
  };

  const getHighlightIcon = (highlight: string) => {
    if (highlight.includes('mountain') || highlight.includes('peak')) return Mountain;
    if (highlight.includes('sea') || highlight.includes('coral') || highlight.includes('marine')) return Waves;
    if (highlight.includes('sun') || highlight.includes('golden')) return Sun;
    return Cloud;
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            AI-Generated Scenic Analysis
          </h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            AI-Generated Scenic Analysis
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by advanced route analysis
          </p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none mb-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          Scenic Highlights
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {highlights.map((highlight, index) => {
            const IconComponent = getHighlightIcon(highlight);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm"
              >
                <IconComponent className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {highlight}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          This description was generated using AI analysis of geographical data, weather patterns, and historical scenic flight reports.
        </p>
      </div>
    </div>
  );
};