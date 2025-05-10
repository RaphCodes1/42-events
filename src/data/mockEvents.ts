import { Event } from '../types';
import { format } from 'date-fns';

// Helper to create dates relative to today
const getRelativeDate = (dayOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit',
    description: 'Join industry leaders to explore the future of technology and innovation. Network with professionals, attend keynotes, and participate in hands-on workshops.',
    date: '2025-06-01T10:00:00',
    location: 'San Francisco Convention Center',
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'conference',
    createdAt: '2025-05-01T09:00:00',
  },
  {
    id: '2',
    title: 'Design Systems Workshop',
    description: 'A hands-on workshop focused on creating scalable design systems for product teams. Learn best practices, tools, and methodologies.',
    date: '2025-06-10T14:00:00',
    location: 'Design Hub, New York',
    imageUrl: 'https://images.pexels.com/photos/7256897/pexels-photo-7256897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'workshop',
    createdAt: '2025-05-10T09:00:00',
  },
  {
    id: '3',
    title: 'JavaScript Developer Meetup',
    description: 'Monthly meetup for JavaScript developers to share knowledge, discuss the latest trends, and network with fellow developers.',
    date: '2025-06-05T18:00:00',
    location: 'TechSpace Austin',
    imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'meetup',
    createdAt: '2025-05-20T09:00:00',
  },
  {
    id: '4',
    title: 'AI & Machine Learning Conference',
    description: 'Explore the latest advancements in artificial intelligence and machine learning with keynotes, panels, and networking opportunities.',
    date: '2025-06-20T09:00:00',
    location: 'Seattle Tech Campus',
    imageUrl: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'conference',
    createdAt: '2025-04-15T09:00:00',
  },
  {
    id: '6',
    title: 'DevOps Best Practices Workshop',
    description: 'Learn how to implement DevOps practices in your organization with this hands-on workshop led by industry experts.',
    date: '2025-06-12T13:00:00',
    location: 'Virtual',
    imageUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'workshop',
    createdAt: '2025-05-15T09:00:00',
  },
  {
    id: '7',
    title: 'Modern Art Exhibition',
    description: 'Explore contemporary artwork from emerging artists across various media, including paintings, sculptures, and digital installations.',
    date: '2025-06-07T11:00:00',
    location: 'Metropolitan Art Gallery',
    imageUrl: 'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'exhibition',
    createdAt: '2025-05-22T09:00:00',
  },
  {
    id: '8',
    title: 'React Advanced Conference',
    description: 'Conference dedicated to advanced React techniques, state management, performance optimization, and ecosystem tools.',
    date: '2025-06-15T10:00:00',
    location: 'London Tech Center',
    imageUrl: 'https://images.pexels.com/photos/7147434/pexels-photo-7147434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'conference',
    createdAt: '2025-04-20T09:00:00',
  },
  {
    id: '9',
    title: 'Product Management Bootcamp',
    description: 'Intensive two-day bootcamp covering product strategy, roadmapping, prioritization, and stakeholder management.',
    date: '2025-06-18T09:00:00',
    location: 'Innovation Hub, Chicago',
    imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'workshop',
    createdAt: '2025-05-05T09:00:00',
  },
  {
    id: '10',
    title: 'Startup Networking Mixer',
    description: 'Connect with founders, investors, and startup enthusiasts in an informal setting. Perfect for making connections and finding potential collaborators.',
    date: '2025-06-03T17:00:00',
    location: 'Founders Club',
    imageUrl: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'meetup',
    createdAt: '2025-05-25T09:00:00',
  },
];