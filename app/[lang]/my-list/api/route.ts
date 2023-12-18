import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { MediaType } from "../../../../tmdb/requests";

interface Item {
  id: number;
  type: string;
}
type RemovePayload = {
  id: number;
  operation: "remove";
};
type AddPayload = {
  id: number;
  type: MediaType;
  operation: "add";
};

export type MutationPayload = RemovePayload | AddPayload;

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const myList = cookieStore.get("mylist")?.value;
  let newList = (myList ? JSON.parse(myList) : []) as Item[];
  const payload = (await request.json()) as MutationPayload;
  if (payload.operation === "add") {
    newList.push({ id: payload.id, type: payload.type });
  } else if (payload.operation === "remove") {
    newList = newList.filter((product) => product.id !== payload.id);
  }

  return new Response("Success", {
    status: 200,
    headers: {
      "Set-Cookie": `mylist=${JSON.stringify({ id: 1 })};Path=/;`,
    },
  });
}
