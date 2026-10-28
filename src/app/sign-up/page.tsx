'use client'

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const handleSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const user = Object.fromEntries(formData.entries()) as { name: string, email: string, password: string, image: string };
    console.log(user)

    const { data, error } = await authClient.signUp.email({
      ...user,
      callbackURL: '/',
    });
    if (data) {
      toast.success('Sign Up Successfully')
      redirect('/')

    }

    if (error) {
      toast.error('something went wrong')

    }
  }

  const handleGoogleSIgnIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });

  }
  const handleGithubSIgnIn = async () => {
    await authClient.signIn.social({
      provider: "github",
    });

  }

  return (
    <div>sign up</div>
  );

};

export default SignUpPage;