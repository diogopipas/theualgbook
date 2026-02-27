import { LoginForm } from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm p-4">
      <LoginForm />
    </Card>
  );
}
