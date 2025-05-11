import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Tag, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Event } from '../../types';
import { Button } from '../ui/Button';
import useUserStore from '../../store/userStore';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  categoryColor?: string;
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  categoryColor,
  isAdmin = false,
  onEdit,
  onDelete
}) => {
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

  const handleEdit = () => {
    onEdit?.(event);
    onClose();
  };

  const handleDelete = () => {
    onDelete?.(event.id);
    onClose();
  };
  
  const categoryColors = {
    conference: 'bg-blue-100 text-blue-800 border-blue-200',
    workshop: 'bg-green-100 text-green-800 border-green-200',
    meetup: 'bg-purple-100 text-purple-800 border-purple-200',
    exhibition: 'bg-amber-100 text-amber-800 border-amber-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };

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
              className={`bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-xl md:max-w-2xl overflow-hidden relative border-[5px] ${categoryColor?.split(' ')[2]}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className={`w-full h-20 relative overflow-hidden ${categoryColor?.split(' ')[0]}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className={`text-xl font-bold truncate text-center p-4 ${categoryColor?.split(' ')[1]}`}>{event.title}</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 bg-white">
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
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="rounded-full border-2 border-gray-200 text-gray-600 hover:bg-gray-700 hover:text-white"
                  >
                    Close
                  </Button>
                  {isAdmin ? (
                    <>
                      <Button 
                        onClick={handleEdit}
                        variant="outline"
                        className="rounded-full border-2 border-blue-400 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </Button>
                      <Button 
                        onClick={handleDelete}
                        variant="outline"
                        className="rounded-full border-2 border-red-400 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={handleSubscribeToggle}
                      variant={subscribed ? "outline" : "primary"}
                      className={subscribed ? "rounded-full border-2 border-green-600 text-green-600 hover:bg-green-50" : "rounded-full border-2 bg-primary-600 hover:bg-primary-700 text-white"}
                    >
                      {subscribed ? "Unsubscribe" : "Subscribe to Event"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};