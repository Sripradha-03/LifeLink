'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BloodCompatibility from '@/components/BloodCompatibility'
import Features from '@/components/Features'
import Stats from '@/components/Stats'
import Footer from '@/components/Footer'
import AIChat from '@/components/AIChat'

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <BloodCompatibility />
      <Features />
      <Stats />
      <Footer />
      <AIChat showChat={showChat} setShowChat={setShowChat} />
    </main>
  )
}

