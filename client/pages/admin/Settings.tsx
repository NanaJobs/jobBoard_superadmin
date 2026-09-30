import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Save, Sparkles, CheckCircle2 } from "lucide-react";

export default function Settings() {
  const [platformName, setPlatformName] = useState("Nana jobs Super Admin");
  const [supportEmail, setSupportEmail] = useState("support@jobboard.com");
  const [feeRate, setFeeRate] = useState("5.0");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Platform Configuration & Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage general platform parameters, email services, and marketplace monetization.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              General Platform Settings
            </CardTitle>
            <CardDescription className="text-xs">
              Basic branding and operational configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {saved && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  Settings saved successfully!
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Platform Brand Name</label>
                <Input
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">System Support Email</label>
                <Input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Marketplace Fee Rate (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={feeRate}
                  onChange={(e) => setFeeRate(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save System Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
