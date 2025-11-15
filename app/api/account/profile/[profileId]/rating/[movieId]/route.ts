import { getRating } from "@/lib/dal/ratings/queries";
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
  const start = Date.now();

  try {
    const { profileId, movieId } = ParamSchema.parse(params);
    const rating = await getRating(profileId, movieId);
    console.log("servertime", Date.now() - start);
    return formatResponse(rating);
  } catch (error) {
    console.log("error", error);
    return routeErrorHandler(error);
  }
}
export type ApiResponseRating = ReturnType<typeof GET> extends Promise<
  NextResponse<infer T>
>
  ? T extends ApiSuccessResponse<infer S>
    ? ApiSuccessResponse<S>
    : never
  : never;
