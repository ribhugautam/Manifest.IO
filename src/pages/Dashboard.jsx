import React, { useEffect, useState } from "react";
import { account, database, storage } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ID, Query } from "appwrite";
import { IoImageOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { IoSendOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";

function Dashboard(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [todo, setTodo] = useState("");
  const [alltodos, setAlltodos] = useState([]);
  const [newtodo, setNewtodo] = useState("");
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState(null);
  let fileID = null;
  let fileURL = null;
  const [like, setLike] = useState(false);

  const uploadFile = async () => {
    if (todo === null || file === null) {
      return;
    }

    try {
      const fileUploaded = await storage.createFile(
        import.meta.env.VITE_APP_APPWRITE_BUCKET_ID,
        ID.unique(),
        file
      );
      fileID = fileUploaded.$id;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error uploading file", error);
      } else {
        console.error("Error uploading file", { error: error });
      }
      toast.error("Error uploading file", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
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

  const previewFile = async () => {
    try {
      const filepreview = await storage.getFilePreview(
        import.meta.env.VITE_APP_APPWRITE_BUCKET_ID,
        fileID
      );
      fileURL = filepreview.href;
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.error("Error liking post", error);
      toast.error("Error liking post", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    }
    setLike(!like);
  };

  const addTodo = async () => {
    if (todo === "" && file === null) {
      toast.error("Nothing to Post", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
      return;
    }
    await previewFile();
    try {
      const data = await database.createDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          todo: todo,
          email: email,
          name: name,
          fileid: fileID,
          fileurl: fileURL,
        }
      );
      setTodo("");
      setFile(null);
      toast.success("Post added successfully", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    } catch (error) {
      console.error("Error adding post", error);
      toast.error("Error adding post", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    }
  };

  const isLogin = async () => {
    try {
      const user = await account.get("current");
      setName(user.name);
      setEmail(user.email);
      viewTodos();
    } catch (error) {
      navigate("/Login");
    }
  };

  async function viewTodos() {
    try {
      let response = await database.listDocuments(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
        [Query.equal("email", email)],
      );

      setAlltodos(response.documents.reverse());
    } catch (error) {
      console.log(error);
    }
  }

  const deleteTodo = async (id, vemail, vfileid) => {
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
  };

  const editTodo = async (id, vemail, vtodo) => {
    if (vemail !== email) {
      toast.error("You are not authorized to edit this post", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
      return;
    }
    try {
      const data = await database.updateDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
        id,
        {
          todo: newtodo,
        }
      );
      toast.success("Post edited successfully", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    } catch (error) {
      toast.error("Error editing post", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    }
    setNewtodo("");
  };

  useEffect(() => {
    isLogin();
  }, [alltodos]);

  return (
    <div className="flex flex-col p-8 items-center h-full dark:bg-[#070F2B] dark:text-white bg-gray-100">
      <div className="flex flex-col items-center  h-full w-11/12 max-w-[1180px] mx-auto ">
        {name ? (
          <>
            <div className="flex flex-col justify-between items-center gap-4 ">
              <div className="text-2xl text-center font-bold">
                Hey, <span className="text-blue-500">{name}</span>
                <p className="text-sm font-normal text-gray-500 ">
                  What's on your mind?
                </p>
              </div>
              <div className="relative mt-4">
                <input
                  type="text"
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                  className="w-80 h-10 px-4 dark:bg-transparent break-words py-2 rounded-md focus:outline-none pr-[6rem] ring ring-blue-500 "
                  placeholder="Add Post"
                />

                <div className="absolute right-[70px] top-2 cursor-pointer h-full">
                  {file === null ? (
                    <label htmlFor="file">
                      <IoImageOutline
                        size={24}
                        className="text-blue-500 cursor-pointer "
                      />
                    </label>
                  ) : (
                    <button onClick={() => setFile(null)}>
                      <RxCross2
                        size={24}
                        className="text-blue-500 cursor-pointer "
                      />
                    </button>
                  )}
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>

                <button
                  onClick={async () => {
                    const upload = uploadFile();
                    setTodo("");
                    setFile(null);
                    await upload;
                    addTodo();
                  }}
                  className="bg-blue-500 shadow-md absolute right-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
                >
                  <IoSendOutline size={24} />
                </button>
              </div>

              <div className="relative">
                {edit && (
                  <input
                    type="text"
                    value={newtodo}
                    placeholder="Edit Post"
                    className="w-80 h-10 px-4 dark:bg-transparent break-words py-2 rounded-md pr-[5rem] focus:outline-none ring ring-blue-500 "
                    onChange={(e) => setNewtodo(e.target.value)}
                    onClick={() => setNewtodo(todo.todo)}
                  />
                )}
                {
                  <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white shadow-md font-bold py-2 px-4 ${
                      edit ? " absolute right-0 rounded-r " : "rounded"
                    }`}
                    onClick={() => setEdit(!edit)}
                  >
                    {" "}
                    {edit ? <RxCross2 size={24} /> : "Edit a post"}{" "}
                  </button>
                }
              </div>

              <div className="text-2xl mt-4 -mb-6 text-center font-bold" >
                Your Posts
              </div>

              <div className=" w-full max-h-[350px] mt-8  ">
                {alltodos.length > 0 ? (
                  <div className="flex flex-wrap justify-center items-center gap-4 ">
                    {alltodos.map((todo, index) => (
                      <div
                        key={index}
                        className={`bg-white dark:bg-white/5 gap-2 flex relative flex-col justify-center shadow-md aspect-square max-w-[450px] rounded-lg ${
                          todo.fileid === null ? "p-4" : "py-6 px-2"
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

                        <div
                          className={`w-full shadow-inner  rounded bg-slate-300 dark:bg-[#050b20] ${
                            todo.fileid === null ? "p-0" : "p-4"
                          } `}
                        >
                          {todo.fileid !== null ? (
                            <div className="h-[200px] rounded flex justify-center w-full">
                              {todo.fileurl.includes("loading") ? (
                                <div className="flex justify-center aspect-square items-center h-full rounded">
                                  <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                </div>
                              ) : (
                                <img
                                  src={todo.fileurl}
                                  alt="post"
                                  className={`object-cover max-w-[350px] rounded hover:scale-110 hover:shadow-lg transition-all duration-200 `}
                                />
                              )}
                            </div>
                          ) : null}
                        </div>

                        <p className="text-[10px] max-w-[15rem] break-words font-semibold ">
                          <span className="text-blue-500">{todo.name}</span>{" "}
                          {todo.todo}
                        </p>

                        <div className="flex gap-2 justify-between items-center ">
                          <div className="flex flex-col justify-center items-center">
                            <button
                              onClick={() => likeTodo(todo.$id, todo.Likes)}
                              className="text-blue-500 hover:scale-105 transition-all duration-200 "
                            >
                              {like && todo.Likes && todo.$id === todo.$id ? (
                                <FcLikePlaceholder size={24} />
                              ) : (
                                <FcLikePlaceholder size={24} />
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
          <div className="flex gap-1 animate-ping">
            <div className="bg-blue-700 rounded-full animate-bounce w-2 h-2  " />
            <div className="bg-blue-700 rounded-full animate-bounce w-2 h-2  " />
            <div className="bg-blue-700 rounded-full animate-bounce w-2 h-2  " />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
