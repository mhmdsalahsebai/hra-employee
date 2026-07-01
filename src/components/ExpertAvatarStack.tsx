import { Avatar } from "./ui";
import { experts } from "../data/app";

/** An overlapping row of specialist headshots — social proof that real, human
 *  experts are one tap away. Shared by every "book a consultation" surface. */
export function ExpertAvatarStack({
  size = 40,
  max = 4,
  ringClassName = "ring-surface",
}: {
  size?: number;
  max?: number;
  ringClassName?: string;
}) {
  return (
    <div className="flex -space-x-3 rtl:space-x-reverse">
      {experts.slice(0, max).map((e) => (
        <Avatar
          key={e.id}
          name={e.name}
          src={e.avatar}
          size={size}
          className={`ring-2 ${ringClassName}`}
        />
      ))}
    </div>
  );
}
