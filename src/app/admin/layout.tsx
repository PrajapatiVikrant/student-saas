import StudentDashboard from "../components/dashboard/AdminDashboard";

export default function StudentLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <section className="flex">

            <aside >
                <StudentDashboard />
            </aside>
            <section className="bg-blue-50 h-[90vh] overflow-auto w-full">

            {children}
            </section>
            </section>
        </>


    )

}