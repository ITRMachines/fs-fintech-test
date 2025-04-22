'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import axios from 'axios'
import { useState } from "react";
const formSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or Phone is required"),
  password: z.string().min(1, "Password is required"),
});

interface LoginProps {
    onLogin: (values: z.infer<typeof formSchema>) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const registerUserBackend = async (idToken: any, values: any) => {
    try {
      setSuccess(false)
      setError(null)
      const resp = await axios.post('http://localhost:3001/api/users', {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
      });
  
      if(resp) {
        console.log(resp)
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAtPfBiIIxChMmjn4zytJvxfpM8n9kdHvY",
        {
          email: values.emailOrPhone,
          password: values.password,
          returnSecureToken: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Firebase login response:", response.data);
      let userData = localStorage.getItem('userData');
      let userCredentials = localStorage.getItem('user');
      console.log(userData);

      if(userData !==null && userCredentials !==null ){
        userData = JSON.parse(userData)
        userCredentials= JSON.parse(userCredentials)
        await registerUserBackend(userCredentials.idToken, userData)
        onLogin(values);
      }

    } catch (err: any) {
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
        <CardTitle>Login</CardTitle>
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
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email or phone" {...field} />
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
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" >Login</Button>
            <Link href="/register">
              <Button type="button" variant="link">
                Register
              </Button>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default Login