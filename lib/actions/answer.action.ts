"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = new Answer({ content, author, question });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    await newAnswer.save();

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    await connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId }).populate({
      path: "author",
      model: User,
      select: "_id clerkId name picture",
    });

    return { answers };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
