import Link from "next/link";
import React from "react";
import { searchPeople } from "@/lib/tmdb/requests";

interface Props {
  search: string;
}
export default async function PeopleSearchDisplay({ search }: Props) {
  const people = await searchPeople(search);
  return (
    <div className="mt-2">
      <div className="text-2xl text-neutral-50 mb-2">
        Explore movies/shows of actors:{" "}
      </div>
      <div className="mb-4">
        <ul className="flex flex-wrap  text-xl ">
          {people &&
            people.results.map((person) => (
              <li className="px-2  text-neutral-50" key={person.id}>
                <Link href={`search?person=${person.id}`} prefetch={false}>
                  {person.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
