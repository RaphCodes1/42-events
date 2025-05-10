"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Edit, Trash2, Settings, Tag } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';
import { EventModal } from '../../components/events/EventModal';
import { SortDropdown } from '../../components/events/SortDropdown';
import { CategoryFilter } from '../../components/events/CategoryFilter';
import { useScrollEffect } from '../../hooks/useScrollEffect';
import useEventsStore from '../../store/eventsStore';
import { Event } from '../../types';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export default function AdminPage() {
  const { filteredEvents, searchTerm, setSearchTerm, sortOption, setSortOption, categoryFilter, setCategoryFilter, addEvent, deleteEvent } = useEventsStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const { scrollY } = useScrollEffect();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditEvent(null);
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

  const handleDelete = (eventId: string) => {
    setDeleteConfirmId(eventId);
  };

  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setIsCreateModalOpen(true);
  };

  const handleCreate = () => {
    setEditEvent(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveEvent = (event: Event) => {
    addEvent(event);
    setIsCreateModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteEvent(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const displayedEvents = filteredEvents;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className={`sticky top-0 z-40 bg-white dark:bg-gray-800 transition-shadow duration-300 ${scrollY > 10 ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Calendar className="text-primary-600 dark:text-primary-400 mr-2" size={28} />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            </motion.div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 max-w-md">
            <SearchBar 
              onSearch={handleSearch}
              initialValue={searchTerm}
            />
            <SettingsDropdown />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-3 justify-between border-b border-gray-200 dark:border-gray-700">
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
      <main className="container mx-auto px-4 pt-8 pb-0">
        {/* Results count and create button */}
        <div className="mb-0 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Upcoming Events
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            onClick={handleCreate}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
            aria-label="Create Event"
          >
            <Plus size={28} />
          </motion.button>
        </div>
        <div className="mb-8">
          <span className="text-gray-600 dark:text-gray-400 text-base">
            Showing {displayedEvents.length} event{displayedEvents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Events grid */}
        {displayedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="text-gray-400 dark:text-gray-600 mb-4" size={48} />
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">No events found</h3>
            <p className="text-gray-500 dark:text-gray-500 max-w-md">
              Try adjusting your filters or search terms to find events.
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
              <motion.div
                key={event.id}
                className={`relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow border-[5px] ${categoryColors[event.category].split(' ')[2]}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => handleEventClick(event)}
              >
                <div className={`w-full h-20 relative overflow-hidden ${categoryColors[event.category].split(' ')[0]}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className={`text-xl font-bold truncate text-center p-4 ${categoryColors[event.category].split(' ')[1]}`}>{event.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-center text-xs text-gray-600 mb-2">
                    <Calendar size={16} className="mr-0" />
                    <span className="px-2 py-1.2 whitespace-nowrap" style={{ fontSize: '12px' }}>{formatDate(event.date)}</span>
                    <span className="mx-1">•</span>
                    <span className="truncate text-xs">{event.location}</span>
                  </div>
                  <p className="text-gray-700 line-clamp-2 mb-4 h-18 px-2 py-1.2 mt-3">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
                      <div className="flex items-center">
                        <Tag size={12} className="mr-1" />
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </div>
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        onClick={() => handleEdit(event)}
                        aria-label="Edit Event"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        onClick={() => handleDelete(event.id)}
                        aria-label="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Event detail modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
        categoryColor={categoryColors[selectedEvent?.category || 'other']}
      />
      {/* Create/Edit Event Modal (mock) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-8 relative"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={() => setIsCreateModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editEvent ? 'Edit Event' : 'Create Event'}</h2>
            {/* Mock form fields */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveEvent({
                  id: editEvent ? editEvent.id : Math.random().toString(),
                  title: (e.target as any).title.value,
                  description: (e.target as any).description.value,
                  date: (e.target as any).date.value,
                  location: (e.target as any).location.value,
                  imageUrl: (e.target as any).imageUrl.value,
                  category: (e.target as any).category.value,
                  createdAt: new Date().toISOString(),
                });
              }}
              className="space-y-4"
            >
              <input name="title" defaultValue={editEvent?.title || ''} placeholder="Title" className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
              <textarea name="description" defaultValue={editEvent?.description || ''} placeholder="Description" className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
              <input name="date" type="date" defaultValue={editEvent?.date?.slice(0,10) || ''} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
              <input name="location" defaultValue={editEvent?.location || ''} placeholder="Location" className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
              <input name="imageUrl" defaultValue={editEvent?.imageUrl || ''} placeholder="Image URL" className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" required />
              <select name="category" defaultValue={editEvent?.category || 'conference'} className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="meetup">Meetup</option>
                <option value="exhibition">Exhibition</option>
                <option value="other">Other</option>
              </select>
              <button type="submit" className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md transition-colors">
                {editEvent ? 'Save Changes' : 'Create Event'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-sm p-8 relative"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Are you sure you want to delete?</h2>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onClick={cancelDelete}
                >
                  No
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                  onClick={confirmDelete}
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

  const handleSignOut = () => {
    setOpen(false);
    alert('Signed out (mock)!');
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