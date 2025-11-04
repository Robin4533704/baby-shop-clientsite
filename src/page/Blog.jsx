// components/Blog.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Eye,
  MessageCircle,
  BookOpen
} from "lucide-react";
import blogs from "../blogs/blogs"
// JSON data import


const Blog = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 } }
  };

  const cardHoverVariants = {
    hover: { y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString || new Date()).toLocaleDateString('en-US', options);
  };

  // Calculate read time
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Blog</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              No blog posts available at the moment. Check back soon for updates!
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen size={16} /> Latest Articles
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            From Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Blog</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover insightful articles, tips, and stories from our experts
          </p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => {
            const readTime = calculateReadTime(blog.content);
            return (
              <motion.div key={blog.id} variants={itemVariants} whileHover="hover" className="group cursor-pointer" onClick={() => navigate(`/blog/${blog.id}`)}>
                <motion.div variants={cardHoverVariants} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                  
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img src={blog.image} alt={blog.title} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    {blog.category && <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{blog.category}</div>}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
                      <div className="flex items-center gap-1"><Calendar size={14} /><span>{formatDate(blog.publishDate)}</span></div>
                      <div className="flex items-center gap-1"><Clock size={14} /><span>{readTime} min read</span></div>
                      {blog.author && <div className="flex items-center gap-1"><User size={14} /><span>{blog.author}</span></div>}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default Blog;
