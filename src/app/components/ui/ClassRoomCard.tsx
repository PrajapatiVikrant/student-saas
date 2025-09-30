import Link from "next/link";

type ClassRoomCardProps = {
  imageUrl: string;
  name: string;
  subject: string;
  batch: string;
};

export default function ClassRoomCard({
  imageUrl,
  name,
  subject,
  batch,
}: ClassRoomCardProps) {
  return (
    <article className="bg-white dark:bg-background-dark/50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>

      <div className="p-6 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Subject: {subject}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Batch: {batch}
          </p>
        </div>

        <Link href="/admin/class_batch/class">
          <button className="self-start cursor-pointer px-4 py-2 bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-600/20 dark:hover:bg-blue-600/30 transition-colors">
            View Class
          </button>
        </Link>
      </div>
    </article>
  );
}
