'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import * as React from "react"
import { Inbox, History, CalendarCheck } from "lucide-react"
import { NavUser } from "@/components/sidebar-user-nav"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@/components/icons"
import { DatePickerForm } from "@/components/ui/date-picker"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { CheckboxAdd } from './ui/checkbox';
import { InboxList } from './sidebar-check-list';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { SidebarHistory } from './sidebar-history';


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/public/images/figure_transparent.png",
  },
  navMain: [
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Calendar",
      url: "#",
      icon: CalendarCheck,
      isActive: false,
    },
    {
      title: "History",
      url: "#",
      icon: History,
      isActive: false,
    },
  ],
}

export function AppSidebar({
  user,
  ...props
}: { user: User | undefined } & React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const { setOpen } = useSidebar()
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              {user && <NavUser user={user} />}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              <DatePickerForm />
              {/* TODO:增加calender界面*/}
              {activeItem.title === "Inbox" &&
                <div className="space-y-4">
                  <InboxList type={'Work'} />
                  {/* 在工作列表的下面添加一个特殊的任务，用于创建新的工作任务 */}
                  <CheckboxAdd type={'Work'} />
                  <InboxList type={'Personal'} />
                  {/* 在个人事项列表的下面添加一个特殊的任务，用于创建新的个人任务 */}
                  <CheckboxAdd type={'Personal'} />
                </div>
              }
              {activeItem.title === "History" && <SidebarHistory user={user} />}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
