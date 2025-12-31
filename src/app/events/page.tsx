'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ImageGallery } from '@/components/events/ImageGallery'
import Link from 'next/link'

const events = [
  {
    id: 1,
    title: 'Beaconhouse National University Festival',
    date: 'November 11, 2025',
    location: 'Beaconhouse National University, Lahore',
    description: 'Our stall at the BNU Festival showcased our latest collection of mosaic mirrors and disco balls. We connected with art enthusiasts and interior designers.',
    image: '/images/events/bnu_event5.jpeg',
    gallery: [
      '/images/events/bnu_event1.jpeg',
      '/images/events/bnu_event2.jpeg',
      '/images/events/bnu_event3.jpeg',
      '/images/events/bnu_event4.jpeg',
      '/images/events/bnu_event5.jpeg',
    ],
  },
  {
    id: 2,
    title: 'Askari 11 Winter Festival 2025',
    date: 'December 27, 2025',
    location: 'Askari 11, Lahore',
    description: 'A wonderful opportunity to demonstrate our handcrafted mosaic techniques and meet fellow artisans. Our interactive booth allowed visitors to see the creation process.',
    image: '/images/events/askari_event1.jpeg',
    gallery: [
      '/images/events/askari_event1.jpeg',
      '/images/events/askari_event2.jpeg',
      '/images/events/askari_event3.jpeg',
    ],
  },
]

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const openGallery = (eventId: number) => {
    setSelectedEvent(eventId)
    setIsGalleryOpen(true)
  }

  const closeGallery = () => {
    setIsGalleryOpen(false)
    setSelectedEvent(null)
  }

  const currentEvent = events.find(e => e.id === selectedEvent)
  const upcomingEvents: typeof events = [] // No upcoming events for now
  const pastEvents = events
  return (
    <div className="min-h-screen pt-32 pb-16 bg-dark-950">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-850 to-dark-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-silver-400/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Page Header */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gold-shine mb-6 relative" data-text="Our Events">
            Our Events
          </h1>
          <p className="text-xl md:text-2xl font-fancy text-silver-400 italic">
            Discover where we&apos;ve showcased our handcrafted mosaic mirror art and connected with the community
          </p>
        </motion.div> */}

        {/* Upcoming Events Section */}
        <div className="mb-20 max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-display font-bold text-silver-shine mb-8" data-text="Upcoming Events"
          >
            Upcoming Events
          </motion.h2>
          
          {upcomingEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-dark-900/60 backdrop-blur-sm border border-silver-700/20 rounded-2xl p-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-silver-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-display font-bold text-silver-shine mb-2">No Upcoming Events</h3>
                <p className="text-lg font-fancy text-silver-400 italic">
                  Stay tuned! We&apos;ll announce new events soon.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  onClick={() => openGallery(event.id)}
                  className="bg-dark-900/60 backdrop-blur-sm border border-silver-700/20 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(192,192,192,0.1)] hover:shadow-[0_8px_48px_rgba(192,192,192,0.2)] transition-all duration-300 cursor-pointer group"
                >
                  <div className="grid md:grid-cols-[300px_1fr] gap-6">
                    <div className="relative h-64 md:h-auto group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                      <div className="absolute bottom-2 right-2 px-3 py-1 bg-black/70 rounded-full text-white text-sm font-fancy flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.gallery.length}
                      </div>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <h2 className="text-3xl font-display font-bold text-silver-shine mb-3" data-text={event.title}>
                        {event.title}
                      </h2>
                      <div className="flex flex-col gap-2 mb-4 font-fancy text-silver-400">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <p className="text-silver-300 font-fancy leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Separator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mb-20"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-silver-700/30"></div>
          </div>
            <div className="relative flex justify-center">
            <span className="bg-dark-950 px-6 text-silver-650 font-fancy text-lg">
              Past Events
            </span>
          </div>
        </motion.div>

        {/* Past Events Section */}
        <div className="space-y-16 max-w-5xl mx-auto">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onClick={() => openGallery(event.id)}
              className="bg-dark-900/60 backdrop-blur-sm border border-silver-700/20 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(192,192,192,0.1)] hover:shadow-[0_8px_48px_rgba(192,192,192,0.2)] transition-all duration-300 cursor-pointer group"
            >
              <div className="grid md:grid-cols-[300px_1fr] gap-6">
                {/* Event Image */}
                <div className="relative h-64 md:h-auto group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  {/* Gallery indicator */}
                  <div className="absolute bottom-2 right-2 px-3 py-1 bg-black/70 rounded-full text-white text-sm font-fancy flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.gallery.length}
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-8 flex flex-col justify-center">
                  <h2 className="text-3xl font-display font-bold text-silver-shine mb-3" data-text={event.title}>
                    {event.title}
                  </h2>
                  <div className="flex flex-col gap-2 mb-4 font-fancy text-silver-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-silver-300 font-fancy leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <p className="text-xl font-fancy text-silver-400 mb-6">
            Want to see us at your next event?
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-silver-600 to-silver-500 text-dark-900 font-fancy font-semibold rounded-lg hover:from-silver-500 hover:to-silver-400 transition-all duration-300 shadow-[0_4px_16px_rgba(192,192,192,0.3)] hover:shadow-[0_6px_24px_rgba(192,192,192,0.4)] hover:scale-105"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>

      {/* Image Gallery Modal */}
      {currentEvent && (
        <ImageGallery
          images={currentEvent.gallery}
          isOpen={isGalleryOpen}
          onClose={closeGallery}
        />
      )}
    </div>
  )
}
