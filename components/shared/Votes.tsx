"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "../ui/use-toast";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpVoted: boolean;
  downvotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasUpVoted,
  downvotes,
  hasDownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();

  useEffect(() => {
    viewQuestion({
      userId: userId ? JSON.parse(userId) : undefined,
      questionId: JSON.parse(itemId),
    });
  }, [itemId, userId, pathname]);

  const handleSave = async () => {
    await toggleSaveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path: pathname,
    });
    return toast({
      title: `Question ${
        !hasSaved ? "Saved in" : "Removed from"
      } your collection`,
      variant: !hasSaved ? "default" : "destructive",
    });
  };

  const handleVote = async (action: "upvote" | "downvote") => {
    if (!userId)
      return toast({
        title: "Please log in",
        description: "You must be logged in to perform this action",
      });

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
        return toast({
          title: `Upvote ${!hasUpVoted ? "Successfull" : "Removed"}`,
          variant: !hasUpVoted ? "default" : "destructive",
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      }
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
        return toast({
          title: `Downvote ${!hasDownVoted ? "Successfull" : "Removed"}`,
          variant: !hasDownVoted ? "default" : "destructive",
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted: hasUpVoted,
          hasdownVoted: hasDownVoted,
          path: pathname,
        });
      }
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="Upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="Downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="Star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
