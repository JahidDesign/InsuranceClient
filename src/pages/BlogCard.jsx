import { useEffect, useState } from "react";
import { Calendar, Clock, User, ArrowRight, Heart, Share2, BookOpen, Eye, TrendingUp, Sparkles, Zap, Star } from "lucide-react";

const BlogListBigCard = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://insurances-lmy8.onrender.com/blogpost");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setBlogs(data);
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Error loading blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
        // Mock data for demo purposes
        setBlogs([
          {
            _id: "1",
            title: "The Future of Digital Insurance: Transforming Protection in the 21st Century",
            details: "Discover how artificial intelligence, blockchain, and IoT are revolutionizing the insurance industry. From instant claims processing to personalized risk assessment, explore the innovations shaping tomorrow's coverage.",
            category: "Technology",
            author: "Sarah Chen",
            date: "2024-03-15",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format",
            authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format",
            views: 12500,
            likes: 348,
            trending: true
          },
          {
            _id: "2",
            title: "Smart Financial Planning: Building Wealth Through Strategic Risk Management",
            details: "Learn proven strategies for balancing growth and protection in your investment portfolio. Our experts share insights on diversification, emergency funds, and long-term wealth building techniques.",
            category: "Finance",
            author: "Michael Rodriguez",
            date: "2024-03-12",
            image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop&auto=format",
            authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
            views: 8900,
            likes: 267
          },
          {
            _id: "3",
            title: "Essential Life Insurance Tips for Young Professionals",
            details: "Starting your career? Don't overlook life insurance. This comprehensive guide covers term vs. whole life policies, coverage amounts, and when to start protecting your financial future.",
            category: "Insurance",
            author: "Emma Thompson",
            date: "2024-03-10",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format",
            authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
            views: 15200,
            likes: 421
          }
        ]);
        setIsLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "from-blue-500 via-cyan-500 to-teal-500",
      Education: "from-green-500 via-emerald-500 to-teal-500", 
      Planning: "from-orange-500 via-red-500 to-pink-500",
      Finance: "from-cyan-500 via-blue-500 to-purple-500",
      Insurance: "from-indigo-500 via-purple-500 to-pink-500",
      Tips: "from-yellow-500 via-orange-500 to-red-500",
      default: "from-gray-500 via-slate-500 to-gray-600"
    };
    return colors[category] || colors.default;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Technology: Zap,
      Education: BookOpen,
      Planning: Star,
      Finance: TrendingUp,
      Insurance: Sparkles,
      Tips: Star,
      default: BookOpen
    };
    const IconComponent = icons[category] || icons.default;
    return <IconComponent className="w-4 h-4" />;
  };

  const formatViews = (views) => {
    if (typeof views === 'string') return views;
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views?.toString() || "0";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const estimateReadTime = (content) => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const getDefaultImage = () => {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format";
  };

  const getDefaultAuthorImage = () => {
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 py-16 px-4 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-3xl px-8 py-4 mb-8 shadow-2xl border border-white/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin" />
              <span className="font-bold text-gray-700 text-lg">Loading Amazing Content...</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Latest Insights
              </span>
            </h2>
          </div>

          <div className="space-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group">
                <div className="flex flex-col xl:flex-row bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                  <div className="xl:w-1/2 h-80 xl:h-80 relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="xl:w-1/2 p-12 space-y-6">
                    <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
                    <div className="space-y-3">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/5 animate-pulse" />
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/5 animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between pt-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-5 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
                          <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-14 w-36 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 p-16">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">
              😔
            </div>
            <h2 className="text-4xl font-black text-gray-800 mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="group relative px-10 py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-3xl hover:shadow-2xl hover:shadow-red-500/40 transform hover:scale-105 transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Try Again
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 py-16 px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse transition-all duration-1000"
          style={{
            left: mousePosition.x * 0.02,
            top: mousePosition.y * 0.02,
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000 transition-all duration-1000"
          style={{
            right: mousePosition.x * -0.01,
            bottom: mousePosition.y * -0.01,
          }}
        />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-300/15 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-3xl px-8 py-4 mb-8 shadow-2xl border border-white/50">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-700 text-lg">Featured Content</span>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Latest Insights
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay ahead with expert insights, industry trends, and practical advice 
            to secure your financial future
          </p>
        </div>

        {/* Blog Cards */}
        <div className="space-y-16">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              onMouseEnter={() => setHoveredCard(blog._id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative transform transition-all duration-700 ${
                isLoaded 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              } ${hoveredCard === blog._id ? 'z-30' : 'z-10'}`}
              style={{ 
                transitionDelay: `${index * 200}ms`,
              }}
            >
              {/* Dynamic Glow Effect */}
              <div className={`absolute -inset-2 bg-gradient-to-r ${getCategoryColor(blog.category)} rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 ${hoveredCard === blog._id ? 'scale-110' : 'scale-100'}`} />
              
              <div className={`relative flex flex-col xl:flex-row bg-white/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transition-all duration-700 ${hoveredCard === blog._id ? 'transform scale-105 -translate-y-4' : ''}`}>
                {/* Image Section */}
                <div className="relative xl:w-1/2 h-80 xl:h-auto overflow-hidden group">
                  <img
                    src={blog.image || getDefaultImage()}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:rotate-2"
                    onError={(e) => {
                      e.target.src = getDefaultImage();
                    }}
                  />
                  
                  {/* Dynamic Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  {blog.category && (
                    <div className={`absolute top-6 left-6 flex items-center gap-2 px-4 py-3 bg-gradient-to-r ${getCategoryColor(blog.category)} text-white text-sm font-bold rounded-2xl shadow-xl backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-300`}>
                      {getCategoryIcon(blog.category)}
                      {blog.category}
                    </div>
                  )}
                  
                  {/* Trending Badge */}
                  {blog.trending || (blog.createdAt && new Date(blog.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ? (
                    <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 backdrop-blur-sm text-white text-sm font-bold rounded-2xl shadow-xl animate-pulse">
                      <TrendingUp className="w-4 h-4" />
                      {blog.trending ? 'Trending' : 'New'}
                    </div>
                  ) : null}

                  {/* Floating Action Buttons */}
                  <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                    <button className="p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 hover:scale-110 transition-all duration-300 group/btn">
                      <Heart className="w-5 h-5 text-white group-hover/btn:text-red-400 transition-colors duration-300" />
                    </button>
                    <button className="p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 hover:scale-110 transition-all duration-300 group/btn">
                      <Share2 className="w-5 h-5 text-white group-hover/btn:text-blue-400 transition-colors duration-300" />
                    </button>
                  </div>

                  {/* Reading Progress Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
                </div>

                {/* Content Section */}
                <div className="xl:w-1/2 p-8 xl:p-12 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Title */}
                    <h3 className="text-2xl xl:text-3xl font-black text-gray-900 leading-tight group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      {blog.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-lg leading-relaxed line-clamp-4 group-hover:text-gray-700 transition-colors duration-300">
                      {blog.details}
                    </p>

                    {/* Enhanced Stats Row */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl group-hover:bg-blue-50 transition-colors duration-300">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-gray-700">{blog.readTime || estimateReadTime(blog.details)}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl group-hover:bg-green-50 transition-colors duration-300">
                        <Eye className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-gray-700">{formatViews(blog.views || Math.floor(Math.random() * 15000))} views</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl group-hover:bg-red-50 transition-colors duration-300">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="font-semibold text-gray-700">{blog.likes || Math.floor(Math.random() * 500)} likes</span>
                      </div>
                    </div>
                  </div>

                  {/* Author and CTA Section */}
                  <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-200/50">
                    {/* Enhanced Author Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={blog.authorImage || getDefaultAuthorImage()}
                          alt={blog.author || "Author"}
                          className="w-16 h-16 rounded-3xl object-cover border-3 border-white shadow-xl group-hover:scale-110 group-hover:border-blue-200 transition-all duration-300"
                          onError={(e) => {
                            e.target.src = getDefaultAuthorImage();
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 border-3 border-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        </div>
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300">{blog.author || "Anonymous"}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span className="font-medium">{formatDate(blog.date || blog.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced CTA Button */}
                    <a 
                      href={`/blog/${blog._id}`}
                      className={`group/btn relative px-8 py-4 bg-gradient-to-r ${getCategoryColor(blog.category)} text-white font-black rounded-3xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 hover:-rotate-1 transition-all duration-500 overflow-hidden flex items-center gap-3 no-underline`}
                    >
                      <span className="relative z-10">Read Article</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-2 group-hover/btn:scale-125 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Load More Section */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="relative inline-block">
            <button className="group relative px-16 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-black text-xl rounded-3xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 hover:rotate-1 transition-all duration-500 overflow-hidden">
              <span className="relative z-10 flex items-center gap-4">
                Load More Articles
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce opacity-60" />
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse opacity-60" />
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          75% { transform: translateY(-5px) rotate(-1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BlogListBigCard;