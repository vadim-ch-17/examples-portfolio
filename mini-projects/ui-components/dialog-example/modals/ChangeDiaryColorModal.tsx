import { useMutation, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import { PRESET_COLORS, TOAST_MESSAGES } from "@/constants";
import { journalService } from "@/services";
import type { JournalFormData } from "@/types";

import { HeaderModal } from "./components/HeaderModal";

interface JournalModalProps {
  nameDiary: string;
  id: number;
  colorDiary: string;
  type: "private" | "shared";
  close: () => void;
}

const DiaryColorModal = ({
  close,
  id,
  nameDiary,
  colorDiary,
  type,
}: JournalModalProps) => {
  const [color, setColor] = useState(colorDiary || PRESET_COLORS[1]);

  const queryClient = useQueryClient();

  const updateJournalMutation = useMutation({
    mutationFn: (data: JournalFormData & { id: number }) =>
      journalService.updateJournal(data.id.toString(), data),
    onSuccess: async (updated) => {
      queryClient.setQueryData(["journals"], (old: any) => {
        if (!Array.isArray(old)) return old;
        return old.map((j) =>
          j.id === id
            ? { ...j, color: updated.color, name: updated.name ?? j.name }
            : j
        );
      });
      await queryClient.invalidateQueries({ queryKey: ["journals"] });
      toast.success(TOAST_MESSAGES.diaryUpdateSuccess.text);
      // showToast(TOAST_MESSAGES.diaryUpdateSuccess);
      close();
    },
    onError: (error) => {
      console.error("Error updating diary:", error);
      toast.error(TOAST_MESSAGES.diaryUpdateError.text);
      // showToast(TOAST_MESSAGES.diaryUpdateError);
    },
  });

  const handleSubmit = async (color: string) => {
    setColor(color);
    await updateJournalMutation.mutateAsync({
      id,
      name: nameDiary,
      color,
      type,
    });
  };

  return (
    <div className="relative  bg-white rounded-2xl px-4 sm:px-[60px] pb-4 sm:pb-[60px] pt-10 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <HeaderModal title="Colors" onClose={close} />

      <form>
        <div className=" color-grid grid grid-cols-7 gap-[18px] mt-8 py-2">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              className={classNames(
                "w-8 h-8 cursor-pointer grid place-content-center rounded-full",
                {
                  "ring-[1px] ring-offset-[1px] ring-brand-secondary-250":
                    color === presetColor,
                }
              )}
              style={{ backgroundColor: presetColor }}
              onClick={() => {
                handleSubmit(presetColor);
              }}>
              {color === presetColor && (
                <Check className="text-white h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default DiaryColorModal;
