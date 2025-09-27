
export default function ClassRoomCard() {

    return (
        <article className="shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">10th Class</h1>

            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300  ">
               <p>Subject:5</p>
               <p>Batches:2</p>
            </div>

            <button className="mt-4 cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors w-fit">
                View Class
            </button>
        </article>

    )
}