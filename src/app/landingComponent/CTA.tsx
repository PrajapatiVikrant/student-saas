"use client";
import { ArrowRight, Phone, Calendar } from "lucide-react";
import { motion } from "motion/react";

export function CTA() {

  const handleSchedule = () => {
    window.open("https://calendly.com/vikrant-codeflame/30min", "_blank");
  };

  const handleCallRequest = () => {
    window.open("https://wa.me/919149209580", "_blank");
  };

  return (
    <section id="getStarted" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Launch Your School Digital System — Completely Free
          </h2>

          <p className="text-xl text-blue-100 mb-8">
            We are onboarding schools with free Admin & Teacher portals.
            Book a meeting and see how it works.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleSchedule}
              className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group font-semibold"
            >
              <Calendar className="w-5 h-5" />
              Schedule a Meeting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleCallRequest}
              className="px-8 py-4 bg-transparent text-white rounded-lg border-2 border-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Request a Call
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white">
            <span>Free for Schools (Limited Period)</span>
            <span>Dedicated Setup Support</span>
            <span>Custom Features Available</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}