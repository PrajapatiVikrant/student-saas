import StudentDashboard from "../components/dashboard/AdminDashboard";
import Navbar from "../components/layout/Navbar";

export default function StudentLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <header>
                <Navbar />
            </header>
            <section className="flex">
            <aside >
                <StudentDashboard />
            </aside>
            <section className="bg-white h-[90vh] overflow-auto w-full">

            {children}
            <br />
           <br/>

            </section>
            </section>
        </>


    )

}