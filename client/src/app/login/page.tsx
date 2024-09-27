"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Mail } from "lucide-react"
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const { status } = useSession();
  const {push} = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      push("/");
    }
  }, [status, push]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login to DisasterWatch</CardTitle>
          <CardDescription className="text-center">
            Choose your preferred login method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            onClick={() => signIn('google')}
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            Login with Gmail
          </Button>
          <Button
            variant="outline"
            onClick={() => signIn('facebook')}
            className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
          >
            <Facebook className="mr-2 h-4 w-4" />
            Login with Facebook
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center text-gray-600 mt-4 w-full">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
      <div className="fixed bottom-4 left-4">
        <h3 className="text-xs text-gray-600">Made with ❤️ by ASHISH SINGH</h3>
      </div>
    </div>
  )
}