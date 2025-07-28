import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | ERP Suite - Create New Password",
  description: "Create a new password for your ERP Suite account.",
};

export default function ResetPassword() {
  return <ResetPasswordForm />;
}