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
import { Building, User, Lock, Shield, Receipt } from "lucide-react";
import { ReusableForm } from "@/components/ReusableForm";
import { useApi } from "@/hooks/api-hooks";
import { useEffect, useState } from "react";

interface Partner {
  id: string;
  partnerType: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  tinNumber: string;
  logoUrl: string;
  taxRate: number;
  taxStatus: string;
  status: string;
  address: string;
  topMsg: string;
  bottomMsg: string;
}
export default function PartnerSettingsPage() {
  const { useApiPut, useApiQuery } = useApi();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [partnerData, setPartnerData] = useState<Partner | null>(null);
  const [loadingReceiptSetting, setLoadingReceiptSetting] = useState(false);
  // Fetch partner data
  const { data: partner, isLoading: loadingPartner } = useApiQuery<Partner>(
    ["partner-settings"],
    "/auth/update/company",
    {
    //   enabled: !!user?.partnerId
    }
  );


  const { mutateAsync: updatePartner } = useApiPut(
    ["update-partner"],
    "/auth/update/company"
  );

  useEffect(() => {
    if (partner) {
      setPartnerData(partner);
    }
  }, [partner]);


  const handlePartnerUpdate = async (values: any) => {
    await updatePartner(values)
      .then(() => {
        toast({
          title: "Partner information updated",
          description: "Partner details have been updated successfully.",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message ?? "There was an error updating partner information",
          variant: "error",
        });
      });
  };

  const handleTaxStatusUpdate = async (values: any) => {
    // if values.mrcCode contains letters and numbers only and is 11 characters long
   if (values.mrcCode && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{11}$/.test(values.mrcCode)) {
  toast({
    title: "Error",
    description: "MRC code must be exactly 11 characters long, contain both letters and numbers",
    variant: "error",
  });
  return;
}
    await updatePartner(values)
      .then((response) => {
        toast({
          title: "Tax settings updated",
          description: "Tax configuration has been updated successfully.",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message ?? "There was an error updating tax settings",
          variant: "error",
        });
      });
  };

  const handleEbmSettingsUpdate = async (values: any) => {
    setLoadingReceiptSetting(true);
    
    await updatePartner(values)
      .then(() => {
        toast({
          title: "EBM Settings updated",
          description: "Receipt configuration has been updated successfully.",
          variant: "success",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message ?? "There was an error updating EBM settings",
          variant: "error",
        });
      })
      .finally(() => {
        setLoadingReceiptSetting(false);
      })
  };

  // Check if user has admin privileges to edit partner settings
  const canEditPartnerSettings = user?.role === "ADMIN" || user?.role === "PARTNER_ADMIN";

  if (!canEditPartnerSettings) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Partner Settings</h1>
          <p className="text-muted-foreground">
            Manage partner information and configurations
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Access Denied</h3>
              <p>You don't have permission to access partner settings.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Partner Settings</h1>
        <p className="text-muted-foreground">
          Manage your partner information and business configurations
        </p>
      </div>

      <div className="grid gap-6">
        

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Update your company details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReusableForm
              size="full"
              fields={[
                {
                  label: "Company Name",
                  name: "companyName",
                  type: "text",
                  required: true,
                  colSpan: 2,
                },
                {
                  label: "Partner Type",
                  name: "partnerType",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Bar Restaurant", value: "BARRESTAURANT" },
                    { label: "Restaurant", value: "RESTAURANT" },
                    { label: "Hotel", value: "HOTEL" },
                    { label: "Cafe", value: "CAFE" },
                    { label: "Club", value: "CLUB" },
                    { label: "Other", value: "OTHER" },
                  ],
                },
                {
                  label: "Contact Email",
                  name: "contactEmail",
                  type: "email",
                  required: true,
                },
                {
                  label: "Contact Phone",
                  name: "contactPhone",
                  type: "number",
                  required: false,
                },
                {
                  label: "TIN Number",
                  name: "tinNumber",
                  type: "text",
                  required: false,
                  placeholder: "Tax Identification Number",
                },
                {
                  label: "Logo URL",
                  name: "logoUrl",
                  type: "text",
                  required: false,
                  placeholder: "https://example.com/logo.png",
                },
              ]}
              initialValues={{
                companyName: partnerData?.companyName || "",
                partnerType: partnerData?.partnerType || "BAR",
                contactEmail: partnerData?.contactEmail || "",
                contactPhone: partnerData?.contactPhone || "",
                tinNumber: partnerData?.tinNumber || "",
                logoUrl: partnerData?.logoUrl || "",
              }}
              onSubmit={handlePartnerUpdate}
              submitButtonText="Update Company Info"
            />
          </CardContent>
        </Card>

        {/* EBM Settings - Receipt Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              EBM Settings - Receipt Configuration
            </CardTitle>
            <CardDescription>
              Configure receipt data for your EBM (Electronic Billing Machine)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReusableForm
              size="full"
              fields={[
                {
                  label: "Company's Name",
                  name: "companyName",
                  type: "text",
                  required: true,
                  colSpan: 2,
                  placeholder: "Enter legal taxpayer name as registered",
                  explanation: "This will appear as the official business name on receipts"
                },
                {
                  label: "Shop Address",
                  name: "address",
                  type: "textarea",
                  required: true,
                  colSpan: 2,
                  placeholder: "Enter complete shop/business address",
                  explanation: "Full address that will be printed on receipts"
                },
                {
                  label: "Top Message",
                  name: "topMsg",
                  type: "textarea",
                  required: false,
                  colSpan: 2,
                  placeholder: "Welcome message, thank you note, or business motto",
                  explanation: "Message displayed at the top of receipts (optional)"
                },
                {
                  label: "Bottom Message",
                  name: "bottomMsg",
                  type: "textarea",
                  required: false,
                  colSpan: 2,
                  placeholder: "Thank you message, return policy, or contact information",
                  explanation: "Message displayed at the bottom of receipts (optional)"
                },
              ]}
              initialValues={{
                companyName: partner?.companyName || "",
                address: partner?.address || "",
                topMsg: partner?.topMsg || "",
                bottomMsg: partner?.bottomMsg || "",
              }}
              onSubmit={handleEbmSettingsUpdate}
              submitButtonText="Save Receipt Settings"
            />
          </CardContent>
        </Card>

        {/* Tax Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Tax Configuration
            </CardTitle>
            <CardDescription>
              Manage tax settings and rates for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReusableForm
              size="full"
              fields={[
                {
                  label: "Tax Rate (%)",
                  name: "taxRate",
                  type: "number",
                  required: true,
                  min: 0,
                  max: 100,
                  step: 0.1,
                  explanation: "The tax rate to be applied to all transactions",
                },
                {
                  label: "Tax VAT Status",
                  name: "taxStatus",
                  type: "select",
                  required: true,
                  options: [
                    { label: "Enabled", value: "ENABLED" },
                    { label: "Disabled", value: "DISABLED" },
                    // { label: "Exempt", value: "EXEMPT" },
                  ],
                  explanation: "Enable or disable tax calculation",
                },
                {
                label: "MRC Code( eg: CORE0000001)",
                name: "mrcCode",
                type: "text",
                required: true,
                min: 11,
                max: 11,
                placeholder: "Enter your MRC code",
                explanation: "Merchant Registration Code for tax purposes (11 characters mixing letters and numbers)",
                colSpan: 2,
                }
              ]}
              initialValues={{
                taxRate: partnerData?.taxStatus === "ENABLED" ? 18 : 0,
                taxStatus: partnerData?.taxStatus || "ENABLED",
                mrcCode: (partnerData as any)?.mrcCode || "",
              }}
              onSubmit={handleTaxStatusUpdate}
              submitButtonText="Update Tax Settings"
            />
          </CardContent>
        </Card>

        {/* Partner Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Partner Status
            </CardTitle>
            <CardDescription>
              View and manage your partner account status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      partnerData?.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : partnerData?.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : partnerData?.status === "SUSPENDED"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {partnerData?.status || "UNKNOWN"}
                  </span>
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Partner ID:</span>
                <p className="mt-1 font-mono text-xs">{partnerData?.id || "N/A"}</p>
              </div>
            </div>
            
            {partnerData?.status === "PENDING" && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Your partner account is pending approval. Some features may be limited until your account is activated.
                </p>
              </div>
            )}

            {partnerData?.status === "SUSPENDED" && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-300">
                  Your partner account has been suspended. Please contact support for more information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logo Preview */}
        {partnerData?.logoUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Logo Preview</CardTitle>
              <CardDescription>
                Current company logo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <img
                  src={partnerData.logoUrl}
                  alt="Company Logo"
                  className="w-32 h-32 object-contain border rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="text-sm text-muted-foreground">
                  <p>This logo will be used across your business applications,</p>
                  <p>reports, and customer-facing materials.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}