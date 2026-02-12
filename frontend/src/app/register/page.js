"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Loader2, ArrowLeft, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LiquidChrome from "@/components/LiquidChrome";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details?.join(", ") || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-r-3xl">
        <div className="absolute inset-0">
          <LiquidChrome
            baseColor={[0.1, 0.1, 0.2]}
            speed={0.3}
            amplitude={0.3}
            interactive={true}
          />
        </div>
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-10 flex items-center gap-2">
          <Shield className="h-7 w-7 text-white" />
          <span className="text-white text-xl font-bold tracking-tight">DevVault</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 xl:px-28">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
            Create Your Account to Get Started
          </h1>
          <div className="flex items-center gap-4 mt-5">
            <Link
              href="/"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/20">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all text-sm pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white rounded-xl px-5 py-4 text-sm font-medium flex items-center justify-center gap-3 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Start Creating
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-xs text-gray-600 leading-relaxed">
          By signing in, you agree to DevVault&apos;s{" "}
          <span className="text-gray-400 underline underline-offset-2 cursor-pointer">Terms of Service</span>,{" "}
          <span className="text-gray-400 underline underline-offset-2 cursor-pointer">Privacy Policy</span> and{" "}
          <span className="text-gray-400 underline underline-offset-2 cursor-pointer">Data Usage Properties</span>.
        </p>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mt-10">
          <Shield className="h-5 w-5 text-gray-600" />
          <span className="text-gray-600 text-sm font-semibold">DevVault</span>
        </div>
      </div>
    </div>
  );
}
