"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  CalendarDays,
  Users,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Zap,
  Globe,
  Shield,
  ArrowRight,
} from "lucide-react";
import { dmSans, spaceGrotesk } from "@/lib/fonts";
import { useState, useEffect } from "react";

import React from "react";
import Header from "@/components/common/Header";

const FloatingCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    whileHover={{
      scale: 1.05,
      rotateY: 5,
      transition: { duration: 0.2 },
    }}
    className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
  >
    {children}
  </motion.div>
);

type StatKey = "events" | "users" | "cities";

const AnimatedStats = () => {
  const [counts, setCounts] = useState<{
    events: number;
    users: number;
    cities: number;
  }>({ events: 0, users: 0, cities: 0 });

  useEffect(() => {
    const targets: Record<StatKey, number> = {
      events: 1250,
      users: 15000,
      cities: 45,
    };
    const duration = 2000;
    const increment = 50;

    (Object.keys(targets) as StatKey[]).forEach((key) => {
      let current = 0;
      const target = targets[key];
      const step = target / (duration / increment);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounts((prev) => ({ ...prev, [key]: Math.floor(current) }));
      }, increment);
    });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-8 my-16">
      {(
        [
          { key: "events", label: "Events Created", icon: CalendarDays },
          { key: "users", label: "Active Users", icon: Users },
          { key: "cities", label: "Cities", icon: Globe },
        ] as { key: StatKey; label: string; icon: React.ElementType }[]
      ).map(({ key, label, icon: Icon }, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
          className="text-center"
        >
          <Icon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <motion.div
            className={`${spaceGrotesk.className} text-3xl font-bold text-slate-900`}
            key={counts[key]}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {counts[key].toLocaleString()}+
          </motion.div>
          <p className={`${dmSans.className} text-slate-600`}>{label}</p>
        </motion.div>
      ))}
    </div>
  );
};

const FeatureGrid = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Create events in under 30 seconds",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      desc: "Your data protected with enterprise security",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      desc: "Invite co-organizers and manage together",
    },
    {
      icon: MapPin,
      title: "Location Smart",
      desc: "Integrated maps and venue suggestions",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-16">
      {features.map((feature, index) => (
        <FloatingCard key={feature.title} delay={0.8 + index * 0.1}>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <feature.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3
                className={`${spaceGrotesk.className} font-semibold text-slate-900 mb-2`}
              >
                {feature.title}
              </h3>
              <p className={`${dmSans.className} text-slate-600`}>
                {feature.desc}
              </p>
            </div>
          </div>
        </FloatingCard>
      ))}
    </div>
  );
};

const EventPreview = () => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1, duration: 0.8 }}
    className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto mt-16 border border-slate-100"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
          <Star className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3
            className={`${spaceGrotesk.className} font-semibold text-slate-900`}
          >
            Tech Meetup 2025
          </h3>
          <p className={`${dmSans.className} text-sm text-slate-500`}>
            Innovation Hub, Sector 18
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 ml-6 group bg-gray-100 group-hover:bg-indigo-200 rounded-lg transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
      </motion.button>
    </div>

    <div className="space-y-4">
      <div className="flex items-center space-x-3 text-slate-600">
        <Clock className="w-4 h-4" />
        <span className={`${dmSans.className} text-sm`}>
          08/09/2025 • 7:00 PM
        </span>
      </div>
      <div className="flex items-center space-x-3 text-slate-600">
        <Users className="w-4 h-4" />
        <span className={`${dmSans.className} text-sm`}>50 • max capacity</span>
      </div>
    </div>
  </motion.div>
);

const PulsatingDots = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-indigo-200 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
);

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      <PulsatingDots />

      <Header />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="p-6 bg-indigo-100 rounded-full">
              <CalendarDays className="w-16 h-16 text-indigo-600" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`${spaceGrotesk.className} text-5xl md:text-7xl font-black tracking-tight mb-6 text-slate-900`}
          >
            Event Planning
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="block text-indigo-600"
            >
              Reimagined
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className={`${dmSans.className} text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto`}
          >
            Transform your vision into unforgettable experiences. Create,
            manage, and scale events that matter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/events" className="group relative overflow-hidden">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${dmSans.className} px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <span>Explore</span>
                <motion.div
                  className="overflow-hidden"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </Link>

            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${dmSans.className} px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md`}
            >
              Create
            </motion.button> */}
          </motion.div>
        </motion.div>

        <AnimatedStats />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2
              className={`${spaceGrotesk.className} text-3xl font-bold text-slate-900 mb-4`}
            >
              Why Choose Evently?
            </h2>
            <p className={`${dmSans.className} text-slate-600 text-lg`}>
              Built for modern event organizers who demand excellence
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FeatureGrid />
            <EventPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
