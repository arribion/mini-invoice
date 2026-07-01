import { Bell, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
// import Button from "../ui/button"
const ClientHeader = () => {
  return (
    <div className="bg-sky-500 p-4 flex items-center justify-between">
      <h1 className="text-slate-50 text-2xl font-bold">GT-ONLINE</h1>
      <div className=" flex items-center gap-2">
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
