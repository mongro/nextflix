import { getRatings } from "@/lib/dal/rating";
import { routeErrorHandler } from "@/lib/error-handler";
import { ApiSuccessResponse, formatResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const DynamicParamsSchema = z.object({
  profileId: z.coerce.number(),
});

const QueryParamsSchema = z.object({
  cursor: z.string().optional(),
  take: z.coerce.number().optional(),
});

export const revalidate = 600000;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ profileId: string }> }
) {
  const params = await context.params;
  const searchParams = request.nextUrl.searchParams;

  try {
    const { profileId } = DynamicParamsSchema.parse(params);
    const { cursor, take } = QueryParamsSchema.parse({
      cursor: searchParams.get("cursor") ?? undefined,
      take: searchParams.get("take"),
    });
    const ratings = await getRatings(profileId, take, cursor);
    return formatResponse(ratings);
  } catch (error) {
    return routeErrorHandler(error);
  }
}

export type ApiResponseRated = ReturnType<typeof GET> extends Promise<
  NextResponse<infer T>
>
  ? T extends ApiSuccessResponse<infer S>
    ? ApiSuccessResponse<S>
    : never
  : never;
