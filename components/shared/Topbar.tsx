import getMessages from "@/lib/actions/getMessages";
import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { MessageSquareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function Topbar() {
  const status = await getMessages( null, true)
  console.log(status);
  
  
  return (
    <nav className='topbar'>
      <Link href='/' className='flex items-center gap-4'>
        <Image src='/logo.jpg' alt='logo' width={28} height={28} className="rounded-md" />
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>Birthmates</p>
      </Link>

      <div className='flex items-center gap-1'>
        <Link href={"/users"}>
          <div className='block relative'>
            <MessageSquareIcon className="text-light-1"/>
            <span className='absolute -top-1 -right-1 rounded-full bg-primary-500  h-3 w-3 text-xs text-light-1'></span>
          </div>
        </Link>
        <div className='block md:hidden'>
          <SignedIn>
            <SignOutButton>
              <div className='flex cursor-pointer'>
                <Image
                  src='/assets/logout.svg'
                  alt='logout'
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>


        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default Topbar;
