'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import axios from 'axios';

const formSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or Phone is required"),
  password: z.string().min(1, "Password is required"),
});

interface LoginProps {
    onLogin: (values: z.infer<typeof formSchema>) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailPhone: values.emailOrPhone,
          password: values.password
        })
      });

      const data = await response.json();
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Error en credenciales');
        // console.log('Error en login:', errorData);
        // throw new Error(errorData.error || 'Error en credenciales');
      }
  
      onLogin(values);
      router.push('/'); // Redirige a ruta protegida
      
    } catch (error:  any) {
      setError('Error al iniciar sesión');
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
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            <FormField
              control={form.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
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