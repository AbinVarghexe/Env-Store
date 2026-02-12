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
    price: "$0",
    period: "forever",
    features: ["3 Projects", "1 Team Member", "All Environments", "AES-256 Encryption", "Audit Logs"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    features: ["20 Projects", "Team Access", "API Tokens", "Priority Support", "Advanced Analytics"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "per month",
    features: ["Unlimited Projects", "Unlimited Members", "SSO Integration", "Dedicated Support", "SLA Guarantee"],
    cta: "Contact Sales",
    highlighted: false,
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
      <nav className="fixed top-0 w-full z-50 bg-[rgb(var(--background))/0.8] backdrop-blur-xl border-b border-[rgb(var(--border))]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-[rgb(var(--primary))]" />
            <span className="text-xl font-bold tracking-tight">DevVault</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition-colors">
              Pricing
            </a>
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Start Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
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
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              Secure your
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent"> environment variables</span>.
              <br />The right way.
            </motion.h1>
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
            className="mt-20 max-w-2xl mx-auto"
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
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[rgb(var(--muted-foreground))] text-lg">
              Start free, upgrade as you grow.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {plans.map((plan) => (
              <motion.div key={plan.name} variants={fadeInUp}>
                <Card
                  className={`h-full relative ${
                    plan.highlighted
                      ? "border-[rgb(var(--primary))] shadow-lg shadow-[rgb(var(--primary))/0.1] scale-105"
                      : ""
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-[rgb(var(--muted-foreground))]"> /{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/register">
                      <Button
                        variant={plan.highlighted ? "default" : "outline"}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
