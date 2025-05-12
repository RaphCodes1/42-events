"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Edit, Trash2, Tag, LogOut, Loader2 } from 'lucide-react';
import { SearchBar } from '../../components/ui/SearchBar';
import { EventModal } from '../../components/events/EventModal';
import { SortDropdown } from '../../components/events/SortDropdown';
import { CategoryFilter } from '../../components/events/CategoryFilter';
import { useScrollEffect } from '../../hooks/useScrollEffect';
import useEventsStore from '../../store/eventsStore';
import { Event } from '../../types';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { fetchEvents, insertInitialData } from '../../data/mockEvents';
import { Button } from '../../components/ui/Button';

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

function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

export default function AdminPage() {
  const { filteredEvents, searchTerm, setSearchTerm, sortOption, setSortOption, categoryFilter, setCategoryFilter, addEvent, deleteEvent } = useEventsStore();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const { scrollY } = useScrollEffect();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Add helper function to verify admin status
  const verifyAdminAccess = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Authentication required');
    }

    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData || roleData.role !== 'admin') {
      throw new Error('Admin access required');
    }

    return user;
  };

  // Force dark mode
  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

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

  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setIsCreateModalOpen(true);
  };

  const handleCreate = () => {
    setEditEvent(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateEvent = async (event: Event) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      // Verify admin access before proceeding
      await verifyAdminAccess();

      // Log the event data we're trying to insert
      console.log('Attempting to create event with data:', event);

      const eventData = {
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        category: event.category,
        created_at: event.createdAt
      };

      // Validate required fields
      if (!eventData.title || !eventData.description || !eventData.date || !eventData.location || !eventData.category) {
        throw new Error('All fields are required');
      }

      // Validate date format
      if (isNaN(new Date(eventData.date).getTime())) {
        throw new Error('Invalid date format');
      }

      // Log the formatted data we're sending to Supabase
      console.log('Sending to Supabase:', eventData);

      // Insert new event
      const { data, error: insertError } = await supabase
        .from('event_data')
        .insert(eventData)
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', {
          error: insertError,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
          message: insertError.message
        });
        throw new Error(`Failed to create event: ${insertError.message}`);
      }

      console.log('Successfully created event:', data);

      // Refresh events from database
      await fetchEvents();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      if (error instanceof Error) {
        if (error.message === 'Authentication required') {
          router.push('/login');
          return;
        }
        if (error.message === 'Admin access required') {
          router.push('/');
          return;
        }
      }
      setSaveError(error instanceof Error ? error.message : 'An error occurred while creating the event');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEvent = async (event: Event) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      // Verify admin access before proceeding
      await verifyAdminAccess();

      // Log the event data we're trying to update
      console.log('Attempting to update event with data:', event);

      const eventData = {
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        category: event.category
      };

      // Validate required fields
      if (!eventData.title || !eventData.description || !eventData.date || !eventData.location || !eventData.category) {
        throw new Error('All fields are required');
      }

      // Validate date format
      if (isNaN(new Date(eventData.date).getTime())) {
        throw new Error('Invalid date format');
      }

      // Log the formatted data we're sending to Supabase
      console.log('Sending to Supabase:', eventData);

      // Update existing event
      const { data, error: updateError } = await supabase
        .from('event_data')
        .update(eventData)
        .eq('id', event.id)
        .select()
        .single();

      if (updateError) {
        console.error('Supabase update error:', {
          error: updateError,
          code: updateError.code,
          details: updateError.details,
          hint: updateError.hint,
          message: updateError.message
        });
        throw new Error(`Failed to update event: ${updateError.message}`);
      }

      console.log('Successfully updated event:', data);

      // Refresh events from database
      await fetchEvents();
      setIsCreateModalOpen(false);
      setEditEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      if (error instanceof Error) {
        if (error.message === 'Authentication required') {
          router.push('/login');
          return;
        }
        if (error.message === 'Admin access required') {
          router.push('/');
          return;
        }
      }
      setSaveError(error instanceof Error ? error.message : 'An error occurred while updating the event');
    } finally {
      setIsSaving(false);
    }
  };

  // Replace the old handleSaveEvent with this new function
  const handleSaveEvent = async (event: Event) => {
    if (editEvent) {
      await handleUpdateEvent(event);
    } else {
      await handleCreateEvent(event);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    setIsSaving(true);
    setSaveError(null);
    try {
      // Verify admin access before proceeding
      await verifyAdminAccess();

      const { error: deleteError } = await supabase
        .from('event_data')
        .delete()
        .eq('id', deleteConfirmId);

      if (deleteError) {
        console.error('Error deleting event:', deleteError);
        throw new Error('Failed to delete event');
      }

      // Refresh events from database
      await fetchEvents();
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      if (error instanceof Error) {
        if (error.message === 'Authentication required') {
          router.push('/login');
          return;
        }
        if (error.message === 'Admin access required') {
          router.push('/');
          return;
        }
      }
      setSaveError(error instanceof Error ? error.message : 'An error occurred while deleting the event');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
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

  // Update the initial admin check to use the helper function
  React.useEffect(() => {
    const checkAdminAccess = async () => {
      setIsLoading(true);
      try {
        await verifyAdminAccess();
        // If admin access is confirmed, initialize data and fetch events
        await insertInitialData(); // Add initial data if database is empty
        await fetchEvents();
      } catch (error) {
        console.error('Error checking admin access:', error);
        if (error instanceof Error) {
          if (error.message === 'Authentication required') {
            router.push('/login');
            return;
          }
          if (error.message === 'Admin access required') {
            router.push('/');
            return;
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className={`sticky top-0 z-40 bg-gray-800 transition-shadow duration-300 ${scrollY > 10 ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              {/* <Calendar className="text-primary-400 mr-2" size={28} /> */}
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </motion.div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 max-w-md">
            <SearchBar 
              onSearch={handleSearch}
              initialValue={searchTerm}
            />
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-700 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center gap-3 justify-between border-b border-gray-700">
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
      <main className="container mx-auto px-4 pt-8 pb-16">
        {/* Results count and create button */}
        <div className="mb-0 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-200 mb-2">
            Upcoming Events
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            onClick={handleCreate}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
            aria-label="Create Event"
            disabled={isLoading}
          >
            <Plus size={28} />
          </motion.button>
        </div>
        <div className="mb-8">
          <span className="text-gray-400 text-base">
            {isLoading ? 'Loading events...' : `Showing ${displayedEvents.length} event${displayedEvents.length !== 1 ? 's' : ''}`}
          </span>
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
                <Loader2 className="text-primary-500" size={48} />
              </motion.div>
              <h3 className="text-xl font-medium text-gray-400 mb-2">Loading Events</h3>
              <p className="text-gray-500 max-w-md">
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
                <Calendar className="text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No events found</h3>
                <p className="text-gray-500 max-w-md">
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
                    className={`relative rounded-xl overflow-hidden bg-gray-800 shadow-md hover:shadow-lg transition-shadow border-[5px] ${categoryColors[event.category].split(' ')[2]}`}
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
                    <div className="p-4 bg-white flex flex-col min-h-[160px]">
                      <div className="flex items-center justify-center text-xs text-gray-600 mb-2">
                        <Calendar size={16} className="mr-0" />
                        <span className="px-2 py-1.2 whitespace-nowrap" style={{ fontSize: '12px' }}>{formatDate(event.date)}</span>
                        <span className="mx-1">•</span>
                        <span className="truncate text-xs">{event.location}</span>
                      </div>
                      <div className="flex-grow min-h-[48px]">
                        <p className="text-gray-700 line-clamp-2 px-2 py-1">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
                          <div className="flex items-center">
                            <Tag size={12} className="mr-1" />
                            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                          </div>
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(event);
                            }}
                            aria-label="Edit Event"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(event.id);
                            }}
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
          </>
        )}
      </main>

      {/* Event detail modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
        categoryColor={categoryColors[selectedEvent?.category || 'other']}
        isAdmin={true}
        onEdit={handleEdit}
        onDelete={setDeleteConfirmId}
      />

      {/* Create/Edit Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl sm:max-w-3xl md:max-w-4xl p-8 relative"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
              onClick={() => {
                setIsCreateModalOpen(false);
                setSaveError(null);
              }}
              disabled={isSaving}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">{editEvent ? 'Edit Event' : 'Create Event'}</h2>
            
            {saveError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">
                {saveError}
              </div>
            )}

            <form
              onSubmit={e => {
                e.preventDefault();
                const formData = e.target as any;
                
                try {
                  // Validate form data before submission
                  if (!formData.title.value?.trim()) {
                    throw new Error('Title is required');
                  }
                  if (!formData.description.value?.trim()) {
                    throw new Error('Description is required');
                  }
                  if (!formData.dateTime.value) {
                    throw new Error('Date and time are required');
                  }
                  if (!formData.location.value?.trim()) {
                    throw new Error('Location is required');
                  }
                  if (!formData.category.value) {
                    throw new Error('Category is required');
                  }

                  const dateTime = new Date(formData.dateTime.value);
                  if (isNaN(dateTime.getTime())) {
                    throw new Error('Invalid date format');
                  }

                  const eventData = {
                    id: editEvent ? editEvent.id : crypto.randomUUID(),
                    title: formData.title.value.trim(),
                    description: formData.description.value.trim(),
                    date: dateTime.toISOString(),
                    location: formData.location.value.trim(),
                    category: formData.category.value,
                    createdAt: editEvent ? editEvent.createdAt : new Date().toISOString(),
                  };

                  console.log('Form submission data:', eventData);
                  handleSaveEvent(eventData);
                } catch (error) {
                  console.error('Form validation error:', error);
                  setSaveError(error instanceof Error ? error.message : 'Invalid form data');
                }
              }}
              className="space-y-4"
            >
              <input 
                name="title" 
                defaultValue={editEvent?.title || ''} 
                placeholder="Title" 
                className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400" 
                required 
              />
              <textarea 
                name="description" 
                defaultValue={editEvent?.description || ''} 
                placeholder="Description" 
                className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400 min-h-[200px]" 
                required 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Date and Time
                  </label>
                  <input 
                    name="dateTime" 
                    type="datetime-local" 
                    defaultValue={editEvent ? formatDateForInput(editEvent.date) : ''} 
                    className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Location
                  </label>
                  <input 
                    name="location" 
                    defaultValue={editEvent?.location || ''} 
                    placeholder="Location" 
                    className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white placeholder-gray-400" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Category
                </label>
                <select 
                  name="category" 
                  defaultValue={editEvent?.category || 'conference'} 
                  className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-700 text-white"
                >
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setSaveError(null);
                  }}
                  disabled={isSaving}
                  className="border-gray-600 text-gray-200 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSaving}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin mr-2" size={16} />
                      {editEvent ? 'Saving Changes...' : 'Creating Event...'}
                    </div>
                  ) : (
                    editEvent ? 'Save Changes' : 'Create Event'
                  )}
                </Button>
              </div>
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
              className="bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-8 relative"
            >
              <h2 className="text-xl font-bold mb-4 text-white">Are you sure you want to delete?</h2>
              
              {saveError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">
                  {saveError}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  disabled={isSaving}
                  className="border-gray-600 text-gray-200 hover:bg-gray-700"
                >
                  No
                </Button>
                <Button
                  variant="outline"
                  onClick={confirmDelete}
                  disabled={isSaving}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Deleting...
                    </div>
                  ) : (
                    'Yes'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 