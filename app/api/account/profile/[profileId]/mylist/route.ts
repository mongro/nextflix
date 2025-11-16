import { getMyListOfProfile } from "@/lib/dal/my-list/queries";
import { routeErrorHandler } from "@/lib/error-handler";
import { ApiSuccessResponse, formatResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const DynamicParamsSchema = z.object({
  profileId: z.coerce.number(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ profileId: string }> }
) {
  const params = await context.params;

  try {
    const { profileId } = DynamicParamsSchema.parse(params);

    const ratings = await getMyListOfProfile(profileId);
    return formatResponse(ratings);
  } catch (error) {
    return routeErrorHandler(error);
  }
}

export type ApiResponseListOfProfile = ReturnType<typeof GET> extends Promise<
  NextResponse<infer T>
>
  ? T extends ApiSuccessResponse<infer S>
    ? ApiSuccessResponse<S>
    : never
  : never;
