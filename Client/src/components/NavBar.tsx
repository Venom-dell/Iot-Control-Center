import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">IoT Dashboard</h1>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
