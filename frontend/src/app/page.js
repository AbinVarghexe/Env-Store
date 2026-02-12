"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Users,
  Activity,
  Key,
  Server,
  ArrowRight,
  Check,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import LiquidChrome from "@/components/LiquidChrome";
import SplitText from "@/components/SplitText";

const features = [
  {
    icon: Lock,
    title: "AES-256 Encryption",
    description: "Military-grade encryption for all your secrets. Zero plaintext storage.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Role-based access control with Owner, Admin, Developer, and Viewer roles.",
  },
  {
    icon: Activity,
    title: "Audit Logging",
    description: "Track every secret access, update, and deletion with detailed audit trails.",
  },
  {
    icon: Key,
    title: "API Access",
    description: "Secure REST API with JWT and API token authentication for CI/CD pipelines.",
  },
  {
    icon: Server,
    title: "Multi-Environment",
    description: "Organize secrets by Development, Staging, Production, or custom environments.",
  },
  {
    icon: Shield,
    title: "Two-Factor Auth",
    description: "TOTP-based 2FA for an extra layer of security on your account.",
  },
];

const plans = [
  {
    name: "Free",
    price: "Free",
    period: "",
    description: "For developers taking their first steps with DevVault.",
    features: ["Up to 3 projects", "1 team member", "All environments", "AES-256 encryption", "Basic audit logs"],
    cta: "Choose Plan",
    highlighted: false,
  },
  {
    name: "Standard",
    price: "$9,99",
    period: "/m",
    description: "For teams who need more freedom and flexibility.",
    features: ["Up to 50 projects", "API token access", "Advanced audit trails", "Team collaboration (up to 5 members)", "Priority support"],
    cta: "Choose Plan",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19,99",
    period: "/m",
    description: "For studios and professional teams working with clients.",
    features: ["Unlimited projects", "Unlimited team members", "SSO integration", "Dedicated support & SLA", "Custom security policies"],
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
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 bg-white/[0.05] backdrop-blur-md rounded-full shadow-lg" style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}>
        <div className="px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-white" />
            <span className="text-lg font-bold tracking-tight text-white">DevVault</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full text-white hover:text-white hover:bg-white/10">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full bg-white text-black hover:bg-gray-200">Start Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-visible bg-[#030303] text-white">
        {/* Background Effect */}
        <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
          <LiquidChrome
            baseColor={[0.1, 0.1, 0.2]}
            speed={0.3}
            amplitude={0.3}
            interactive={true}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="secondary" className="mb-6">
                🔒 Secure by design
              </Badge>
            </motion.div>
            <div className="mb-6">
              <SplitText
                text="Secure your environment variables."
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
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-[rgb(var(--muted-foreground))] mb-10 max-w-2xl mx-auto"
            >
              Store, manage, and deploy secrets securely with AES-256 encryption.
              Built for developers and teams who care about security.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Start Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-base">
                  See Features
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Code Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3/4 w-full max-w-2xl px-6 z-20"
          >
            <Card className="overflow-hidden bg-slate-950 border-slate-800">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 ml-2 font-mono">terminal</span>
              </div>
              <CardContent className="p-6">
                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                  <code>
                    <span className="text-slate-500">$ </span>
                    <span className="text-emerald-400">curl</span>
                    <span className="text-slate-400"> -H </span>
                    <span className="text-amber-300">{'"X-API-Key: dvt_abc123..."'}</span>
                    {"\n"}
                    <span className="text-slate-400">  https://api.devvault.io/secrets/myapp/production</span>
                    {"\n\n"}
                    <span className="text-slate-500">{"{"}</span>
                    {"\n"}
                    <span className="text-indigo-400">  {"\"STRIPE_KEY\""}</span>
                    <span className="text-slate-500">: </span>
                    <span className="text-emerald-300">{'"sk_live_...decrypted"'}</span>
                    {"\n"}
                    <span className="text-indigo-400">  {"\"DB_URL\""}</span>
                    <span className="text-slate-500">:     </span>
                    <span className="text-emerald-300">{'"mongodb+srv://...decrypted"'}</span>
                    {"\n"}
                    <span className="text-slate-500">{"}"}</span>
                  </code>
                </pre>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to manage secrets
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[rgb(var(--muted-foreground))] text-lg max-w-2xl mx-auto">
              From encryption to audit logging, DevVault gives you the tools to keep your secrets safe.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-[rgb(var(--primary))/0.1] flex items-center justify-center mb-4 group-hover:bg-[rgb(var(--primary))/0.15] transition-colors">
                      <feature.icon className="h-5 w-5 text-[rgb(var(--primary))]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-[rgb(var(--muted-foreground))] leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-[rgb(var(--secondary))]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              Simple. Secure. Fast.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              { step: "01", title: "Create a Project", desc: "Set up your project and choose environments." },
              { step: "02", title: "Add Secrets", desc: "Store API keys, tokens, and credentials securely." },
              { step: "03", title: "Access Anywhere", desc: "Use the dashboard or API to retrieve secrets in your pipeline." },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="text-center">
                <div className="text-5xl font-bold text-[rgb(var(--primary))] mb-4 opacity-30">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-[rgb(var(--muted-foreground))]">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-32 px-6 bg-[#030303] text-white overflow-hidden">
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
            <motion.p variants={fadeInUp} className="text-sm text-gray-400 uppercase tracking-widest mb-3">
              DevVault
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
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
                    <span className={`text-sm font-medium ${
                      plan.highlighted ? "text-blue-400" : "text-gray-400"
                    }`}>
                      {plan.name}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-lg text-gray-400">{plan.period}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href="/register" className="mt-auto">
                    <button className={`w-full py-3 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                      plan.highlighted
                        ? "bg-white text-black hover:bg-gray-200"
                        : "border border-white/20 text-white hover:bg-white/10"
                    }`}>
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
