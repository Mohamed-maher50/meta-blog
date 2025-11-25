"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { Topics } from "@prisma/client";
import {
  ChooseTopicsSchema,
  ChooseTopicsSchemaTypes,
} from "@/schema/UserTopicsSchema";

import { useRouter } from "next/navigation";
import ToggleCheckBox from "@/components/miscellaneous/ToggleCheckBox";
import { ResponseSuccess } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import axiosClient from "@/lib/axios.client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ChooseTopics = () => {
  const form = useForm<ChooseTopicsSchemaTypes>({
    resolver: zodResolver(ChooseTopicsSchema),
    defaultValues: {
      topics: [],
    },
  });

  const [renderTopics, setRenderTopics] = useState<Topics[]>([]);
  const [showMore, setShowMore] = useState(false);
  const { update } = useSession();

  const { data, isLoading } = useSWR<ResponseSuccess<Topics[]>>(
    `/api/topics?limit=50&orderBy[]=-topPosition`,
    fetcher
  );
  const router = useRouter();
  const submitHandler = async (args: { topics: string[] }) => {
    try {
      const res = await axiosClient.post("/api/topics/choose", args);
      if (res.status == 200) {
        update({ topicsSelected: true }).then(() => {
          router.replace("/");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (data?.data) setRenderTopics((prev) => [...prev, ...data?.data]);
  }, [data?.data]);
  if (isLoading) return <div>loading...</div>;
  if (!data?.data) return <div>not Found any topics</div>;

  const selectedTopics = form.getValues("topics");
  const { checkTopics, unCheckTopics } = data.data.reduce<{
    checkTopics: Topics[];
    unCheckTopics: Topics[];
  }>(
    (prev, current) => {
      if (selectedTopics.includes(current.id)) prev.checkTopics.push(current);
      else prev.unCheckTopics.push(current);
      return prev;
    },
    {
      checkTopics: [],
      unCheckTopics: [],
    }
  );
  const startUnChecked = (renderTopics.length / 2) * +showMore;
  const endUnChecked = !showMore
    ? renderTopics.length / 2
    : renderTopics.length;

  return (
    <Form {...form}>
      <form
        className="gap-4 flex-col flex"
        onSubmit={form.handleSubmit(submitHandler, (e) => {
          Object.entries(e).map(([_, value]) => {
            toast.warning(value.message);
          });
        })}
      >
        <FormField
          control={form.control}
          name="topics"
          render={() => {
            return (
              <FormItem className="flex gap-1 max-w-lg mx-auto justify-center  flex-wrap">
                {checkTopics.map((item) => {
                  return (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="topics"
                      render={({ field }) => {
                        return (
                          <FormItem key={item.id}>
                            <FormControl>
                              <ToggleCheckBox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              >
                                <span>{item.label}</span>
                              </ToggleCheckBox>
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  );
                })}
                {unCheckTopics
                  .slice(startUnChecked, endUnChecked)
                  .map((item) => {
                    return (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="topics"
                        render={({ field }) => {
                          return (
                            <FormItem key={item.id}>
                              <FormControl>
                                <ToggleCheckBox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                >
                                  <span>{item.label}</span>
                                </ToggleCheckBox>
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    );
                  })}
              </FormItem>
            );
          }}
        />
        <Button
          type="button"
          variant={"link"}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Start over" : "Show more"}
        </Button>
        <Button
          disabled={!form.formState.isDirty || form.formState.isLoading}
          className="rounded-4xl !px-12 mx-auto block w-fit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default ChooseTopics;
