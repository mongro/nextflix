import { avatarImages } from "@/public/avatars";
import Image, { StaticImageData } from "next/image";
import Avatar from "../ui/avatar";

type AvatarSelectProps = {
  onSelect: (avatar: string) => void;
};

export function AvatarSelect({ onSelect }: AvatarSelectProps) {
  return (
    <div className="p-4 border-2 rounded mt-4">
      <div className="flex gap-2">
        {avatarImages.map((avatar: StaticImageData) => {
          return (
            <button
              key={avatar.src}
              className="p-2 hover:bg-accent/50 "
              onClick={() => onSelect(avatar.src)}
            >
              <Avatar
                src={avatar}
                className="w-24 md:w-44"
                alt="avatar"
                width={512}
                height={512}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
