"use client";

import type React from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Lock } from "lucide-react";
import { ReusableForm } from "@/components/ReusableForm";
import { useApi } from "@/hooks/api-hooks";
export default function SettingsPage() {
  const { useApiPut } = useApi();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { mutateAsync: updateProfile } = useApiPut(
    ["update-profile"],
    "/auth/update/profile"
  );

  const { mutateAsync: updatePassword } = useApiPut(
    ["update-password"],
    "/auth/update/password"
  );

  const handleProfileUpdate = async (values: any) => {
    await updateProfile(values)
      .then(() => {
        toast({
          title: "Profile updated",
          description:
            "Your profile information has been updated successfully.",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description:
            error.message ?? "There is An Error While Updating Profile",
          variant: "error",
        });
      });
  };

  const handlePasswordChange = async (values: any) => {
    await updatePassword(values)
      .then(() => {
        toast({
          title: "Password changed",
          description: "Your password has been changed successfully.",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description:
          error.message ?? "There is An Error While Updating Password",
          variant: "error",
        });
      });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <ReusableForm
              size="full"
              fields={[
                {
                  label: "First Name",
                  name: "firstName",
                  type: "text",
                  required: true,
                },
                {
                  label: "Last Name",
                  name: "lastName",
                  type: "text",
                  required: true,
                },
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  required: true,
                  colSpan: 2,
                },
              ]}
              initialValues={{
                firstName: user?.name || "",
                lastName: user?.lastName || "",
                email: user?.email || "",
              }}
              onSubmit={handleProfileUpdate}
              submitButtonText="Update profile"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent> 
            <ReusableForm
              fields={[
                {
                  label: "Current Password",
                  name: "currentPassword",
                  type: "password",
                  required: true,
                  colSpan: 2,
                },
                {
                  label: "New Password",
                  name: "newPassword",
                  type: "password",
                  required: true,
                },
                {
                  label: "Confirm Password",
                  name: "confirmPassword",
                  type: "password",
                  required: true,
                },
              ]}
              initialValues={{
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              onSubmit={handlePasswordChange}
              size="full"
              submitButtonText="Update Password"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
