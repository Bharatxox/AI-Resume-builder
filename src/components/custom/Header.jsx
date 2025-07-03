import { Button } from "../ui/button";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

const Header = () => {
  const { user, isSignedIn } = useUser();
  return (
    <div className="px-5 shadow-md">
      <div className="flex justify-between items-center p-3">
        <img src={logo} width="200" />
        {isSignedIn ? (
          <div className="flex items-center gap-2">
            <Button variant="outline">Dashboard</Button>
            <UserButton />
          </div>
        ) : (
          <div>
            <Link to={"/auth/sign-in"}>
              <Button>Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
