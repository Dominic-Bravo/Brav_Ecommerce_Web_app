import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your BRAV account."
    >
      <LoginForm />
    </AuthLayout>
  );
}