import AdminDashboard from "../components/dashboard/AdminDashboard";


export default function AdminLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
           
            <section className="flex">
            <aside  className="overflow-auto h-[100vh]">
                <AdminDashboard />
            </aside>
            <section className="bg-slate-50 dark:bg-slate-900 h-[100vh] overflow-auto w-full">

            {children}
           

            </section>
            </section>
        </>


    )

}