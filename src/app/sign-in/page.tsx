'use client'

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const SignInPage = () => {
  const handleSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const user = Object.fromEntries(formData.entries()) as { email: string, password: string, };

    const { data, error } = await authClient.signIn.email({
      ...user,
      callbackURL: '/',
    });
    if (data) {
      toast.success('Sign In Successfully')

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
    <div>sign in</div>
  );
};

export default SignInPage;