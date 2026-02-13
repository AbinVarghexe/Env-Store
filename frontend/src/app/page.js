/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Check, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import LiquidChrome from "@/components/LiquidChrome";
import SplitText from "@/components/SplitText";
import MagicBento from "@/components/MagicBento";
import ColorBends from "@/components/ColorBends";
import LaserFlow from "@/components/LaserFlow";

const plans = [
  {
    name: "Free",
    price: "Free",
    period: "",
    description: "For developers taking their first steps with DevVault.",
    features: [
      "Up to 3 projects",
      "1 team member",
      "All environments",
      "AES-256 encryption",
      "Basic audit logs",
    ],
    cta: "Choose Plan",
    highlighted: false,
  },
  {
    name: "Standard",
    price: "$9,99",
    period: "/m",
    description: "For teams who need more freedom and flexibility.",
    features: [
      "Up to 50 projects",
      "API token access",
      "Advanced audit trails",
      "Team collaboration (up to 5 members)",
      "Priority support",
    ],
    cta: "Choose Plan",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19,99",
    period: "/m",
    description: "For studios and professional teams working with clients.",
    features: [
      "Unlimited projects",
      "Unlimited team members",
      "SSO integration",
      "Dedicated support & SLA",
      "Custom security policies",
    ],
    cta: "Choose Plan",
    highlighted: true,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      {/* Navbar */}
      {/* Navbar */}
      <nav
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-white/[0.05] backdrop-blur-md rounded-full shadow-lg"
        style={{ border: "1px solid rgba(255, 255, 255, 0.3)" }}
      >
        <div className="px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-white" />
            <span className="text-lg font-bold tracking-tight text-white">
              DevVault
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-white hover:text-white hover:bg-white/10"
              >
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="rounded-full bg-white text-black hover:bg-gray-200"
              >
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero + Features seamless gradient wrapper */}
      <div
        className="relative"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 100% 0%, rgba(88, 28, 135, 0.5), transparent 60%), radial-gradient(ellipse 80% 50% at 0% 100%, rgba(88, 28, 135, 0.4), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 50%, rgba(109, 40, 217, 0.15), transparent 50%), #030303",
        }}
      >
        {/* Hero */}
        <section className="relative min-h-screen flex flex-col items-center justify-start px-6 pt-32 pb-24 overflow-visible text-white">
          {/* Background Effect */}
          <div
            className="absolute inset-0 z-0"
            style={{ width: "100%", height: "100%" }}
          >
            <LiquidChrome
              baseColor={[0.1, 0.1, 0.2]}
              speed={0.3}
              amplitude={0.3}
              interactive={true}
            />
          </div>

          <div className="relative z-30 max-w-7xl mx-auto w-full flex flex-col items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-5xl mx-auto text-center"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="secondary" className="mb-12">
                  🔒 Secure by design
                </Badge>
              </motion.div>
              <div className="mb-20 max-w-6xl mix-blend-difference">
                <SplitText
                  text="Secure your"
                  className="text-5xl md:text-7xl font-bold tracking-tight block w-full max-w-6xl px-4"
                  delay={50}
                  duration={1.25}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  tag="h1"
                />
                <SplitText
                  text="environment variables"
                  className="text-5xl md:text-7xl font-bold tracking-tight block w-full max-w-6xl px-4"
                  delay={50}
                  duration={1.25}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  tag="h1"
                />
                <SplitText
                  text="The right way."
                  className="text-5xl md:text-7xl font-bold tracking-tight block mt-2"
                  delay={50}
                  duration={1.25}
                  ease="power3.out"
                  splitType="words"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  tag="h1"
                />
              </div>
              <motion.div
                variants={fadeInUp}
                className="relative z-30 flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link href="/register">
                  <button className="inline-flex items-center justify-center text-base px-8 py-3 rounded-full bg-white text-black hover:bg-gray-200 font-semibold transition-all duration-300 cursor-pointer">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="inline-flex items-center justify-center text-base px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 font-semibold transition-all duration-300 cursor-pointer">
                    <Github className="mr-2 h-4 w-4" /> View on GitHub
                  </button>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Code Preview Card — overlaps hero bottom into next section */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: "50%" }}
            transition={{ delay: 0.6, duration: 0.7 }}
            whileHover={{
              scale: 1.03,
              y: "-5%",
              transition: { type: "spring", stiffness: 200, damping: 25 },
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30 cursor-pointer"
          >
            <motion.div
              whileHover={{
                borderColor: "rgba(99, 102, 241, 0.4)",
                boxShadow:
                  "0 20px 60px rgba(99, 102, 241, 0.15), 0 0 40px rgba(99, 102, 241, 0.08)",
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
              style={{ borderWidth: "1px", borderStyle: "solid" }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="w-3 h-3 rounded-full bg-red-500"
                />
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="w-3 h-3 rounded-full bg-yellow-500"
                />
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="w-3 h-3 rounded-full bg-green-500"
                />
                <span className="text-xs text-slate-500 ml-2 font-mono">
                  terminal
                </span>
              </div>
              <CardContent className="p-6">
                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                  <code>
                    <span className="text-slate-500">$ </span>
                    <span className="text-emerald-400">curl</span>
                    <span className="text-slate-400"> -H </span>
                    <span className="text-amber-300">
                      {'"X-API-Key: dvt_abc123..."'}
                    </span>
                    {"\n"}
                    <span className="text-slate-400">
                      {" "}
                      https://api.devvault.io/secrets/myapp/production
                    </span>
                    {"\n\n"}
                    <span className="text-slate-500">{"{"} </span>
                    {"\n"}
                    <span className="text-indigo-400"> {'"STRIPE_KEY"'}</span>
                    <span className="text-slate-500">: </span>
                    <span className="text-emerald-300">
                      {'"sk_live_...decrypted"'}
                    </span>
                    {"\n"}
                    <span className="text-indigo-400"> {'"DB_URL"'}</span>
                    <span className="text-slate-500">: </span>
                    <span className="text-emerald-300">
                      {'"mongodb+srv://...decrypted"'}
                    </span>
                    {"\n"}
                    <span className="text-slate-500">{"}"}</span>
                  </code>
                </pre>
              </CardContent>
            </motion.div>
          </motion.div>
          {/* Hero Bottom Fade */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0a0014] z-20 pointer-events-none" />
        </section>

        {/* Features */}
        <section
          id="features"
          className="relative pt-64 pb-24 px-6 overflow-hidden"
        >
          {/* LaserFlow Background */}
          <div
            className="absolute inset-0 z-0"
            style={{ width: "100%", height: "100%", transform: "scaleY(-1)" }}
          >
            <LaserFlow
              color="#1f1f3e"
              wispDensity={4}
              flowSpeed={1.2}
              verticalSizing={5}
              horizontalSizing={2.2}
              fogIntensity={2}
              fogScale={0.45}
              wispSpeed={23}
              wispIntensity={10}
              flowStrength={0.35}
              decay={3}
              horizontalBeamOffset={0}
              verticalBeamOffset={-0.5}
            />
          </div>
          <div className="absolute inset-0 z-0">
            <ColorBends
              rotation={45}
              speed={0.2}
              colors={["#1a1a33", "#9595ff"]}
              transparent
              autoRotate={0.6}
              scale={1.6}
              frequency={1}
              warpStrength={1}
              mouseInfluence={0.5}
              parallax={1.3}
              noise={0.1}
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-5xl md:text-6xl font-bold mb-4"
              >
                Everything you need to
                <br />
                manage secrets
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-[rgb(var(--muted-foreground))] text-lg max-w-2xl mx-auto"
              >
                From encryption to audit logging, DevVault gives you the tools
                to keep your secrets safe.
              </motion.p>
            </motion.div>

            <div className="w-full">
              <MagicBento
                textAutoHide={true}
                enableStars
                enableSpotlight
                enableBorderGlow={true}
                enableTilt
                enableMagnetism={false}
                clickEffect
                spotlightRadius={750}
                particleCount={12}
                glowColor="95, 95, 255"
                disableAnimations={false}
              />
            </div>
          </div>
          {/* Bottom Gradient Overlay - Blend to next section color */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent via-[#0a0014]/50 to-[#0a0014] z-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-blue-900/20 to-transparent z-20 pointer-events-none" />
        </section>
      </div>
      {/* End gradient wrapper */}

      {/* Simple Secure Fast (Redesigned) */}
      <section className="relative py-24 px-6 bg-[#0a0014] text-white">
        {/* Top Gradient Blend */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/40 via-blue-900/5 to-transparent pointer-events-none z-10" />
        <div className="relative z-20 max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16 text-left"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Simple. <span className="text-[#9595ff]">Secure.</span> Fast.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-400 max-w-2xl text-lg"
            >
              Everything you need to manage your environment variables with
              confidence.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                time: "5 min setup",
                title: "Create a Project",
                desc: "Set up your project and choose environments.",
                image:
                  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=350&fit=crop",
              },
              {
                step: "02",
                time: "Secure storage",
                title: "Add Secrets",
                desc: "Store API keys, tokens, and credentials securely.",
                image:
                  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=350&fit=crop",
              },
              {
                step: "03",
                time: "Instant access",
                title: "Access Anywhere",
                desc: "Use the dashboard or API to retrieve secrets.",
                image:
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=350&fit=crop",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="group relative bg-white/[0.03] rounded-3xl overflow-hidden hover:bg-white/[0.05] transition-colors border border-white/5"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0014] to-transparent opacity-60 z-10" />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6 relative z-20">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#9595ff] mb-3">
                    <span>Step {item.step}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                    <span className="text-gray-400">{item.time}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#9595ff] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Read More Button (Centered) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-12 relative z-30"
          >
            <button className="px-8 py-3 rounded-full bg-[#9595ff] text-white font-medium hover:bg-[#7a7aff] transition-colors shadow-lg shadow-[#9595ff]/20">
              Read More
            </button>
          </motion.div>

          {/* Bottom Fade to Pricing Section Color */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#030303] pointer-events-none z-10" />
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="relative py-32 px-6 bg-[#030303] text-white overflow-hidden"
      >
        {/* Background watermark text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span className="text-[12rem] md:text-[16rem] font-black text-white/[0.03] tracking-tighter leading-none">
            Pricing
          </span>
        </div>

        {/* Subtle blue glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm text-gray-400 uppercase tracking-widest mb-3"
            >
              DevVault
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
            >
              Pricing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-400 text-lg">
              Start free, upgrade as you grow.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                className={`relative group rounded-2xl p-[1px] ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-blue-400/40 via-blue-500/20 to-transparent"
                    : "bg-gradient-to-b from-white/10 via-white/5 to-transparent"
                }`}
              >
                <div className="h-full rounded-2xl bg-white/[0.04] backdrop-blur-xl p-8 flex flex-col">
                  {/* Plan label */}
                  <div className="mb-1">
                    <span
                      className={`text-sm font-medium ${
                        plan.highlighted ? "text-blue-400" : "text-gray-400"
                      }`}
                    >
                      {plan.name}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-lg text-gray-400">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-gray-300"
                      >
                        <Check className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/register" className="mt-auto">
                    <button
                      className={`w-full py-3 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                        plan.highlighted
                          ? "bg-white text-black hover:bg-gray-200"
                          : "border border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Yearly toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mt-12"
          >
            <div className="w-10 h-5 rounded-full bg-white/10 border border-white/20 relative cursor-pointer">
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white/40 transition-all" />
            </div>
            <span className="text-sm text-gray-400 font-medium">Yearly</span>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgb(var(--border))] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[rgb(var(--primary))]" />
            <span className="font-semibold">DevVault</span>
          </div>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">
            © {new Date().getFullYear()} DevVault. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
