import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Event } from '../../types';
import { Button } from '../ui/Button';
import useUserStore from '../../store/userStore';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const { isSubscribed, subscribe, unsubscribe } = useUserStore();
  
  if (!event) return null;
  
  const subscribed = isSubscribed(event.id);
  
  const handleSubscribeToggle = () => {
    if (subscribed) {
      unsubscribe(event.id);
    } else {
      subscribe(event.id);
    }
  };
  
  const categoryColors = {
    conference: 'bg-blue-100 text-blue-800',
    workshop: 'bg-green-100 text-green-800',
    meetup: 'bg-purple-100 text-purple-800',
    concert: 'bg-pink-100 text-pink-800',
    exhibition: 'bg-amber-100 text-amber-800',
    other: 'bg-gray-100 text-gray-800',
  };

  const categoryColor = categoryColors[event.category];
  const eventDate = parseISO(event.date);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-xl md:max-w-2xl overflow-hidden relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h2 className="text-white text-2xl sm:text-3xl font-bold">{event.title}</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <Calendar size={18} className="mr-2 text-primary-600" />
                    <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock size={18} className="mr-2 text-primary-600" />
                    <span>{format(eventDate, 'h:mm a')}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-700">
                    <MapPin size={18} className="mr-2 text-primary-600" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}>
                    <Tag size={14} className="mr-1.5" />
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                </div>
                
                <div className="prose prose-sm sm:prose max-w-none mb-6">
                  <p className="text-gray-700">{event.description}</p>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button 
                    onClick={handleSubscribeToggle}
                    variant={subscribed ? "outline" : "primary"}
                    className={subscribed ? "border-green-600 text-green-600 hover:bg-green-50" : ""}
                  >
                    {subscribed ? "Unsubscribe" : "Subscribe to Event"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};