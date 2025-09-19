import Link from "next/link"

export default function Navbar(){

    return (
        <>
        <nav className="flex justify-between px-8  items-center  shadow-sm">
            <img src="/plateform_logo.png"  width="100px" alt="plateform_logo" />
            <ul className="flex gap-5">
                <li className="hover:border-b-2 p-2"><Link href='/dashboard'>Dashboard</Link></li>
                <li className="hover:border-b-2 p-2"><Link href='/dashboard'>Profile</Link></li>
                <li className="hover:border-b-2 p-2"><Link href='/dashboard'>Plan</Link></li>
                <li className="hover:border-b-2 p-2"><Link href='/dashboard'>Setting</Link></li>
                
            </ul>
        </nav>
        </>
    )
}