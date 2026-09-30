import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Send, CheckCircle2, Sparkles } from "lucide-react";

export default function Emails() {
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");
  const [testSent, setTestSent] = useState(false);

  const templates = [
    { id: "welcome", name: "Welcome & Email Verification", subject: "Verify your email address - Nana jobs", desc: "Sent upon registration with token verification link." },
    { id: "reset", name: "Password Reset Request", subject: "Reset your password", desc: "Contains one-time secure password recovery link." },
    { id: "app_received", name: "Application Received Confirmation", subject: "Your application has been received", desc: "Sent to applicant when submitting job application." },
    { id: "status_update", name: "Application Status Update", subject: "Update regarding your application", desc: "Sent when employer moves candidate through hiring pipeline." },
  ];

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Transactional Email Templates
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure automated email notifications and user delivery templates.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3">
          {templates.map((tpl) => (
            <Card
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`cursor-pointer transition border-border/70 ${
                selectedTemplate === tpl.id ? "border-primary bg-primary/5 shadow-md" : "hover:border-primary/40"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Mail className={`h-4 w-4 ${selectedTemplate === tpl.id ? "text-primary" : "text-muted-foreground"}`} />
                  <h4 className="font-bold text-sm text-foreground">{tpl.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{tpl.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-2">
          {(() => {
            const current = templates.find((t) => t.id === selectedTemplate) || templates[0];
            return (
              <Card className="border-border/70 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{current.name}</CardTitle>
                      <CardDescription className="text-xs">Subject: {current.subject}</CardDescription>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold">
                      Active Template
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {testSent && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-500 font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      Test email dispatched successfully!
                    </div>
                  )}

                  <div className="rounded-xl border border-border p-5 bg-muted/40 font-mono text-xs text-foreground space-y-3 leading-relaxed">
                    <p className="font-bold text-primary">Hi {"{{ user.first_name }}"},</p>
                    <p>Thank you for being a valued member of the Nana jobs platform.</p>
                    <p>We are notifying you regarding action: <strong>{current.subject}</strong>.</p>
                    <div className="py-2">
                      <span className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-sans font-bold text-xs">
                        Action Button
                      </span>
                    </div>
                    <p className="text-muted-foreground text-[11px]">If you did not make this request, you can safely ignore this email.</p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSendTest} className="gap-2" size="sm">
                      <Send className="h-3.5 w-3.5" />
                      Send Test Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      </div>
    </AdminLayout>
  );
}
