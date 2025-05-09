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
    date: getRelativeDate(14),
    location: 'San Francisco Convention Center',
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'conference',
    createdAt: getRelativeDate(-30),
  },
  {
    id: '2',
    title: 'Design Systems Workshop',
    description: 'A hands-on workshop focused on creating scalable design systems for product teams. Learn best practices, tools, and methodologies.',
    date: getRelativeDate(7),
    location: 'Design Hub, New York',
    imageUrl: 'https://images.pexels.com/photos/7256897/pexels-photo-7256897.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'workshop',
    createdAt: getRelativeDate(-15),
  },
  {
    id: '3',
    title: 'JavaScript Developer Meetup',
    description: 'Monthly meetup for JavaScript developers to share knowledge, discuss the latest trends, and network with fellow developers.',
    date: getRelativeDate(3),
    location: 'TechSpace Austin',
    imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'meetup',
    createdAt: getRelativeDate(-7),
  },
  {
    id: '4',
    title: 'AI & Machine Learning Conference',
    description: 'Explore the latest advancements in artificial intelligence and machine learning with keynotes, panels, and networking opportunities.',
    date: getRelativeDate(21),
    location: 'Seattle Tech Campus',
    imageUrl: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'conference',
    createdAt: getRelativeDate(-45),
  },
  {
    id: '5',
    title: 'Summer Music Festival',
    description: 'Annual outdoor music festival featuring top artists across multiple genres. Food, drinks, and entertainment all weekend long.',
    date: getRelativeDate(45),
    location: 'Riverside Park',
    imageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'concert',
    createdAt: getRelativeDate(-60),
  },
  {
    id: '6',
    title: 'DevOps Best Practices Workshop',
    description: 'Learn how to implement DevOps practices in your organization with this hands-on workshop led by industry experts.',
    date: getRelativeDate(10),
    location: 'Virtual',
    imageUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'workshop',
    createdAt: getRelativeDate(-20),
  },
  {
    id: '7',
    title: 'Modern Art Exhibition',
    description: 'Explore contemporary artwork from emerging artists across various media, including paintings, sculptures, and digital installations.',
    date: getRelativeDate(5),
    location: 'Metropolitan Art Gallery',
    imageUrl: 'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'exhibition',
    createdAt: getRelativeDate(-10),
  },
  {
    id: '8',
    title: 'React Advanced Conference',
    description: 'Conference dedicated to advanced React techniques, state management, performance optimization, and ecosystem tools.',
    date: getRelativeDate(30),
    location: 'London Tech Center',
    imageUrl: 'https://images.pexels.com/photos/7147434/pexels-photo-7147434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'conference',
    createdAt: getRelativeDate(-50),
  },
  {
    id: '9',
    title: 'Product Management Bootcamp',
    description: 'Intensive two-day bootcamp covering product strategy, roadmapping, prioritization, and stakeholder management.',
    date: getRelativeDate(15),
    location: 'Innovation Hub, Chicago',
    imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'workshop',
    createdAt: getRelativeDate(-25),
  },
  {
    id: '10',
    title: 'Startup Networking Mixer',
    description: 'Connect with founders, investors, and startup enthusiasts in an informal setting. Perfect for making connections and finding potential collaborators.',
    date: getRelativeDate(2),
    location: 'Founders Club',
    imageUrl: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'meetup',
    createdAt: getRelativeDate(-5),
  },
];