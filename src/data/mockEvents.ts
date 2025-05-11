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
    category: 'conference',
    createdAt: '2025-05-01T09:00:00',
  },
  {
    id: '2',
    title: 'Design Systems Workshop',
    description: 'A hands-on workshop focused on creating scalable design systems for product teams. Learn best practices, tools, and methodologies.',
    date: '2025-06-10T14:00:00',
    location: 'Design Hub, New York',
    category: 'workshop',
    createdAt: '2025-05-10T09:00:00',
  },
  {
    id: '3',
    title: 'JavaScript Developer Meetup',
    description: 'Monthly meetup for JavaScript developers to share knowledge, discuss the latest trends, and network with fellow developers.',
    date: '2025-06-05T18:00:00',
    location: 'TechSpace Austin',
    category: 'meetup',
    createdAt: '2025-05-20T09:00:00',
  },
  {
    id: '4',
    title: 'AI & Machine Learning Conference',
    description: 'Explore the latest advancements in artificial intelligence and machine learning with keynotes, panels, and networking opportunities.',
    date: '2025-06-20T09:00:00',
    location: 'Seattle Tech Campus',
    category: 'conference',
    createdAt: '2025-04-15T09:00:00',
  },
  {
    id: '6',
    title: 'DevOps Best Practices Workshop',
    description: 'Learn how to implement DevOps practices in your organization with this hands-on workshop led by industry experts.',
    date: '2025-06-12T13:00:00',
    location: 'Virtual',
    category: 'workshop',
    createdAt: '2025-05-15T09:00:00',
  },
  {
    id: '7',
    title: 'Modern Art Exhibition',
    description: 'Explore contemporary artwork from emerging artists across various media, including paintings, sculptures, and digital installations.',
    date: '2025-06-07T11:00:00',
    location: 'Metropolitan Art Gallery',
    category: 'exhibition',
    createdAt: '2025-05-22T09:00:00',
  },
  {
    id: '8',
    title: 'React Advanced Conference',
    description: 'Conference dedicated to advanced React techniques, state management, performance optimization, and ecosystem tools.',
    date: '2025-06-15T10:00:00',
    location: 'London Tech Center',
    category: 'conference',
    createdAt: '2025-04-20T09:00:00',
  },
  {
    id: '9',
    title: 'Product Management Bootcamp',
    description: 'Intensive two-day bootcamp covering product strategy, roadmapping, prioritization, and stakeholder management.',
    date: '2025-06-18T09:00:00',
    location: 'Innovation Hub, Chicago',
    category: 'workshop',
    createdAt: '2025-05-05T09:00:00',
  },
  {
    id: '10',
    title: 'Startup Networking Mixer',
    description: 'Connect with founders, investors, and startup enthusiasts in an informal setting. Perfect for making connections and finding potential collaborators.',
    date: '2025-06-03T17:00:00',
    location: 'Founders Club',
    category: 'meetup',
    createdAt: '2025-05-25T09:00:00',
  },
];