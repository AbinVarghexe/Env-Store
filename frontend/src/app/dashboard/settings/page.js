"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Shield, Sun, Moon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export default function SettingsPage() {
  const { user, fetchUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [showSetup2FA, setShowSetup2FA] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [secret2FA, setSecret2FA] = useState(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [loading2FA, setLoading2FA] = useState(false);
  const [error2FA, setError2FA] = useState("");

  const handleSetup2FA = async () => {
    setLoading2FA(true);
    setError2FA("");
    try {
      const { data } = await api.post("/auth/2fa/setup");
      setQrCode(data.qrCodeDataUrl);
      setSecret2FA(data.secret);
      setShowSetup2FA(true);
    } catch (err) {
      setError2FA(err.response?.data?.error || "Failed to set up 2FA");
    } finally {
      setLoading2FA(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading2FA(true);
    setError2FA("");
    try {
      await api.post("/auth/2fa/verify", { token: verifyCode });
      setShowSetup2FA(false);
      setQrCode(null);
      setVerifyCode("");
      fetchUser();
    } catch (err) {
      setError2FA(err.response?.data?.error || "Invalid code");
    } finally {
      setLoading2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    const code = prompt("Enter your 2FA code to disable:");
    if (!code) return;

    try {
      await api.post("/auth/2fa/disable", { token: code });
      fetchUser();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to disable 2FA");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        {/* Profile */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <p className="text-sm text-[rgb(var(--muted-foreground))]">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <p className="text-sm text-[rgb(var(--muted-foreground))]">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Plan</label>
              <Badge variant="secondary" className="capitalize">{user?.plan}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Two-Factor Auth */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {user?.twoFactorEnabled ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Enabled</Badge>
                  <span className="text-sm text-[rgb(var(--muted-foreground))]">
                    Your account is protected with 2FA
                  </span>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDisable2FA}>
                  Disable
                </Button>
              </div>
            ) : showSetup2FA ? (
              <div className="space-y-4">
                {qrCode && (
                  <div className="flex flex-col items-center gap-4">
                    <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 rounded-lg" />
                    <p className="text-xs text-[rgb(var(--muted-foreground))] text-center">
                      Scan this QR code with your authenticator app
                    </p>
                    {secret2FA && (
                      <div className="w-full p-3 bg-[rgb(var(--secondary))] rounded-lg">
                        <p className="text-xs text-[rgb(var(--muted-foreground))] mb-1">
                          Or enter this key manually:
                        </p>
                        <code className="text-sm font-mono break-all">{secret2FA}</code>
                      </div>
                    )}
                  </div>
                )}

                {error2FA && (
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                    {error2FA}
                  </div>
                )}

                <form onSubmit={handleVerify2FA} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Verification Code</label>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="000000"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      className="text-center text-xl tracking-widest font-mono max-w-xs"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading2FA}>
                      {loading2FA ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enable 2FA"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowSetup2FA(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <Button onClick={handleSetup2FA} disabled={loading2FA}>
                {loading2FA ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Set up 2FA
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize your theme preference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4 mr-2" /> Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4 mr-2" /> Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
              >
                System
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
