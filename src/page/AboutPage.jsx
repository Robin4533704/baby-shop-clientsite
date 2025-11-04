// components/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  Users, 
  Award, 
  Star, 
  Quote,
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Truck,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Brand Story */}
      <BrandStory />
      
      {/* Mission & Vision */}
      <MissionVision />
      
      {/* Values */}
      <OurValues />
      
      {/* Team Section */}
      <TeamSection />
      
      {/* Stats */}
      <StatsSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

// Hero Section
const HeroSection = () => (
  <section className="relative bg-gradient-to-br from-blue-50 to-pink-50 pt-24 pb-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="text-center"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          variants={fadeInUp}
        >
          Welcome to <span className="text-blue-600">BabyBloom</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          variants={fadeInUp}
        >
          Where every little journey begins with love, care, and the safest products for your precious ones.
        </motion.p>
        <motion.div 
          className="flex justify-center space-x-4"
          variants={fadeInUp}
        >
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Shop Now
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
            Our Story
          </button>
        </motion.div>
      </motion.div>
    </div>
    
    {/* Decorative elements */}
    <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20"></div>
    <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-30"></div>
    <div className="absolute top-1/2 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-40"></div>
  </section>
);

// Brand Story Section
const BrandStory = () => {
  const milestones = [
    { year: '2022', event: 'BabyBloom founded by Sarah & John Chen' },
    { year: '2023', event: 'First 1000 happy customers' },
    { year: '2024', event: 'Expanded to online marketplace' },
    { year: '2025', event: 'Launched eco-friendly product line' },
    
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Content */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                It all started in 2015 when our founders, Sarah and John, were expecting their first child. 
                Like many new parents, they struggled to find <span className="text-blue-600 font-semibold">safe, high-quality, and affordable</span> baby products 
                that aligned with their values.
              </p>
              <p className="text-lg">
                Frustrated by the overwhelming choices and concerned about product safety, they decided to 
                create a curated marketplace where parents could shop with <span className="text-blue-600 font-semibold">complete confidence</span>.
              </p>
              <p className="text-lg">
                Today, BabyBloom has grown from a small family dream into a trusted destination for thousands 
                of families worldwide, but our core mission remains the same: 
                <span className="text-pink-600 font-semibold"> making parenting easier and safer, one product at a time</span>.
              </p>
            </div>

            {/* Milestones */}
            <motion.div 
              className="mt-8 space-y-4"
              variants={fadeInUp}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Journey</h3>
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold min-w-16 text-center">
                    {milestone.year}
                  </div>
                  <span className="text-gray-700">{milestone.event}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="relative"
            variants={fadeInUp}
          >
            <img
              src="https://images.unsplash.com/photo-1551376347-075b0121a65b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Happy family with baby"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-gray-900 p-6 rounded-2xl shadow-xl">
              <Quote className="w-8 h-8 mb-2" />
              <p className="font-semibold">"Every child deserves the safest start in life."</p>
              <p className="text-sm mt-2">- Sarah Chen, Founder</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Mission & Vision Section
const MissionVision = () => (
  <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {/* Mission */}
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-lg"
          variants={fadeInUp}
          whileHover={{ y: -5 }}
        >
          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            To provide parents with carefully curated, safety-certified baby products that 
            empower them to make the best choices for their little ones. We believe every 
            family deserves access to products that are <span className="text-blue-600 font-semibold">safe, sustainable, and scientifically proven</span> 
            to support healthy development.
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-lg"
          variants={fadeInUp}
          whileHover={{ y: -5 }}
        >
          <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Star className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            To create a world where every child's journey begins with the safest, most nurturing 
            environment possible. We envision a future where parents never have to choose between 
            <span className="text-purple-600 font-semibold"> quality, safety, and affordability</span>, and where every baby product contributes 
            positively to our planet.
          </p>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Our Values Section
const OurValues = () => {
  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Every product undergoes rigorous safety testing and meets the highest international standards.',
      color: 'green'
    },
    {
      icon: Heart,
      title: 'Quality Assurance',
      description: 'We personally test and verify every product before it reaches our customers.',
      color: 'red'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'We build relationships, not just customer bases. Your family becomes our family.',
      color: 'blue'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We continuously strive to exceed expectations in product quality and customer service.',
      color: 'yellow'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at BabyBloom
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6"
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${getColorClasses(value.color)}`}>
                  <value.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Team Section
const TeamSection = () => {
  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Mother of two passionate about child safety and product quality.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'John Chen',
      role: 'CTO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Tech enthusiast dedicated to creating seamless shopping experiences.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of Product Safety',
      image: 'https://images.unsplash.com/photo-1551836026-d5c2e0c49b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Pediatrician with 15 years experience in child product safety.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Michael Thompson',
      role: 'Customer Experience Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      bio: 'Dedicated to ensuring every customer feels supported and valued.',
      social: { linkedin: '#', twitter: '#' }
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate parents, experts, and professionals dedicated to keeping your little ones safe and happy
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center space-x-3">
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Join Team CTA */}
          <motion.div 
            className="text-center mt-12"
            variants={fadeInUp}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Family</h3>
              <p className="text-gray-600 mb-6">
                We're always looking for passionate individuals who share our commitment to child safety and family well-being.
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                View Career Opportunities
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const stats = [
    { number: '50,000+', label: 'Happy Families' },
    { number: '100+', label: 'Safety Certifications' },
    { number: '24/7', label: 'Customer Support' },
    { number: '99.8%', label: 'Satisfaction Rate' }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-blue-100 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <motion.h2 
          className="text-4xl font-bold text-gray-900 mb-6"
          variants={fadeInUp}
        >
          Ready to Experience the BabyBloom Difference?
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 mb-8"
          variants={fadeInUp}
        >
          Join thousands of parents who trust us for their baby's needs.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          variants={fadeInUp}
        >
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
            Start Shopping Now
          </button>
          <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-colors">
            Contact Our Team
          </button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default AboutPage;