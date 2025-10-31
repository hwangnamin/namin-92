"use client";

import { useState } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";

import { useForm } from "@/utils/context";
import { supabase } from "@/utils/supabaseClient";

export default function Home() {
  const router = useRouter();

  const { setDate, setMeetingName } = useForm();

  const [password, setPasswod] = useState("");

  const handleNext = async () => {
    const { data, error } = await supabase
      .from("meeting")
      .select()
      .eq("flag", true);

    if (password === data[0].password) {
      setDate(data[0].date);
      setMeetingName(data[0].name);

      router.push("/information");

      return;
    }

    alert("올바른 비밀번호를 입려해주세요");

    error && console.lor(error);
  };

  return (
    <Form className="p-4" action={handleNext}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12 dark:border-white/10">
          <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">
            설명
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
            This information will be displayed publicly so be careful what you
            share.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                오늘의 비밀번호
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 dark:bg-white/5 dark:outline-white/10 dark:focus-within:outline-indigo-500">
                  <input
                    id="password"
                    name="password"
                    type="text"
                    className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:bg-transparent dark:text-white dark:placeholder:text-gray-500"
                    value={password}
                    onChange={({ target }) => setPasswod(target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:focus-visible:outline-indigo-500"
        >
          다음
        </button>
      </div>
    </Form>
  );
}
