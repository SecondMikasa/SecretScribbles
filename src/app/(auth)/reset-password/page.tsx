"use client";
import { useState, useEffect } from "react";
import { Lock, Key, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ResetPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      identifier: "",
      code: "",
      password: "",
    },
  });

  useEffect(() => {
    // Get identifier from localStorage if available
    const storedIdentifier = localStorage.getItem("resetPasswordIdentifier");
    if (storedIdentifier) {
      form.setValue("identifier", storedIdentifier);
    } else {
      // If no identifier is stored, redirect to forgot password page
      router.push("/forgot-password");
    }
  }, [form, router]);

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/reset-password", data);
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Password reset successfully! Please sign in with your new password.",
        });
        // Clear the stored identifier
        localStorage.removeItem("resetPasswordIdentifier");
        router.push("/sign-in");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left section - Illustration/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 justify-center items-center p-12">
        <div className="max-w-lg text-white">
          <h1 className="text-5xl font-bold mb-6">Reset Password</h1>
          <p className="text-xl mb-8">
            Enter the verification code sent to your email and your new password.
          </p>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-4">
                <Key className="h-6 w-6" />
              </div>
              <p className="text-lg">Enter the 6-digit verification code</p>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-4">
                <Lock className="h-6 w-6" />
              </div>
              <p className="text-lg">Create a strong new password</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right section - Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600">
              Enter the verification code and your new password
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Username or Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your username or email"
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Key className="h-5 w-5" />
                        </div>
                        <Input
                          className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Lock className="h-5 w-5" />
                        </div>
                        <Input
                          className="pl-10 bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          type="password"
                          placeholder="Enter your new password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Resetting...
                  </>
                ) : (
                  <>
                    Reset Password <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6 text-gray-600">
            <p>
              Didn&apos;t receive the code?{" "}
              <Link
                href="/forgot-password"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Send again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage