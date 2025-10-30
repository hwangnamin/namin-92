"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@mui/material";
import { PaperClipIcon } from "@heroicons/react/20/solid";

import { supabase } from "@/utils/supabaseClient";

export default function Admin() {
  const searchParams = useSearchParams();

  const date = searchParams.get("date");
  const name = searchParams.get("name");

  const [flag, setFlag] = useState(false);
  const [detail, setDetail] = useState({});

  const checkFlag = async () => {
    const { data, error } = await supabase.from("meeting").select("flag");

    error && console.log(error);

    setFlag(data.some((item) => item.flag === true));
  };

  const readMeeting = async () => {
    const { data, error } = await supabase
      .from("meeting")
      .select("*")
      .eq("date", date)
      .eq("name", name);

    data && setDetail(data[0]);

    error && console.log(error);
  };

  const handleUpdateStart = async () => {
    const { error } = await supabase
      .from("meeting")
      .update({ flag: true })
      .eq("date", date)
      .eq("name", name);

    error && console.log(error);

    checkFlag();
    readMeeting();
  };

  const handleUpdateFinish = async () => {
    const { error } = await supabase
      .from("meeting")
      .update({ flag: false })
      .eq("date", date)
      .eq("name", name);

    error && console.log(error);

    checkFlag();
    readMeeting();
  };

  useEffect(() => {
    const initReadMeeting = async () => {
      const { data, error } = await supabase
        .from("meeting")
        .select("*")
        .eq("date", date)
        .eq("name", name);

      data && setDetail(data[0]);

      error && console.log(error);
    };

    const checkFlag = async () => {
      const { data, error } = await supabase.from("meeting").select("flag");

      error && console.log(error);

      setFlag(data.some((item) => item.flag === true));
    };

    date && name && initReadMeeting();
    date && name && checkFlag();
  }, [date, name]);

  return (
    <div className="p-8 max-w-7xl">
      {date && name && (
        <>
          <div className="px-4 sm:px-0">
            <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">
              {detail.name}&nbsp;
              <span className="text-red-400">{detail.flag && "진행중"}</span>
            </h3>
            <p className="mt-1 max-w-2xl text-sm/6 text-gray-500 dark:text-gray-400">
              {detail.date}
            </p>
            <div className="flex gap-2">
              <Button
                color="success"
                onClick={handleUpdateStart}
                disabled={flag}
              >
                미팅 시작
              </Button>
              <Button
                color="error"
                onClick={handleUpdateFinish}
                disabled={!detail.flag}
              >
                미팅 종료
              </Button>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-100 dark:border-white/10">
            <dl className="divide-y divide-gray-100 dark:divide-white/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  비밀번호
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                  {detail.password}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  타입
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                  {detail.type === "wine" && "와인"}
                  {detail.type === "coffee" && "커피"}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  매칭 인원
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                  {detail.matching}명
                </dd>
              </div>
              {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Salary expectation
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                  $120,000
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  About
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">
                  Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                  incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
                  consequat sint. Sit id mollit nulla mollit nostrud in ea
                  officia proident. Irure nostrud pariatur mollit ad adipisicing
                  reprehenderit deserunt qui eu.
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Attachments
                </dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0 dark:text-white">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200 dark:divide-white/5 dark:border-white/10"
                  >
                    <li className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-gray-400 dark:text-gray-500"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium text-gray-900 dark:text-white">
                            resume_back_end_developer.pdf
                          </span>
                          <span className="shrink-0 text-gray-400 dark:text-gray-500">
                            2.4mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 shrink-0">
                        <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-gray-400 dark:text-gray-500"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium text-gray-900 dark:text-white">
                            coverletter_back_end_developer.pdf
                          </span>
                          <span className="shrink-0 text-gray-400 dark:text-gray-500">
                            4.5mb
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 shrink-0">
                        <a
                          href="#"
                          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div> */}
            </dl>
          </div>
        </>
      )}
    </div>
  );
}
