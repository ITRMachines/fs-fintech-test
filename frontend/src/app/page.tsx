
'use client'
import Dashboard from '@/components/Dashboard';
import Login from '@/app/login/page';
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form"

//interface LoginProps {
//    onLogin: (values: z.infer<typeof formSchema>) => void;
//}


type Inputs = {
  emailOrPhone: string
  password: string
}


export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Start with user not logged in

  const handleLogout = () => {
    setIsLoggedIn(false); // Set user to logged out
    // Additional logic here like clearing local storage, etc.
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

//  const handleLogin = (values: {emailOrPhone: string, password: string}) => {
//    alert(JSON.stringify(values));
    // call fetch
    // if fetch success
    // call () => setIsLoggedIn(true)
    // else
    // call () => setIsLoggedIn(false) i guess.


  //}

  if (!isLoggedIn) {
    return <Login onLogin={onSubmit} />; // Redirect to login page
  }
  else{
    return (
      <div>
        <Dashboard/>
        <div>
            <p>Welcome to the dashboard!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }
}
