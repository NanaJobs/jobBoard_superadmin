import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Crown, AlertCircle, Sparkles } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (user.role === "admin" || user.role === "super_admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Access restricted to Super Administrators only.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 mb-4">
            <Crown className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Super Admin Console</h1>
          <p className="text-xs text-slate-400 mt-1">Platform operations, moderation, and infrastructure control</p>
        </div>

        <Card className="border-slate-800 bg-[#0e1424] text-slate-100 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Sign In to Administrator Account</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Enter your super admin credentials to manage the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Admin Email</label>
                <Input
                  type="email"
                  required
                  placeholder="admin@jobboard.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Password</label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold py-5"
              >
                {loading ? "Authenticating..." : "Access Admin Console →"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-slate-500 mt-6 flex items-center justify-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>Connected to Django API (Live Production / Local Backend)</span>
        </p>
      </div>
    </div>
  );
}
