'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
//import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form"; // Import types


const formSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or Phone is required"),
  password: z.string().min(1, "Password is required"),
});

// interface LoginProps {
//     onLogin: (values: z.infer<typeof formSchema>) => void;
// }

type LoginFormValues = z.infer<typeof formSchema>;


interface LoginProps {
  // This function will be called when the form is successfully submitted
  onLogin: (values: LoginFormValues) => void;
  // Optionally pass an initial error message from the server (e.g., from searchParams)
  initialError?: string;
}

const Login = ({ onLogin }: LoginProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
  //const handleValidSubmit: SubmitHandler<FormData> = (values) => {
    onLogin(values)
    console.log(values);
  }
  //const handleInvalidSubmit: SubmitErrorHandler<FormData> = (errors) => {
  //  console.error("Form invalid:", errors);
  //}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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


// --- NEW Page Component Wrapper (Default Export) ---

// Define the props expected by a Next.js Page component
// Note: For a static route like /login, `params` will be empty.
// We use the simplified (non-Promise) types which Next.js generally handles.
interface LoginPageProps {
  params: {}; // No dynamic route parameters for /login
  searchParams?: { // Optional search parameters
      // Example: ?error=InvalidCredentials
      error?: string;
      // Add other potential search params here
      [key: string]: string | string[] | undefined;
  };
}

// This is the component Next.js will render for the page route.
// It can be a Server Component (RSC) by default.
function LoginPage({ searchParams }: LoginPageProps) {

// Define the actual login logic handler here.
// This function will be passed to the <Login> client component.
// For real applications, this is where you'd use Server Actions
// or call your authentication API.
const handleLoginSubmit = async (values: LoginFormValues) => {
  // IMPORTANT: For Server Actions, uncomment the next line
  // 'use server'; // <--- Make this a Server Action

  console.log("Login attempt received on server/page:", values);
  // --- TODO: Implement your actual authentication logic ---
  // Example using Server Action (conceptual):
  // const result = await authenticateUser(values);
  // if (result.error) {
  //   // Redirect back to login with an error query parameter
  //   redirect(`/login?error=${encodeURIComponent(result.error)}`);
  // } else {
  //   // Redirect to dashboard or desired page upon success
  //   redirect('/dashboard');
  // }
  // --- End Example ---

  // Placeholder: Simulate success after a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Simulated login successful for:", values.emailOrPhone);
  // In a real app, you would redirect here upon success using next/navigation `redirect`
};

// Extract potential error message from searchParams to pass to the form
const initialError = searchParams?.error;

// Render the Login client component, passing the server-defined handler
// and any initial error message.
return (
  <div className="flex justify-center items-center min-h-screen">
     {/* You might want some centering container */}
    <Login onLogin={handleLoginSubmit} initialError={initialError} />
  </div>
);
}

export default LoginPage;