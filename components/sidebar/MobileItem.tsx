import Link from "next/link";

import clsx from "clsx";

interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({ 
  href, 
  icon: Icon, 
  active,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return ( 
    <Link 
      onClick={handleClick} 
      href={href} 
      className={clsx(`
        group 
        flex 
        gap-x-4 
        text-sm 
        leading-6 
        font-semibold 
        w-full 
        justify-center 
        p-4 
        text-primary-500 
        hover:text-white
        hover:bg-primary-500/90
        rounded-lg
      `,
        active && 'bg-primary-500/80 text-white',
      )}>
      <Icon className="h-6 w-6" />
    </Link>
   );
}
 
export default MobileItem;