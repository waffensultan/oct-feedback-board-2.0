import { getAccountInfoWithUID, getUserInfo } from "@/app/utils/supabaseUtils";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import AccountSection from "@/app/components/settings/AccountSection";
import PasswordSection from "@/app/components/settings/PasswordSection";

export default async function Settings() {
    const supabase = createServerComponentClient({ cookies });

    const { user } = await getUserInfo(supabase);
    const account = await getAccountInfoWithUID(supabase, user?.id!);

    return (
        <div className='w-full h-full flex justify-center items-center text-slate-700'>
            <article className='w-4/5 bg-white rounded-md shadow-xl'>
                <header className='w-full h-40 rounded-t-md bg-gradient-to-r from-green-500 via-lime-500 to-lime-500 flex justify-start items-center pl-5'>
                    <h1 className='text-5xl font-bold tracking-tight text-white'>
                        Settings | {account?.account_name}
                    </h1>
                </header>

                <div className='px-5 py-4 flex flex-row flex-wrap justify-around'>
                    <section>
                        <h3 className='font-semibold tracking-wider text'>
                            Password
                        </h3>
                        <PasswordSection />
                    </section>

                    <section>
                        <h3 className='font-semibold tracking-wider text'>
                            Account
                        </h3>
                        <AccountSection />
                    </section>
                </div>
            </article>
        </div>
    );
}
