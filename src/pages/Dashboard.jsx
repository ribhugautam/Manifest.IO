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

    toast.loading("Uploading file...", {
      className: "dark:bg-[#070F2B] dark:text-white",
    });

    try {
      const fileUploaded = await storage.createFile(
        import.meta.env.VITE_APP_APPWRITE_BUCKET_ID,
        ID.unique(),
        file
      );
      fileID = fileUploaded.$id;
    } catch (error) {
      toast.dismiss();
      if (error instanceof Error) {
        console.error("Error uploading file", error);
      } else {
        console.error("Error uploading file", { error: error });
      }
      toast.error("Error uploading file", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
    }
    toast.dismiss();
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
      !like
        ? toast.success("Liked", {
            className: "dark:bg-[#070F2B] dark:text-white",
          })
        : toast.error("Disliked", {
            className: "dark:bg-[#070F2B] dark:text-white",
          });
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
    toast.loading("Adding post...", {
      className: "dark:bg-[#070F2B] dark:text-white",
    });
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
    toast.dismiss();
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
        [Query.equal("email", email)]
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

    toast.loading("Deleting post...", {
      className: "dark:bg-[#070F2B] dark:text-white",
    });

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

  const editTodo = async (id, vemail, vtodo) => {
    if (vemail !== email) {
      toast.error("You are not authorized to edit this post", {
        className: "dark:bg-[#070F2B] dark:text-white",
      });
      return;
    }

    toast.loading("Editing post...", {
      className: "dark:bg-[#070F2B] dark:text-white",
    });

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
    toast.dismiss();
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
                {alltodos.length > 0 && (
                  <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white shadow-md font-bold py-2 px-4 ${
                      edit ? " absolute right-0 rounded-r " : "rounded"
                    }`}
                    onClick={() => setEdit(!edit)}
                  >
                    {" "}
                    {edit ? <RxCross2 size={24} /> : "Edit a post"}{" "}
                  </button>
                )}
              </div>

              <div className="text-2xl mt-4 -mb-6 text-center font-bold">
                Your Posts
              </div>

              <div className="mt-8  ">
                {alltodos.length > 0 ? (
                  <div className="flex flex-wrap justify-center items-center w-[300px] sm:w-[300px] md:w-[400px] lg:w-[400px] max-w-[400px] gap-4  ">
                    {alltodos.map((todo, index) => (
                      <div
                        key={index}
                        className={`bg-white dark:bg-white/5 gap-2 flex relative flex-col justify-center shadow-md w-full max-w-[400px] rounded-lg ${
                          todo.fileid === null ? "py-4 px-2" : "py-6 px-2"
                        } mb-4`}
                      >
                        <div className="flex flex-wrap justify-between items-center text-slate-500 ">
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

                        <p className="text-[12px] max-w-[15rem] break-words font-semibold ">
                          <span className="text-blue-500 font-bold ">
                            {todo.email === email ? "You" : todo.name}
                          </span>{" "}
                          {todo.todo}
                        </p>

                        <div className="flex gap-2 justify-between items-center ">
                          <div className="flex flex-col justify-center items-center">
                            <button
                              onClick={() => likeTodo(todo.$id, todo.Likes)}
                              className="text-blue-500 hover:scale-105 transition-all duration-200 "
                            >
                              {like && todo.Likes && todo.$id === todo.$id ? (
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
