import { RegisterForm } from "@/components/auth/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-sm p-4">
      <h2 className="mb-4 text-center text-xl font-bold text-fb-text">
        Cria a tua conta
      </h2>
      <RegisterForm />
    </Card>
  );
}
