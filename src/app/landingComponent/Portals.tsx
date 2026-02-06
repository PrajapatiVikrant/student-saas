"use client";
import { Shield, BookOpen, Heart, Check, ArrowRight, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

const portals = [
  {
    icon: Shield,
    title: 'Admin Portal',
    description: 'Complete control and oversight of your institution',
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Attendance management with real-time tracking',
      'Event management with automated notifications',
      'Student performance analytics and reporting',
      'Teacher management (Create, Read, Update, Delete)',
      'Student management (Complete CRUD operations)',
      'Parent management (Complete CRUD operations)',
      'Custom notification system for parents and teachers',
      'Comprehensive dashboard with insights'
    ],
    link: '/admin/dashboard'
  },
  {
    icon: BookOpen,
    title: 'Teacher Portal',
    description: 'Empower educators with smart tools',
    color: 'from-purple-500 to-pink-500',
    features: [
      'Quick attendance marking with notifications',
      'Student performance tracking by attendance',
      'Test result management and analysis',
      'Add and manage class events (tests, exams)',
      'View student progress over time',
      'Automated parent notifications',
      'Class schedule management',
      'Performance reports generation'
    ],
    link: '/teacher/login'
  },
  {
    icon: Heart,
    title: 'Parent Portal',
    description: 'Keep parents connected and informed',
    color: 'from-orange-500 to-red-500',
    features: [
      "Check today's attendance status instantly",
      'Detailed attendance history for all days',
      'Real-time notifications for school events',
      'Test and exam schedule notifications',
      'Receive test/exam report alerts',
      'Attendance update notifications',
      'Event reminders and updates',
      'Dedicated mobile-friendly interface'
    ],
    link: '/parent'
  }
];

export function Portals() {
  return (
    <section id="portals" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
            Three Powerful Portals
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Portal
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Separate, specialized portals designed specifically for administrators, 
            teachers, and parents - each with the exact features they need.
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {portals.map((portal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow flex flex-col"
            >
              <div className={`h-2 bg-gradient-to-r ${portal.color}`}></div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center mb-6`}>
                  <portal.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {portal.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {portal.description}
                </p>
                
                <div className="space-y-3 mb-8 flex-1">
                  {portal.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${portal.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={portal.link} className={`w-full py-4 bg-gradient-to-r ${portal.color} text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group font-semibold`}>
                  <LogIn className="w-5 h-5" />
                  Enter {portal.title.split(' ')[0]} Portal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}