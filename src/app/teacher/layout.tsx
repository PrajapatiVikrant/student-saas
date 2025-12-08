import TeacherDashboard from "../components/dashboard/TeacherDashboard";
import Navbar from "../components/layout/Navbar";

export default function TeacherLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <header>
                <Navbar />
            </header>
            <section className="flex">
            <aside >
               <TeacherDashboard/>
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