"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Eye, EyeOff, LoaderCircleIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/common/icons"
import { toast } from "sonner"

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
})

type LoginSchemaType = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    })

    async function onSubmit(values: LoginSchemaType) {
        setIsProcessing(true)
        setError(null)

        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid email or password")
                toast.error("Invalid email or password")
            } else {
                toast.success("Signed in successfully!")
                router.push("/")
                router.refresh()
            }
        } catch (err: any) {
            const errorMessage = err.message || "An unexpected error occurred."
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="block w-full space-y-5"
                >
                    <div className="space-y-1.5 pb-3">
                        <h1 className="text-2xl font-semibold tracking-tight text-center">
                            Sign In to Stock
                        </h1>
                        <p className="text-sm text-muted-foreground text-center">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <div className="flex flex-col gap-3.5">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            className="w-full"
                        >
                            <Icons.googleColorful className="mr-2 h-4 w-4" />
                            Sign in with Google
                        </Button>
                    </div>

                    <div className="relative py-1.5">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">or</span>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertIcon>
                                <AlertCircle className="h-4 w-4" />
                            </AlertIcon>
                            <AlertTitle>{error}</AlertTitle>
                        </Alert>
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="name@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <div className="relative">
                                    <Input
                                        placeholder="Your password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    >
                                        {passwordVisible ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal text-muted-foreground">
                                        Remember me
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                        <Link
                            href="/forgot-password"
                            className="text-sm text-muted-foreground hover:text-primary"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isProcessing}>
                        {isProcessing ? (
                            <>
                                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </Form>

            <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                    Sign Up
                </Link>
            </div>
        </div>
    )
}
