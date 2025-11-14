import { isInMyList } from "@/lib/dal/my-list/queries";
import { routeErrorHandler } from "@/lib/error-handler";
import { ApiSuccessResponse, formatResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const ParamSchema = z.object({
  profileId: z.coerce.number(),
  movieId: z.string(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ profileId: string; movieId: string }> }
) {
  const params = await context.params;
  const { profileId, movieId } = params;

  try {
    ParamSchema.parse({ profileId, movieId });
    const inMyList = await isInMyList(Number(profileId), movieId);
    return formatResponse(inMyList);
  } catch (error) {
    return routeErrorHandler(error);
  }
}

export type ApiResponseIsInMyList = ReturnType<typeof GET> extends Promise<
  NextResponse<infer T>
>
  ? T extends ApiSuccessResponse<infer S>
    ? ApiSuccessResponse<S>
    : never
  : never;
