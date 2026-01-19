"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/ui/login-form"
import { SignupForm } from "@/components/ui/signup-form"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface AuthTabsProps {
    defaultTab?: "signin" | "signup"
}

export function AuthTabs({ defaultTab = "signin" }: AuthTabsProps) {
    const router = useRouter()

    const handleTabChange = (value: string) => {
        if (value === "signin") {
            router.replace("/signin")
        } else {
            router.replace("/signup")
        }
    }

    return (
        <div className="w-full max-w-[400px] mx-auto">
            <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="p-0">
                            <LoginForm />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card className="border-none shadow-none bg-transparent">
                        <CardContent className="p-0">
                            <SignupForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
