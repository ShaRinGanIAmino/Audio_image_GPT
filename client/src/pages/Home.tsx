import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const HandleSignUp = () => {
    navigate("/sign-up/*");
  };

  const HandleSignIn = () => {
    navigate("/sign-in/*");
  };

  const HandleChat = () => {
    navigate("/user/*");
  };

  return (
    <nav className=" flex gap-8 justify-end items-center px-20 py-6">
      <button onClick={HandleChat}>Chat</button>
      <button onClick={HandleSignIn}>Sign in</button>
      <button onClick={HandleSignUp}>Sign Up</button>
    </nav>
  );
};

export default Home;
