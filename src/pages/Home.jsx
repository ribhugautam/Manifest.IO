import React, { useEffect, useState } from "react";
import { account, database, storage } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Home(props) {
  const isLoggedin = props.isLoggedin;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [alltodos, setAlltodos] = useState([]);
  const [newtodo, setNewtodo] = useState("");
  const [edit, setEdit] = useState(false);
  const [like, setLike] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [latest, setLatest] = useState(true);

  const viewTodos = async () => {
    try {
      let response = await database.listDocuments(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
        []
      );
      setAlltodos(response.documents);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(true);
    }
  };

  const deleteFile = async (fileId) => {
    if (fileId === null || fileId === undefined) {
      console.log("fileId is null or undefined");
      return;
    }
    try {
      await storage.deleteFile(
        import.meta.env.VITE_APP_APPWRITE_BUCKET_ID,
        fileId
      );
    } catch (error) {
      console.error("Error deleting file", error);
      toast.error("Error deleting file", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    }
  };

  const likeTodo = async (id, Likes) => {
    try {
      const data = await database.updateDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
        id,
        {
          Likes: like ? Likes - 1 : Likes + 1,
        }
      );
      !like
        ? toast.success("Liked", {
            className: "dark:bg-[#070F2B] dark:text-white",
          })
        : toast.error("Disliked", {
            className: "dark:bg-[#070F2B] dark:text-white",
          });
    } catch (error) {
      toast.error("Please login or sign up to like", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    }
    setLike(!like);
  };

  const isLogin = async () => {
    try {
      const user = await account.get("current");
      setName(user.name);
      setEmail(user.email);
      viewTodos();
      console.log("inlogin");
      {
        !isLoggedin && account.deleteSession("current");
      }
    } catch (error) {
      console.error("Error getting user", error);
      setName("");
      setEmail("");
    }
  };

  const deleteTodo = async (id, vemail, vfileid) => {
    toast.loading("Deleting post...", {
      className: "dark:bg-[#070F2B] dark:text-white",
    });
    if (vemail === null || vemail === undefined) {
      console.error("Null or undefined vemail in deleteTodo");
      return;
    }

    if (email === null || email === undefined) {
      console.error("Null or undefined email in deleteTodo");
      return;
    }

    if (vemail !== email) {
      toast.error("You are not authorized to delete this post", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
      return;
    }

    try {
      const data = await database.deleteDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
        id
      );
      toast.success("Post deleted successfully", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    } catch (error) {
      console.error("Error deleting post", error);
      toast.error("Error deleting post", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    }
    toast.dismiss();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoggedin) {
        isLogin();
      } else {
        viewTodos();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoggedin]);

  return (
    <div className="flex flex-col p-8 items-center h-full dark:bg-[#070F2B] dark:text-white bg-gray-100">
      <div className="flex flex-col items-center  h-full w-11/12 max-w-[1180px] mx-auto ">
        <div>
          <div className="text-2xl text-center font-bold">
            Hey, <span className="text-blue-500">{name ? name : "Guest"}</span>
            <p className="text-sm font-normal text-gray-500 ">
              Checkout latest{" "}
              <span className="text-blue-500 italic ">post`s</span>
            </p>
            {!name && (
              <p className="text-sm font-normal text-gray-500 ">
                <span className="text-blue-500 italic">
                  <Link to="/Login">Login</Link> or{" "}
                  <Link to="/register">Sign up</Link>
                </span>{" "}
                to add your own.
              </p>
            )}
          </div>
        </div>
        {isLoading ? (
          <>
            <div className="flex flex-wrap gap-4 justify-center p-4 pt-8 items-center">
              <button
                onClick={() => setLatest(true)}
                className={`text-white px-4 ${
                  latest ? "bg-blue-500" : "bg-blue-500/50 hover:bg-blue-500/80"
                } py-1 transition-all duration-200 ease-linear font-medium text-xs rounded`}
              >
                Recent
              </button>
              <button
                onClick={() => setLatest(false)}
                className={` text-white px-4 hover:bg-b\ ${
                  !latest
                    ? "bg-blue-500"
                    : "bg-blue-500/50 hover:bg-blue-500/80"
                } py-1 transition-all duration-200 ease-linear font-medium text-xs rounded`}
              >
                Oldest
              </button>
            </div>
            <div className="flex flex-col justify-between items-center gap-4 ">
              <div className="mt-8  ">
                {alltodos.length > 0 ? (
                  <div className={`flex ${!latest ? "flex-wrap" : "flex-wrap-reverse"} justify-center items-center w-[300px] sm:w-[300px] md:w-[400px] lg:w-[400px] max-w-[400px] gap-4`}>
                    {alltodos.map((todo, index) => (
                      <div
                        key={index}
                        className={`bg-white dark:bg-white/5 gap-2 flex relative flex-col justify-center shadow-md w-full max-w-[400px] rounded-lg ${
                          todo.fileid === null ? "py-4 px-2" : "py-6 px-2"
                        } mb-4`}
                      >
                        <div className="flex justify-between items-center text-slate-500 ">
                          <p className="text-[10px] font-semibold ">
                            Posted on
                          </p>
                          <p className="text-[10px] font-semibold ">
                            {new Date(todo.$createdAt).toLocaleString()}
                          </p>
                        </div>

                        {todo.fileid && (
                          <div
                            className={`max-h-[250px] flex aspect-square justify-center items-center shadow-inner rounded bg-slate-300 dark:bg-[#050b20]  ${
                              todo.fileid === null ? "p-0" : "p-4"
                            } `}
                          >
                            {todo.fileid !== null ? (
                              <img
                                src={todo.fileurl}
                                alt="post"
                                className=" object-cover rounded max-h-[200px]"
                              />
                            ) : null}
                          </div>
                        )}

                        <p className="text-[10px] max-w-[15rem] break-words font-semibold ">
                          <span className="text-blue-500">
                            {todo.email === email ? "You" : todo.name}
                          </span>{" "}
                          {todo.todo}
                        </p>

                        <div className="flex gap-2 justify-between items-center ">
                          <div className="flex flex-col justify-center items-center">
                            <button
                              onClick={() => {
                                isLoggedin
                                  ? likeTodo(todo.$id, todo.Likes)
                                  : toast.error(
                                      "Please login or sign up to like",
                                      {
                                        className:
                                          "dark:bg-[#070F2B] dark:text-white",
                                      }
                                    );
                              }}
                              className="text-blue-500 hover:scale-105 transition-all duration-200 "
                            >
                              {todo.$id === todo.$id &&
                              todo.Likes > 0 &&
                              like ? (
                                <FcLike size={24} />
                              ) : (
                                <FcLike size={24} />
                              )}
                            </button>
                            <span className="text-[10px] font-semibold">
                              {todo.Likes} {todo.Likes > 1 ? "Likes" : "Like"}{" "}
                            </span>
                          </div>
                          {todo.email == email && (
                            <div className=" text-[10px] flex gap-1 justify-end ">
                              {newtodo !== "" && edit && (
                                <button
                                  className="bg-blue-500 shadow-md text-[10px] text-white font-semibold py-1 p-2 rounded hover:bg-blue-600 transition-all duration-200"
                                  onClick={() =>
                                    editTodo(todo.$id, todo.email, todo.todo) &&
                                    setEdit(false)
                                  }
                                >
                                  Apply Here
                                </button>
                              )}
                              <button
                                className="bg-red-500 shadow-md bottom-1 text-white font-semibold  p-2 rounded-full hover:bg-red-600 transition-all text-[10px] duration-200"
                                onClick={() => {
                                  deleteTodo(todo.$id, todo.email);
                                  deleteFile(todo.fileid);
                                }}
                              >
                                <AiOutlineDelete size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-lg text-center font-semibold">
                      No Posts found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-1 mt-4 animate-ping">
            <div className="bg-blue-700 rounded-full animate-bounce w-2 h-2  " />
            <div className="bg-blue-700 rounded-full animate-bounce w-2 h-2  " />
            <div className="bg-blue-700 rounded-full animate-bounce w-2 h-2  " />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
