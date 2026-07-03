import { Bell, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import gt_logo from "../../assets/gt-logo.png";

const ClientHeader = () => {
  return (
    <div className="sticky top-0 z-30 flex h-15 items-center justify-between border-b border-gray-200 bg-white px-8">
      <img src={gt_logo} alt="" className="max-w-[2em]" />
      <div className=" flex items-center text-slate-50 gap-2">
        <div className="mx-2">
          <Star className="h-5 w-5 text-foreground cursor-pointer" />
        </div>
        <div className="mx-2">
          <Bell className="h-5 w-5 text-foreground cursor-pointer" />
        </div>
        <div className="hidden items-center gap-3 mx-4 md:flex">
          <Link to="/client/settings">
            <Button variant="hero" size="sm">
              JM
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
