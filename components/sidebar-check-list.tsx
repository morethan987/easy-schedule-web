"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { desc } from "drizzle-orm"

// 数据从数据库中的Inbox表中获取
const items = [
  {
    id: "recents",
    label: "Recents",
    priority: "high",
    schedule: "13:00",
    description: "Your recent files",
  },
  {
    id: "home",
    label: "Home",
    priority: "meidum",
    schedule: "13:00",
    description: "Your home files",
  },
  {
    id: "applications",
    label: "Applications",
    priority: "low",
    schedule: "13:00",
    description: "Your application files",
  },
  {
    id: "desktop",
    label: "Desktop",
    priority: "none",
    schedule: "13:00",
    description: "Your desktop files",
  },
  {
    id: "downloads",
    label: "Downloads",
    priority: "high",
    schedule: "13:00",
    description: "Your downloaded files",
  },
  {
    id: "documents",
    label: "Documents",
    priority: "high",
    schedule: "13:00",
    description: "Your document files",
  },
] as const

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

export function CheckboxReactHookFormMultiple({
  type
}: { type: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: ["recents", "home"],
    },
  })

  return (
    <Form {...form}>
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">{type}</FormLabel>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                        // TODO: 加一个onClick事件，右侧侧边栏展开任务详情
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                        <FormDescription>
                          {item.description}
                        </FormDescription>
                        </div>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
    </Form>
  )
}
