"use client";
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your School Management?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of schools already using EduManage to streamline operations 
            and improve communication.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group font-semibold">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-8 py-4 bg-transparent text-white rounded-lg border-2 border-white hover:bg-white/10 transition-all">
              Schedule a Demo
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Setup in minutes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
