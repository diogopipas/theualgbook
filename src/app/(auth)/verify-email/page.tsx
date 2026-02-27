import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <Card className="w-full max-w-sm p-6 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fb-blue/10">
        <Mail className="h-8 w-8 text-fb-blue" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-fb-text">
        Verifica o teu email
      </h2>
      <p className="mb-4 text-sm text-fb-text-secondary">
        Enviámos um link de verificação para o teu email <strong>@ualg.pt</strong>.
        Verifica a tua caixa de entrada e clica no link para ativares a tua conta.
      </p>
      <p className="text-xs text-fb-text-muted">
        Não recebeste o email? Verifica a pasta de spam.
      </p>
      <div className="mt-4">
        <Link
          href="/login"
          className="text-sm font-semibold text-fb-link hover:underline"
        >
          Voltar ao login
        </Link>
      </div>
    </Card>
  );
}
