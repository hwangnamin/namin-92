"use client";

import { useState } from "react";
import Form from "next/form";
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
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { supabase } from "@/utils/supabaseClient";

const navigation = [
  { name: "Dashboard", href: "#", icon: HomeIcon, count: "5", current: true },
  { name: "Team", href: "#", icon: UsersIcon, current: false },
  {
    name: "Projects",
    href: "#",
    icon: FolderIcon,
    count: "12",
    current: false,
  },
  {
    name: "Calendar",
    href: "#",
    icon: CalendarIcon,
    count: "20+",
    current: false,
  },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout({ children }) {
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

  const handleAddMeeting = async () => {
    const { error } = await supabase
      .from("meeting")
      .insert({ date, name, password, type, matching });

    if (error && error.code === "23505") {
      alert("해당 날짜에 같은 이름의 모임이 존재합니다.");

      return;
    }

    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex gap-4">
        <div className="relative flex grow flex-col gap-y-5 overflow-y-auto max-w-3xs border-r border-gray-200 bg-white px-6 dark:border-white/10 dark:bg-gray-900 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
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
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white"
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                        )}
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
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs/6 font-semibold text-gray-400">
                  Your teams
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.name}>
                      <a
                        href={team.href}
                        className={classNames(
                          team.current
                            ? "bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white"
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                        )}
                      >
                        <span
                          className={classNames(
                            team.current
                              ? "border-indigo-600 text-indigo-600 dark:border-white/10 dark:text-white"
                              : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/15 dark:group-hover:border-white/20 dark:group-hover:text-white",
                            "flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5"
                          )}
                        >
                          {team.initial}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="-mx-6 mt-auto text-center">
                <Button variant="contained" onClick={handleClickOpen}>
                  미팅 만들기
                </Button>
              </li>
            </ul>
          </nav>
        </div>
        <main>{children}</main>
      </div>
      <Dialog open={open}>
        <DialogTitle>미팅 만들기</DialogTitle>
        <DialogContent>
          <Form
            id="add-meeting"
            className="flex flex-col gap-4 p-2"
            action={handleAddMeeting}
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
          <Button type="submit" form="add-meeting">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
