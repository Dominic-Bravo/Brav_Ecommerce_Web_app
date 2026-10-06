import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Join BRAV and start shopping."
    >
      <SignupForm />
    </AuthLayout>
  );
}