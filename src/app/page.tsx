"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Settings, Loader2 } from 'lucide-react';
import { SearchBar } from '../components/ui/SearchBar';
import { EventCard } from '../components/events/EventCard';
import { EventModal } from '../components/events/EventModal';
import { SortDropdown } from '../components/events/SortDropdown';
import { CategoryFilter } from '../components/events/CategoryFilter';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useScrollEffect } from '../hooks/useScrollEffect';
import useEventsStore from '../store/eventsStore';
import useUserStore from '../store/userStore';
import { Event } from '../types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import React from 'react';
import { fetchEvents } from '../data/mockEvents';
import Image from 'next/image';

export default function Home() {
  const { filteredEvents, searchTerm, setSearchTerm, sortOption, setSortOption, categoryFilter, setCategoryFilter } = useEventsStore();
  const { subscribedEvents } = useUserStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubscribed, setShowSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollY } = useScrollEffect();
  const router = useRouter();
  
  // Fetch events when component mounts
  React.useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await fetchEvents();
      } catch (error) {
        console.error('Error initializing events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.log('Authentication error or no user found, redirecting to login');
        router.push('/login');
        return;
      }
    };

    checkSession();
  }, [router]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (option: typeof sortOption) => {
    setSortOption(option);
  };

  const handleCategoryChange = (category: typeof categoryFilter) => {
    setCategoryFilter(category);
  };

  const toggleSubscribedFilter = () => {
    setShowSubscribed(!showSubscribed);
  };

  const displayedEvents = showSubscribed
    ? filteredEvents.filter(event => subscribedEvents.includes(event.id))
    : filteredEvents;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const categoryColors = {
    conference: 'bg-blue-100 text-blue-800 border-blue-200',
    workshop: 'bg-green-100 text-green-800 border-green-200',
    meetup: 'bg-purple-100 text-purple-800 border-purple-200',
    exhibition: 'bg-amber-100 text-amber-800 border-amber-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className={`sticky top-0 z-40 bg-gray-50 dark:bg-gray-900 transition-all duration-300 border-b border-gray-200 dark:border-gray-700 ${scrollY > 10 ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center">
          <div className="flex items-center">
            <div className="flex items-center">
              <Image
                src="/42_logo_white.png"
                alt="42 Logo"
                width={40}
                height={40}
                className="mr-2 invert dark:invert-0"
              />
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 mr-12">Calendar</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md -ml-2">
            <SearchBar 
              onSearch={handleSearch}
              initialValue={searchTerm}
            />
          </div>
          
          <div className="flex items-center space-x-2 ml-auto">
            <button
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                showSubscribed 
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={toggleSubscribedFilter}
            >
              <User size={16} />
              <span className="hidden sm:inline">My Events</span>
              {showSubscribed && subscribedEvents.length > 0 && (
                <span className="ml-1.5 bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {subscribedEvents.length}
                </span>
              )}
            </button>
            <SettingsDropdown />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-3 justify-between border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <CategoryFilter 
            currentCategory={categoryFilter}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          <SortDropdown 
            currentSort={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Results count and filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {showSubscribed ? 'My Subscribed Events' : 'Upcoming Events'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? 'Loading events...' : 
              displayedEvents.length === 0 
                ? 'No events found' 
                : `Showing ${displayedEvents.length} event${displayedEvents.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-4"
              >
                <Loader2 className="text-primary-500 dark:text-primary-400" size={48} />
              </motion.div>
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">Loading Events</h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md">
                Please wait while we fetch your events...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events grid */}
        {!isLoading && (
          <>
            {displayedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="text-gray-400 dark:text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">No events found</h3>
                <p className="text-gray-500 dark:text-gray-500 max-w-md">
                  {showSubscribed 
                    ? "You haven't subscribed to any events yet. Browse the events and subscribe to see them here."
                    : "Try adjusting your filters or search terms to find events."}
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {displayedEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={index}
                    onClick={() => handleEventClick(event)}
                  />
                ))}
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="flex items-center">
                <Image
                  src="/42_logo_white.png"
                  alt="42 Logo"
                  width={24}
                  height={24}
                  className="mr-2 invert dark:invert-0"
                />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Calendar</span>
              </div>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">
              © {new Date().getFullYear()} 42 Calendar. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      {/* Event detail modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
        categoryColor={selectedEvent ? categoryColors[selectedEvent.category] : undefined}
      />
    </div>
  );
}

function SettingsDropdown() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleAccount = () => {
    setOpen(false);
    router.push('/my-account');
  };

  const handleSignOut = async() => {
    setOpen(false);
    const { error } = await supabase.auth.signOut();
    if(error){
      throw error;
    }
    router.push('/login');
  };



  return (
    <div className="relative">
      <button
        className="flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => setOpen((v) => !v)}
      >
        <Settings size={19} className="mr-1" />
        <svg className={`ml-1 w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[180px] w-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <div className="flex items-center  px-4 py-2">
            <span className="text-sm text-gray-700 dark:text-gray-200 mr-1">Theme</span>
            <ThemeToggle />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            onClick={handleAccount}
          >
            My Account
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}