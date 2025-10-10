
type QuickStsProps = {
    icon:String;
    title:String;
    desc:String;
    value:String;
}
export default function Quickstatus({icon,title,desc,value }:QuickStsProps) {

    return (
        <div className="flex items-center gap-4 rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-blue-600">{icon}</span>
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {desc}
                </p>
            </div>
            <div className="text-lg font-bold text-blue-600">{value}</div>
        </div>
    )
}