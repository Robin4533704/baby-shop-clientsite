// components/TeamModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Twitter, Mail } from 'lucide-react';

const TeamModal = ({ member, isOpen, onClose }) => {
  if (!member) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover rounded-2xl"
                />
                
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-600">{member.role}</h4>
                    <p className="text-gray-600 mt-2">{member.bio}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Expertise</h5>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise?.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600">
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400">
                      <Twitter className="w-6 h-6" />
                    </a>
                    <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-red-600">
                      <Mail className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamModal;