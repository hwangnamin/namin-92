"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Form from "next/form";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { UsersIcon } from "@heroicons/react/24/outline";

import { supabase } from "@/utils/supabaseClient";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [navigation, setNavagation] = useState([]);
  const [selected, setSelected] = useState(
    searchParams.get("date") && searchParams.get("name")
  );
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState(dayjs());
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("wine");
  const [matching, setMatching] = useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setName("");
    setPassword("");
    setType("wine");
    setMatching(1);

    setOpen(false);
  };

  const readMeeting = async () => {
    const { data, error } = await supabase
      .from("meeting")
      .select("*")
      .eq("date", date)
      .order("created_at");

    data &&
      setNavagation(
        data.map((row) => {
          return {
            ...row,
            href: `admin/?date=${row.date}&name=${row.name}`,
            icon: UsersIcon,
            current: row.date + row.name === selected,
          };
        })
      );

    error && console.log(error);
  };

  const handleCreateMeeting = async () => {
    const { error } = await supabase.from("meeting").insert({
      date,
      name: name.trim(),
      password: password.trim(),
      type,
      matching,
    });

    if (error && error.code === "23505") {
      alert("해당 날짜에 같은 이름의 모임이 존재합니다.");

      return;
    }

    readMeeting();

    handleClose();
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    router.push("/signin");

    console.log(error);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      !data.session && router.push("/signin");

      error && console.log(error);
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    const handleReadMeeting = async () => {
      const { data, error } = await supabase
        .from("meeting")
        .select("*")
        .eq("date", date)
        .order("created_at");

      data &&
        setNavagation(
          data.map((row) => {
            return {
              ...row,
              href: `admin/?date=${row.date}&name=${row.name}`,
              icon: UsersIcon,
              current: row.date + row.name === selected,
            };
          })
        );

      error && console.log(error);
    };

    handleReadMeeting();
  }, [date, selected]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex">
        <div className="relative flex grow flex-col gap-y-5 overflow-y-auto max-w-3xs h-dvh border-r border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-900 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
          <div className="relative flex h-16 shrink-0 items-center">
            <DatePicker
              format="YYYY/MM/DD"
              value={date}
              onChange={(value) => setDate(value)}
            />
          </div>
          <nav className="relative flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <div className="text-xs/6 font-semibold text-gray-400">
                  미팅
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white"
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                        )}
                        onClick={() => setSelected(item.date + item.name)}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            item.current
                              ? "text-indigo-600 dark:text-white"
                              : "text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white",
                            "size-6 shrink-0"
                          )}
                        />
                        {item.name}
                        {item.count ? (
                          <span
                            aria-hidden="true"
                            className="ml-auto w-9 min-w-max rounded-full bg-white px-2.5 py-0.5 text-center text-xs/5 font-medium whitespace-nowrap text-gray-600 outline-1 -outline-offset-1 outline-gray-200 dark:bg-gray-900 dark:text-white dark:outline-white/15"
                          >
                            {item.count}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-auto text-center">
                    <Button variant="contained" onClick={handleClickOpen}>
                      미팅 만들기
                    </Button>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>
            로그아웃
          </Button>
        </div>
        <main>{children}</main>
      </div>
      <Dialog open={open}>
        <DialogTitle>미팅 만들기</DialogTitle>
        <DialogContent>
          <Form
            id="create-meeting"
            className="flex flex-col gap-4 p-2"
            action={handleCreateMeeting}
          >
            <TextField
              label="모임 이름"
              value={name}
              onChange={({ target }) => setName(target.value)}
              required
            />
            <TextField
              label="비밀번호"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
            />
            <FormControl>
              <InputLabel id="type">타입</InputLabel>
              <Select
                labelId="type"
                label="타입"
                value={type}
                onChange={({ target }) => setType(target.value)}
              >
                <MenuItem value="wine">와인</MenuItem>
                <MenuItem value="coffee">커피</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="matching">매칭 개수</InputLabel>
              <Select
                labelId="matching"
                label="매칭 개수"
                value={matching}
                onChange={({ target }) => setMatching(target.value)}
              >
                <MenuItem value={1}>1명</MenuItem>
                <MenuItem value={2}>2명</MenuItem>
                <MenuItem value={3}>3명</MenuItem>
                <MenuItem value={4}>4명</MenuItem>
                <MenuItem value={5}>5명</MenuItem>
              </Select>
            </FormControl>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button type="submit" form="create-meeting">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
