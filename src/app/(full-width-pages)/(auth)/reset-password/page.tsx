import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Suspense } from 'react';

export const metadata = {
  title: "Reset Password | Unibase ERP - Create New Password",
  description: "Create a new password for your Unibase ERP account.",
};

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}