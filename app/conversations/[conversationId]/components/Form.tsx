"use client";

import { HiPhoto } from "react-icons/hi2";

import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import useConversation from "@/hooks/useConversation";
import { EmojiPicker } from "@/components/emoji-picker";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form as UiForm,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { HiPaperAirplane } from "react-icons/hi";
import { useStore } from "@/hooks/store/inputStore";
import ReplyModal from "./ReplyModal";

const formSchema = z.object({
  message: z.string().min(1),
});

const Form = () => {
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);
  const { isInputFocused } = useStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    if (isInputFocused) {
      form.setFocus("message");
    }
  }, [isInputFocused]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    axios
      .post("/api/messages", {
        ...data,
        conversationId: conversationId,
      })
      .finally(() => {
        setIsLoading(false);
      });
    form.reset();
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result.info.secure_url,
      conversationId: conversationId,
    });
  };

  return (
    <>
        <ReplyModal />
      <div
        className="
        py-4 
        px-4 
        bg-dark-1 
        border-t 
        flex 
        items-center 
        gap-2 relative
        lg:gap-4 
        w-full
      "
      >
        <CldUploadButton
          options={{ maxFiles: 1 }}
          onUpload={handleUpload}
          uploadPreset="dcvagvaed"
        >
          <HiPhoto size={30} className="text-gray-50 hover:opacity-75" />
        </CldUploadButton>
        <UiForm {...form}>
          <form
            className="flex items-center gap-2 lg:gap-4 w-full "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full flex items-center">
                  {/* <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)} /> */}
                  <FormControl>
                    <div className="relative p-4 pb-6 w-full ">
                      <button
                        type="button"
                        onClick={() => {}}
                        className="absolute top-7 left-8 h-[24px] w-[24px] bg-primary-500 hover:bg-primary-500/70 transition rounded-full p-1 flex items-center justify-center"
                      >
                        <Plus className="text-white dark:text-[#313338]" />
                      </button>
                      <Input
                        disabled={isLoading}
                        className="px-14 py-6 bg-primary-500 hover:bg-primary-500/70 border-none border-0 focus-visible:ring-0 w-full rounded-full focus-visible:ring-offset-0 text-light-1 placeholder:text-light-1 dark:text-zinc-200"
                        placeholder={`Write a message`}
                        {...field}
                      />
                      <div className="absolute top-7 right-8">
                        <EmojiPicker
                          onChange={(emoji: string) =>
                            field.onChange(`${field.value}${emoji}`)
                          }
                        />
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="
            rounded-full 
            p-2 border-2
            bg-transparent 
            cursor-pointer 
            hover:opacity-75 
            transition
          "
            >
              <HiPaperAirplane size={18} className="text-white rotate-45" />
            </button>
          </form>
        </UiForm>
      </div>
    </>
  );
};

export default Form;
