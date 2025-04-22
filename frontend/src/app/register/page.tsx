'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function Register () {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Boolean>(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setSuccess(false)
      setError(null)
      const resp = await axios.post('http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAtPfBiIIxChMmjn4zytJvxfpM8n9kdHvY', {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        returnSecureToken: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(resp) {
        console.log(resp)
        localStorage.setItem('user', JSON.stringify(resp.data))
        localStorage.setItem('userData', JSON.stringify(values))
        router.push('/')
        setSuccess(true)
      }
    } catch (err:any) {
      if (err.response && err.response.status === 400) {
        console.log("400 Error Response:", err.response.data.error.message);
        setError( err.response.data.error.message);
      }
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.error?.message || "Login failed");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (<Alert variant="destructive">
              <AlertTitle>Errors:</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>)}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
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
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Register</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
