import { getModalInfos, getSimilar, MediaType } from "@/lib/tmdb/requests";
import Modal from "./Modal";

export default async function Page(props: {
  params: Promise<{ id: string; type: MediaType }>;
}) {
  const params = await props.params;
  const data = await getModalInfos(Number(params.id), params.type);
  if (!data.videos.results || data.videos.results.length < 1) return;
  const videos = data.videos.results;
  const trailer = videos.findIndex((video) => video.type === "Trailer");
  const trailerUrl = trailer > -1 ? videos[trailer].key : videos[0].key;
  const similar = await getSimilar(Number(params.id), "movie");

  return <Modal trailer={trailerUrl} similar={similar.results} data={data} />;
}
