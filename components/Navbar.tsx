import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Sparkles, X, Check, Bookmark, PlayCircle } from 'lucide-react';
import { Movie } from '../types';

interface NavbarProps {
  onAIToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
  myList: Movie[];
  onOpenMovie: (movie: Movie) => void;
  onToggleMyList: (movie: Movie) => void;
}

interface NotificationItem {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onAIToggle, activeTab, onTabChange, onSearch, myList, onOpenMovie, onToggleMyList }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { 
      id: 1, 
      title: "Welcome to StreamAI", 
      body: "Explore our new AI-powered recommendations feature.", 
      time: "Just now", 
      read: false 
    }
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // My List State
  const [showMyList, setShowMyList] = useState(false);
  const myListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Check initial permission status
    if ("Notification" in window && Notification.permission === "granted") {
      setPushEnabled(true);
    }

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (myListRef.current && !myListRef.current.contains(event.target as Node)) {
        setShowMyList(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    // Simulate an incoming notification after 5 seconds
    const timer = setTimeout(() => {
      addNotification({
        title: "New Arrival",
        body: "🔥 'Dune: Part Two' is now trending in Movies.",
        time: "Now"
      });
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timer);
    };
  }, []);

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'read'>) => {
    const newNotif = { ...notif, id: Date.now(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
    
    // Also trigger system notification if enabled
    if (Notification.permission === "granted") {
      new Notification(notif.title, { body: notif.body });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setQuery(newVal);
    onSearch(newVal);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => document.getElementById('navbar-search-input')?.focus(), 100);
    } else if (query === '') {
       onSearch('');
       setQuery('');
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read when opening
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
    // Close other dropdown
    setShowMyList(false);
  };
  
  const toggleMyList = () => {
    setShowMyList(!showMyList);
    // Close other dropdown
    setShowNotifications(false);
  };

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setPushEnabled(true);
      new Notification("Notifications Enabled", {
        body: "You will now receive updates for new movies & TV shows.",
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'movies', label: 'Movies' },
    { id: 'new', label: 'New & Popular' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 
            className="text-red-600 text-2xl md:text-3xl font-bold tracking-tighter cursor-pointer"
            onClick={() => {
              onTabChange('home');
              setQuery('');
              onSearch('');
              setShowSearch(false);
            }}
          >
            StreamAI
          </h1>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-200">
            {navItems.map((item) => (
              <span 
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setQuery('');
                  onSearch('');
                }}
                className={`cursor-pointer transition ${activeTab === item.id ? 'text-white font-bold' : 'hover:text-white'}`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 text-white">
          <button 
            onClick={onAIToggle}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-white/10"
          >
            <Sparkles size={16} className="text-yellow-200" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
          
          {/* My List (Bookmark) Dropdown */}
          <div className="relative group" ref={myListRef}>
            <div className="relative cursor-pointer" onClick={toggleMyList}>
               <Bookmark 
                 className={`w-5 h-5 transition ${showMyList ? 'text-white fill-current' : 'text-gray-300 hover:text-white'}`} 
               />
               {myList.length > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#141414]">
                   {myList.length}
                 </span>
               )}
            </div>

            {showMyList && (
              <div className="absolute top-10 right-0 md:-right-10 w-80 bg-[#181818] border border-gray-700 rounded-md shadow-2xl overflow-hidden animate-fade-in-up origin-top-right">
                <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-[#202020]">
                  <h3 className="font-semibold text-sm">My List</h3>
                  <span className="text-xs text-gray-400">{myList.length} items</span>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {myList.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      <Bookmark size={24} className="mx-auto mb-2 opacity-50" />
                      Your list is empty. <br/> Add movies to watch them later.
                    </div>
                  ) : (
                    myList.map(movie => (
                      <div 
                        key={movie.id} 
                        className="p-3 border-b border-gray-800 hover:bg-white/5 transition flex gap-3 cursor-pointer group items-center"
                        onClick={() => {
                          onOpenMovie(movie);
                          setShowMyList(false);
                        }}
                      >
                         <div className="relative w-16 h-10 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                           <img src={movie.coverUrl} alt={movie.title} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                              <PlayCircle size={16} className="text-white" />
                           </div>
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-200 font-medium truncate">{movie.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] text-green-400 font-bold">{movie.matchScore}% Match</span>
                               <span className="text-[10px] text-gray-500 border border-gray-600 px-1 rounded-sm">{movie.rating}</span>
                            </div>
                         </div>
                         <button 
                           className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors z-10"
                           onClick={(e) => {
                             e.stopPropagation();
                             onToggleMyList(movie);
                           }}
                           title="Remove from list"
                         >
                           <X size={16} />
                         </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className={`flex items-center transition-all duration-300 ${showSearch ? 'bg-black/60 border border-white/50 px-2 py-1 rounded-sm' : ''}`}>
             <Search 
               className="w-5 h-5 cursor-pointer hover:text-gray-300 transition" 
               onClick={toggleSearch}
             />
             <input
               id="navbar-search-input"
               type="text"
               placeholder="Titles, people, genres"
               className={`bg-transparent border-none text-white text-sm focus:outline-none transition-all duration-300 ${showSearch ? 'w-32 md:w-60 ml-2' : 'w-0 ml-0 overflow-hidden'}`}
               value={query}
               onChange={handleSearchChange}
               onBlur={() => {
                 if (!query) setShowSearch(false);
               }}
             />
          </div>

          {/* Notification Bell */}
          <div className="relative group" ref={notificationRef}>
            <div className="relative cursor-pointer" onClick={toggleNotifications}>
              <Bell 
                className={`w-5 h-5 transition ${showNotifications ? 'text-white' : 'text-gray-300 hover:text-white'}`} 
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </div>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-10 right-0 w-80 bg-[#181818] border border-gray-700 rounded-md shadow-2xl overflow-hidden animate-fade-in-up origin-top-right">
                <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-[#202020]">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Clear all
                  </button>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {!pushEnabled && (
                    <div 
                      onClick={requestPushPermission}
                      className="p-3 bg-indigo-900/20 hover:bg-indigo-900/30 border-b border-indigo-500/20 cursor-pointer flex items-start gap-3 transition"
                    >
                      <Bell size={16} className="text-indigo-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-200">Enable Desktop Notifications</p>
                        <p className="text-xs text-indigo-300/70 mt-0.5">Get notified about new releases instantly.</p>
                      </div>
                    </div>
                  )}

                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-3 border-b border-gray-800 hover:bg-white/5 transition flex gap-3">
                         <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.read ? 'bg-transparent' : 'bg-blue-500'}`}></div>
                         <div>
                            <p className="text-sm text-gray-200">{notif.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{notif.body}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{notif.time}</p>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-8 h-8 rounded bg-blue-600 cursor-pointer flex items-center justify-center font-bold">
            U
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;