import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '../ui/Button';
import { Event } from '../../types';
import useUserStore from '../../store/userStore';

interface EventCardProps {
  event: Event;
  index: number;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, index, onClick }) => {
  const { isSubscribed, subscribe, unsubscribe } = useUserStore();
  const subscribed = isSubscribed(event.id);

  const handleSubscribeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (subscribed) {
      unsubscribe(event.id);
    } else {
      subscribe(event.id);
    }
  };

  const categoryColors = {
    conference: 'bg-blue-100 text-blue-800 border-blue-200',
    workshop: 'bg-green-100 text-green-800 border-green-200',
    meetup: 'bg-purple-100 text-purple-800 border-purple-200',
    exhibition: 'bg-amber-100 text-amber-800 border-amber-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const categoryColor = categoryColors[event.category];
  
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border-[7px] ${categoryColor.split(' ')[2]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <div className={`w-full h-20 relative overflow-hidden ${categoryColor}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-xl font-bold truncate text-center p-4">{event.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-center text-xs text-gray-600 mb-5 mt-2">
          <Calendar size={16} className="mr-0" />
          <span className="px-2 py-1.2 whitespace-nowrap">{format(parseISO(event.date), 'MMM d, yyyy')}</span>
          <span className="mx-1">•</span>
          <MapPin size={16} className="mx-1" />
          <span className="truncate text-s">{event.location}</span>
        </div>
        
        <p className="text-gray-700 line-clamp-2 mb-6 h-18 px-2 py-1.2 mt-3">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
            <div className="flex items-center">
              <Tag size={12} className="mr-1" />
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </div>
          </span>
          
          <Button
            size="sm"
            variant={subscribed ? "outline" : "primary"}
            onClick={handleSubscribeToggle}
            className={subscribed ? "border-green-600 text-green-600 hover:bg-green-50" : ""}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};