import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <Card className="border-dashed border-border/70">
        <CardContent className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Construction className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {title} is coming soon
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            {description} Keep prompting to have this page built out.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
