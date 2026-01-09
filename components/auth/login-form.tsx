// "use client";

// import type React from "react";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/lib/store/auth-store";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { LoadingSpinner } from "../ui/loading-spinner";
// export function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const login = useAuthStore((state) => state.login);
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     setIsLoading(true);
//     e.preventDefault();
//     setError("");

//     const user = await login(email, password);
//     if (user !== null) {
//       if (user.partnerType === "BARRESTAURANT" && user?.role === "MANAGER") {
//         router.replace("/dashboard/bar/manager");
//       } else if (
//         user.partnerType === "BARRESTAURANT" &&
//         user?.role === "CHEF"
//       ) {
//         router.replace("/dashboard/bar/chef");
//       }else if( user.partnerType === "BARRESTAURANT" && user?.role === "PARTNER_ADMIN"){
//         router.replace("/dashboard/bar/partner");
//       }
//       if (user.partnerType === "BARRESTAURANT" && user?.role === "WAITER") {
//         router.replace("/dashboard/bar/waiters");
//       }
//     } else {
//       setError("Invalid email or password");
//     }
//     setIsLoading(false);
//   };

//   return (
//     <Card className="w-full max-w-md border-border/50 mx-auto shadow-lg mt-20">
//       <CardHeader>
//         <CardTitle className="text-2xl">Sign In</CardTitle>
//         <CardDescription className="text-muted-foreground">
//           Enter your credentials to access the dashboard
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="admin@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="bg-background"
//               disabled={isLoading}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               disabled={isLoading}
//               className="bg-background"
//             />
//           </div>
//           {error && <p className="text-sm text-destructive">{error}</p>}
//           <Button
//             type="submit"
//             className="w-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
//             disabled={isLoading}
//           >
//             {isLoading && <LoadingSpinner size="sm" />}
//             Sign In
//           </Button>
//           {/* <div className="mt-4 space-y-2 text-xs text-muted-foreground">
//             <p className="font-medium">Demo Accounts:</p>
//             <p>Admin: admin@example.com</p>
//             <p>Distributor (Bar): john@bar.com</p>
//             <p>Distributor (Market): sarah@market.com</p>
//             <p className="mt-2">Password for all: password</p>
//           </div> */}
//         </form>
//       </CardContent>
//     </Card>
//   );
// }





"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Partnertype, Role } from "@prisma/client";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if(user){
     return redirect(user.role, user.partnerType);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    setError("");
    const user = await login(email, password);
    if (user !== null) {
     redirect(user.role, user.partnerType);
    setIsLoading(false);
  }else{
    setIsLoading(false);
    setError("Invalid email or password");
  };
}

  return (
    <div className="min-h-[100vh] flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md border-border/40 mx-auto shadow-xl rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg 
              className="h-6 w-6 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">Welcome Back</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 py-2.5 px-4 rounded-lg"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 py-2.5 px-4 rounded-lg"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed py-2.5 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </Button>
          </form>
          
          {/* Uncomment if you want to show demo accounts */}
          {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>👨‍💼 Admin: <span className="font-mono">admin@example.com</span></p>
              <p>🍷 Bar Manager: <span className="font-mono">john@bar.com</span></p>
              <p>🛒 Market Manager: <span className="font-mono">sarah@market.com</span></p>
              <p className="pt-2 font-medium">🔑 Password for all: <span className="font-mono">password</span></p>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}

 function redirect(role: Role, type: Partnertype) {
  switch (role) {
    case "PARTNER_ADMIN":
      if (type === "BARRESTAURANT" || type === "RESTAURANT") {
        window.location.href = "/dashboard/bar/partner";
      }
      break;
    case "CHEF":
      if (type === "BARRESTAURANT" || type === "RESTAURANT") {
        window.location.href = "/dashboard/bar/chef";
      }
      break;
    case "MANAGER":
      if (type === "BARRESTAURANT" || type === "RESTAURANT") {
        window.location.href = "/dashboard/bar/manager";
      }
      break;
    case "WAITER":
      if (type === "BARRESTAURANT" || type === "RESTAURANT") {
        window.location.href = "/dashboard/bar/waiters";
      }
      break;
    default:
      window.location.href = "/";
      break;
  }
  
}