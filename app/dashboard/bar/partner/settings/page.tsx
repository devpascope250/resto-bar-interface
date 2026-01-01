// "use client";

// import type React from "react";
// import { useAuthStore } from "@/lib/store/auth-store";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { User, Lock } from "lucide-react";
// import { ReusableForm } from "@/components/ReusableForm";
// import { useApi } from "@/hooks/api-hooks";
// export default function SettingsPage() {
//   const { useApiPut } = useApi();
//   const { user } = useAuthStore();
//   const { toast } = useToast();
//   const { mutateAsync: updateProfile } = useApiPut(
//     ["update-profile"],
//     "/auth/update/profile"
//   );

//   const { mutateAsync: updatePassword } = useApiPut(
//     ["update-password"],
//     "/auth/update/password"
//   );

//   const handleProfileUpdate = async (values: any) => {
//     await updateProfile(values)
//       .then(() => {
//         toast({
//           title: "Profile updated",
//           description:
//             "Your profile information has been updated successfully.",
//           variant: "success",
//         });
//       })
//       .catch((error) => {
//         toast({
//           title: "Error",
//           description:
//             error.message ?? "There is An Error While Updating Profile",
//           variant: "error",
//         });
//       });
//   };

//   const handlePasswordChange = async (values: any) => {
//     await updatePassword(values)
//       .then(() => {
//         toast({
//           title: "Password changed",
//           description: "Your password has been changed successfully.",
//           variant: "success",
//         });
//       })
//       .catch((error) => {
//         toast({
//           title: "Error",
//           description:
//           error.message ?? "There is An Error While Updating Password",
//           variant: "error",
//         });
//       });
//   };

//   return (
//     <div className="p-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Settings</h1>
//         <p className="text-muted-foreground">
//           Manage your account settings and preferences
//         </p>
//       </div>
//       <div className="grid gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Profile Information
//             </CardTitle>
//             <CardDescription>Update your personal information</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ReusableForm
//               size="full"
//               fields={[
//                 {
//                   label: "First Name",
//                   name: "firstName",
//                   type: "text",
//                   required: true,
//                 },
//                 {
//                   label: "Last Name",
//                   name: "lastName",
//                   type: "text",
//                   required: true,
//                 },
//                 {
//                   label: "Email",
//                   name: "email",
//                   type: "email",
//                   required: true,
//                   colSpan: 2,
//                 },
//               ]}
//               initialValues={{
//                 firstName: user?.name || "",
//                 lastName: user?.lastName || "",
//                 email: user?.email || "",
//               }}
//               onSubmit={handleProfileUpdate}
//               submitButtonText="Update profile"
//             />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Lock className="h-5 w-5" />
//               Change Password
//             </CardTitle>
//             <CardDescription>
//               Update your password to keep your account secure
//             </CardDescription>
//           </CardHeader>
//           <CardContent> 
//             <ReusableForm
//               fields={[
//                 {
//                   label: "Current Password",
//                   name: "currentPassword",
//                   type: "password",
//                   required: true,
//                   colSpan: 2,
//                 },
//                 {
//                   label: "New Password",
//                   name: "newPassword",
//                   type: "password",
//                   required: true,
//                 },
//                 {
//                   label: "Confirm Password",
//                   name: "confirmPassword",
//                   type: "password",
//                   required: true,
//                 },
//               ]}
//               initialValues={{
//                 currentPassword: "",
//                 newPassword: "",
//                 confirmPassword: "",
//               }}
//               onSubmit={handlePasswordChange}
//               size="full"
//               submitButtonText="Update Password"
//             />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }




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
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Key, Eye, EyeOff, Copy, Check } from "lucide-react";
import { ReusableForm } from "@/components/ReusableForm";
import { useApi } from "@/hooks/api-hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { useApiPut, useApiQuery, useApiPost } = useApi();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  // State for API key section
  const [showApiKey, setShowApiKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••");
  const [copied, setCopied] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const { mutateAsync: updateProfile } = useApiPut(
    ["update-profile"],
    "/auth/update/profile"
  );

  const { mutateAsync: updatePassword } = useApiPut(
    ["update-password"],
    "/auth/update/password"
  );

  // Fetch API key (this would be your actual endpoint)
  const { data: apiKeyData, refetch: fetchApiKey } = useApiQuery<{ apiKey: string }>(
    ["api-key"],
    "/auth/api-key",
    {
      enabled: false, // Don't fetch automatically
    }
  );

  const { mutateAsync: verifyPassword} = useApiPost(['verify-password'], '/auth/verify-password');

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

  const handleVerifyPassword = async (values: { password: string }) => {
    setIsVerifying(true);
    setVerificationError("");
    try {
      await verifyPassword(values);
      // Fetch the actual API key
      const response = await fetchApiKey();
      if (response.data) {
        setApiKey(response.data.apiKey);
        setShowApiKey(true);
        toast({
          title: "Verification successful",
          description: "You can now view and copy your API key.",
          variant: "success",
        });
      }
    } catch (error) {
      setVerificationError("Invalid password. Please try again.");
      toast({
        title: "Verification failed",
        description: "Invalid password. Please try again.",
        variant: "error",
      })
      setIsVerifying(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKeyData?.apiKey || apiKey);
      setCopied(true);
      toast({
        title: "API Key copied",
        description: "API key has been copied to clipboard.",
        variant: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy API key to clipboard.",
        variant: "error",
      });
    }
  };

  const handleHideApiKey = () => {
    setShowApiKey(false);
    setApiKey("••••••••••••••••••••••••••••••");
    setVerificationError("");
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
        {/* API Key Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key
            </CardTitle>
            <CardDescription>
              Manage your API key for integration with external services
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showApiKey ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{apiKey}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVerifying(true)}
                    disabled={isVerifying}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Show API Key
                  </Button>
                </div>

                {isVerifying && (
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Confirm Your Password
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        For security reasons, please confirm your password to view your API key.
                      </p>
                    </div>
                    
                    <ReusableForm
                      fields={[
                        {
                          label: "Password",
                          name: "password",
                          type: "password",
                          required: true,
                          colSpan: 2,
                        },
                      ]}
                      initialValues={{ password: "" }}
                      onSubmit={handleVerifyPassword}
                      submitButtonText="Verify Password"
                      // cancelButtonText="Cancel"
                      // onCancel={handleHideApiKey}
                      size="full"
                    />
                    
                    {verificationError && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {verificationError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm break-all">{apiKey}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyApiKey}
                      disabled={copied}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleHideApiKey}
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Important:</strong> Keep your API key secure and never share it publicly. 
                    This key provides access to your account and data.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Information Card */}
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

        {/* Change Password Card */}
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