import { Ratings } from "@/components/profile/ratings";
import { getProfile } from "@/lib/dal/profile";
import { getRatings } from "@/lib/dal/ratings/queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RatingsPage(props: Props) {
  const params = await props.params;
  const id = params.id;

  const queryClient = new QueryClient();
  const ratingsPromise = await queryClient.prefetchInfiniteQuery({
    queryKey: ["ratings", Number(id)],
    queryFn: ({ pageParam }: { pageParam?: string }) => {
      return getRatings(Number(id), 10, pageParam);
    },
    initialPageParam: undefined,
  });

  const profilePromise = getProfile(Number(id));

  const [profileResponse] = await Promise.all([profilePromise, ratingsPromise]);
  const { error, profile } = profileResponse;

  if (error) return <div>{error.message}</div>;
  return (
    <div className="">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Ratings profile={profile} />
      </HydrationBoundary>
    </div>
  );
}
