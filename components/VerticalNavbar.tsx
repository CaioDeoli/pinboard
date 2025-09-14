import LogoReactIcon from "@/components/svgs/geist-logo-react.svg";
import HomeIcon from "@/components/svgs/material-symbols--home-outline-rounded.svg";
import AddBoxIcon from "@/components/svgs/material-symbols--add-box-outline-rounded.svg";
import FolderIcon from "@/components/svgs/material-symbols--folder-outline-rounded.svg";
import SettingsIcon from "@/components/svgs/material-symbols--settings-outline-rounded.svg";

export default function VerticalNavbar() {
  const items = [
    { href: "#", Icon: LogoReactIcon },
    { href: "#", Icon: HomeIcon },
    { href: "#", Icon: AddBoxIcon },
    { href: "#", Icon: FolderIcon },
  ];

  return (
    <div className="fixed top-0 z-10 h-screen w-18 flex justify-center overflow-y-auto overflow-x-hidden border-r border-gray-200">
      <div className="h-full py-4">
        <div className="flex flex-col items-center justify-between gap-6 h-full">
          <ul className="flex flex-col items-center gap-6 h-full">
            {items.map((item, index) => (
              <li key={index} className="block">
                <a href={item.href} className="inline-flex items-center justify-center h-12 w-12">
                  <item.Icon className="w-7 h-7" />
                </a>
              </li>
            ))}
          </ul>

          <div>
            <a href="#" className="inline-flex items-center justify-center h-12 w-12">
              <SettingsIcon className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}