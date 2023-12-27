"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Container from "./ui/Container";
import Link from "next/link";

type TAuthenticationProps = {
    mode: "login" | "registration";
};

export default function Authentication({ mode }: TAuthenticationProps) {
    const [authenticationEmail, setAuthenticationEmail] = useState("");
    const [authenticationPassword, setAuthenticationPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const supabase = createClientComponentClient();

    const signUp = async () => {
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: authenticationEmail,
            password: authenticationPassword,
            // options: {
            //     emailRedirectTo: ''
            // }
        });

        if (error) {
            throw error;
        }

        const { error: accountError } = await supabase.from("accounts").insert([
            {
                account_name: data.user?.email, // Initially assign their email as their account name
                account_type: "Student",
                account_uid: data.user?.id, // Their unique identifier
            },
        ]);

        if (accountError) throw accountError;

        setLoading(false);
        router.push("/");
    };

    const signIn = async () => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: authenticationEmail,
            password: authenticationPassword,
        });

        setLoading(false);

        if (error) throw error;

        router.push("/");
    };

    return (
        <Container stylings='flex flex-col justify-center items-center tracking-wide'>
            <form
                action='/auth/callback'
                onSubmit={(e) => e.preventDefault()}
                className='bg-white shadow-xl rounded md:w-96'
            >
                <header className='w-full flex justify-center items-center py-5 bg-[#1c1c1c] rounded-t'>
                    <h1 className='text-2xl font-bold'>OlivFeedbacks</h1>
                </header>

                <section className='px-9 py-16'>
                    <div className='w-full flex flex-col justify-start'>
                        <h3 className='text-slate-400 font-semibold text-xs'>
                            Email
                        </h3>
                        <input
                            type='text'
                            className='border py-1 px-3 text-slate-500 focus:border-blue-500 focus:outline-none rounded mt-2'
                            name='email'
                            value={authenticationEmail}
                            onChange={(e) =>
                                setAuthenticationEmail(e.target.value)
                            }
                        />
                    </div>

                    <div className='w-full flex flex-col justify-start mt-5'>
                        <h3 className='text-slate-400 font-semibold text-xs'>
                            Password
                        </h3>
                        <input
                            type='password'
                            className='border py-1 px-3 text-slate-500 focus:border-blue-500 focus:outline-none rounded mt-2'
                            name='password'
                            value={authenticationPassword}
                            onChange={(e) =>
                                setAuthenticationPassword(e.target.value)
                            }
                        />
                    </div>

                    <button
                        onClick={() => (mode === "login" ? signIn() : signUp())}
                        disabled={loading}
                        className={`font-semibold rounded ${
                            loading
                                ? "bg-green-700 text-slate-200 border-green-400"
                                : "bg-green-500"
                        } hover:bg-green-700 hover:text-slate-200 border border-green-500 transition ease-in-out duration-300 text-center w-full py-2 mt-5`}
                    >
                        {mode === "login" ? "Login" : "Register"}
                    </button>
                </section>

                <footer className='w-full flex items-center justify-end px-4 pb-2'>
                    <Link
                        href={mode === "login" ? "/register" : "/login"}
                        className='text-gray-400 font-semibold text-sm'
                    >
                        {mode === "login"
                            ? "Register an account"
                            : "Login with an account"}
                    </Link>
                </footer>
            </form>
        </Container>
    );
}
