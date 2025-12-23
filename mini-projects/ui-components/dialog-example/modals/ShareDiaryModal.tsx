import { useMutation, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { Link } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

import { Button, DefaultLoader } from "@/components";
import { TOAST_MESSAGES } from "@/constants";
import { getUserInitials } from "@/helpers";
import { journalService } from "@/services";

import { HeaderModal } from "./components/HeaderModal";

interface ShareDiaryModalProps {
  close: () => void;
  diaryId: string;
  sharedWith?: { id: string; name: string; avatar?: string }[];
}

const ShareDiaryModal = ({
  close,
  diaryId,
  sharedWith = [],
}: ShareDiaryModalProps) => {
  const clientQuery = useQueryClient();
  const [email, setEmail] = useState("");

  const { mutateAsync: removeAccess, isPending: isRemoving } = useMutation({
    mutationFn: (userId: string) =>
      journalService.deleteSharedJournal(diaryId, userId),
    onSuccess: async () => {
      await clientQuery.invalidateQueries({ queryKey: ["journals"] });
      toast.success(TOAST_MESSAGES.accessRemoveSuccess.text);
      close();
    },
    onError: (error) => {
      console.error("Error removing access:", error);
      toast.error(TOAST_MESSAGES.accessRemoveError.text);
      close();
    },
  });

  const { mutateAsync: share, isPending: isSharing } = useMutation({
    mutationFn: (email: string) => journalService.shareJournal(diaryId, email),
    onSuccess: async () => {
      await clientQuery.invalidateQueries({ queryKey: ["journals"] });
      toast.success(TOAST_MESSAGES.invitationSendSuccess.text);
      setEmail("");
      close();
    },
    onError: (error) => {
      const errorMessage =
        (typeof error === "object" &&
          error !== null &&
          "response" in error &&
          (error as any).response?.data?.message) ||
        TOAST_MESSAGES.invitationSendError.text;
      console.error("Error sending invite:", errorMessage);
      toast.error(errorMessage);
    },
  });

  const onCopyLink = async () => {
    try {
      const { url } = await journalService.shareJournal(diaryId);
      await navigator.clipboard.writeText(url);
      toast.success(TOAST_MESSAGES.copyLinkSuccess.text);
    } catch (err) {
      toast.error(TOAST_MESSAGES.copyLinkError.text);
    } finally {
      close();
    }
  };

  const onRemoveAccess = async (userId: string) => {
    await removeAccess(userId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await share(email);
  };

  return (
    <div className="bg-white rounded-xl px-[37px] py-[46px] w-full max-w-md relative">
      <HeaderModal title="Share this journal" onClose={close} />
      <DefaultLoader loading={isSharing || isRemoving} />
      <div
        className={classNames(
          "mt-5",
          isSharing || isRemoving
            ? "opacity-50 blur-2xl pointer-events-none"
            : ""
        )}>
        <form
          onSubmit={handleSubmit}
          className={classNames(
            sharedWith.length > 0 ? "border-b border-gray-200 pb-4" : ""
          )}>
          <label className="text-16-100 font-light text-brand-secondary-400 mb-1 pl-3">
            Email address
          </label>
          <div className="flex flex-col gap-[14px] mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full min-h-[50px] px-4 py-2 border-[1px] text-brand-secondary-900 border-brand-gray-350 shadow-inputs rounded-[30px] focus:outline-none focus:ring-[1px] focus:ring-brand-primary-500"
              placeholder="example@email.com"
            />
            <Button type="submit" variant="primary" className="px-10 self-end">
              Send Invite
            </Button>
          </div>
        </form>

        {sharedWith.length > 0 && (
          <div className="mb-6">
            <h3 className="text-16-100 font-light text-brand-secondary-400 mt-3 mb-4">
              Who has access
            </h3>
            <div className="space-y-2">
              {sharedWith.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-500 text-white">
                          {getUserInitials(user.name)}
                        </div>
                      )}
                    </div>
                    <span className="text-16-100 font-light text-brand-secondary-400">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveAccess(user.id)}
                    className="text-xs font-light text-brand-secondary-400 hover:text-brand-red-400 transition-colors duration-300 cursor-pointer">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          variant="ghost-primary"
          onClick={onCopyLink}
          className="px-[35px]">
          <Link className="h-5 w-5 mr-1.5" />
          Copy link
        </Button>
      </div>
    </div>
  );
};

export default ShareDiaryModal;
