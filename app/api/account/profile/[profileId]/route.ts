import { getProfile } from "@/lib/dal/profile";
import { routeErrorHandler } from "@/lib/error-handler";
import { ApiSuccessResponse, formatResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const ParamSchema = z.object({
  profileId: z.coerce.number(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ profileId: string }> }
) {
  const params = await context.params;
  try {
    const { profileId } = ParamSchema.parse(params);
    const profile = await getProfile(profileId);
    return formatResponse(profile);
  } catch (error) {
    console.log("error", error);
    return routeErrorHandler(error);
  }
}
export type ApiResponseProfile = ReturnType<typeof GET> extends Promise<
  NextResponse<infer T>
>
  ? T extends ApiSuccessResponse<infer S>
    ? ApiSuccessResponse<S>
    : never
  : never;
