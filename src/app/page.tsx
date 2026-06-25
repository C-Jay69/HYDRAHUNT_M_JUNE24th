'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, FileText, TrendingUp, Crosshair, Database, Search, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ icon, title, desc, colorClass = "border-[#b154f8]", className = "" }: any) => (
  <div className={`bg-[#111] p-8 border-2 ${colorClass} hover:-translate-y-2 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] ${className}`}>
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2 font-display">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ num, title, desc }) => (
  <div className="relative p-6 border-l-2 border-[#333] hover:border-[#06b6d4] transition-colors">
    <div className="text-5xl font-black text-[#222] absolute -top-6 -left-4 bg-black px-2">{num}</div>
    <div className="relative z-10 pt-2">
      <h3 className="text-2xl font-bold mb-3 text-[#06b6d4] font-display">{title}</h3>
      <p className="text-gray-400 text-lg leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="bg-black text-white font-display selection:bg-[#b154f8] selection:text-white min-h-screen flex flex-col relative">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-[#b154f8] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-12">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#06b6d4] to-[#b154f8] rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-64 md:w-80 rounded-lg shadow-2xl border border-white/10 bg-gradient-to-br from-[#111] to-black flex items-center justify-center p-8 group-hover:scale-[1.02] transition-transform">
                <div className="text-center">
                  <Shield className="mx-auto mb-4 text-[#b154f8]" size={64} />
                  <div className="text-4xl font-black">HYDRA</div>
                  <div className="text-2xl font-bold text-[#06b6d4]">HUNT</div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tighter uppercase">
            Job hunting is dead. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b154f8] to-[#06b6d4]">
              We killed it.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Stop applying. Start striking. Our aggressive AI-powered engine hunts down roles and auto-deploys your career growth while you sleep.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/dashboard" className="group relative px-8 py-5 bg-[#06b6d4] text-black font-black text-xl hover:bg-[#06b6d4]/90 transition-all w-full md:w-auto rounded-xl shadow-xl shadow-[#06b6d4]/20">
              <span className="relative z-10 flex items-center justify-center gap-2">
                UNLEASH HUNT MODE <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
              </span>
            </Link>
            <Button variant="outline" className="px-8 py-5 border-white/20 text-white font-bold text-xl hover:bg-white/10 transition-all w-full md:w-auto rounded-xl">
              WATCH HYDRA HUNT
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-20 text-center tracking-tight uppercase">
            TURN CHAOS INTO <span className="text-[#b154f8]">CAREER DOMINANCE</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText size={40} className="text-[#b154f8]" />}
              title="Resume Weaponization"
              desc="Transform messy documents into employer-melting resumes that strike hard and land interviews."
              colorClass="border-[#b154f8]"
            />
            <FeatureCard
              icon={<TrendingUp size={40} className="text-[#06b6d4]" />}
              title="Auto-Hunt Engine"
              desc="24/7 opportunity tracking. Multiple heads scouring the web for the perfect target."
              colorClass="border-[#06b6d4]"
            />
            <FeatureCard
              icon={<Crosshair size={40} className="text-[#b154f8]" />}
              title="Instant Deployment"
              desc="One-click strike capability. Bypass the queue and deploy your profile directly to decision makers."
              colorClass="border-[#b154f8]"
            />
            <FeatureCard
              icon={<Database size={40} className="text-[#06b6d4]" />}
              title="Version Vault"
              desc="Full version control for your career assets. Revert, archive, and evolve your strategy."
              colorClass="border-[#06b6d4]"
              className="md:col-span-2"
            />
            <FeatureCard
              icon={<Shield size={40} className="text-[#b154f8]" />}
              title="Strike Analysis"
              desc="Benchmarking your profile against the competition to ensure you are the most lethal candidate."
              colorClass="border-[#b154f8]"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#b154f8]/5 to-black pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-20 text-center uppercase">HOW HYDRA HUNTS FOR YOU</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Step num="01" title="Infect" desc="Feed Hydra your legacy resume and LinkedIn. Our engine digests your history, accomplishments, and hidden skills." />
            <Step num="02" title="Mutate" desc="Our AI forges a hyper-aggressive, ATS-crushing profile. We optimize for every specific role's lethal criteria." />
            <Step num="03" title="Strike" desc="Auto-deploy to thousands of roles while you sleep. Hydra handles the logistics while you wait for interview invites." />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-black">
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl p-12 md:p-20 border border-white/10 overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase">Ready to end the search?</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl">
                Join 50,000+ professionals who have automated their career growth. Your new role is already waiting. Strike first.
              </p>
              <Link href="/dashboard" className="bg-gradient-to-r from-[#b154f8] to-[#6d28d9] px-10 py-5 rounded-xl text-xl font-bold text-white shadow-2xl shadow-[#b154f8]/30 hover:scale-105 transition-all uppercase">
                Unleash Hunt Mode Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
