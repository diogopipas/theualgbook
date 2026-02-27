export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-fb-gray-bg">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-fb-blue">theUALGbook</h1>
        <p className="mt-2 text-lg text-fb-text-secondary">
          Conecta-te com a comunidade da UAlg
        </p>
      </div>
      {children}
    </div>
  );
}
