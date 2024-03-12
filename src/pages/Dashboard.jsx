import React, { useEffect, useState } from 'react'
import { account, database } from '../appwrite/config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Query } from 'appwrite';

function Dashboard(props) {

  const navigate = useNavigate();
  const [email,setEmail] = useState('');
  const [name,setName] = useState('');
  const [todo,setTodo] = useState('');
  const [alltodos,setAlltodos] = useState([]);
  const [newtodo,setNewtodo] = useState('');
  const [edit,setEdit] = useState(false);

  const addTodo = async() => {
    try {
      if(todo === '') {
        toast.error('Please enter a Post');
        return;
      }
      const data = await database.createDocument(import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID, 'unique()', {
        todo: todo, 
        email: email,
        name: name
      });
      setTodo('');
      toast.success('Post added successfully');
    }
    catch (error) {
      toast.error('Error adding post');
    }
  }

  const isLogin = async() => {
    try {

      const user = await account.get("current");
      setName(user.name);
      setEmail(user.email);
      viewTodos();
      
    } catch (error) {
      navigate('/Login');
    }
  }

  async function viewTodos() {
    try {

      let response = await database.listDocuments(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
        [
          
        ]
      );
      console.log(response.documents);
      setAlltodos(response.documents);
    } 

    catch (error) {
      console.log(error);
    }
  }

  const deleteTodo = async (id,vemail) =>{
    if(vemail !== email){
      toast.error('You are not authorized to delete this post');
      return;
    }
    try{
      const data = await database.deleteDocument(import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID, id);
      toast.success('Post deleted successfully');
    }
    catch(error){
      toast.error('Error deleting post');
    }
  }

  const editTodo = async (id,vemail,vtodo) =>{
    if(vemail !== email){
      toast.error('You are not authorized to edit this post');
      return;
    }
    try{
      const data = await database.updateDocument(import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID, id, {
        todo : newtodo
      })
      toast.success('Post edited successfully');
    }
    catch(error){
      toast.error('Error editing post');
    }
    setNewtodo("");
  }
  
  useEffect(() => {
    isLogin();
  },[alltodos]);

  return (
    <div className="flex flex-col p-8 items-center h-full bg-gray-100">
      <div className='flex flex-col items-center justify-center h-full w-11/12 max-w-[1180px] mx-auto ' >
      { 
      name ? 
      <>
      <div className='flex flex-col justify-between items-center gap-4 ' >

      <div className="text-2xl text-center font-bold mb-4">Welcome, <span className='text-blue-500' >{name}</span></div>
      <br/>
      <div className='relative' >

      <input 
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        className="w-80 h-10 px-4 break-words py-2 border border-gray-300 rounded-md focus:outline-none pr-[4rem] focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
        placeholder='Add Post' 
      />

      <button onClick={addTodo} className="bg-blue-500 absolute right-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md" >Post</button>
        
      </div>

      <div className='relative' >
        { edit &&
      <input
          type='text'
          value={newtodo}
          placeholder='Edit Post'
          className='w-80 h-10 px-4 break-words py-2 border border-gray-300 rounded-md focus:outline-none pr-[5rem] focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          onChange={(e) => setNewtodo(e.target.value)}
          onClick={() => setNewtodo(todo.todo)}
        />
        }
        {
          <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${edit ? ' absolute right-0 rounded-r-md ' : ' '}`} onClick={() => setEdit(!edit) } > {edit ? 'Cancel' : 'Edit a post'} </button>
        }
      </div>

      <div className=' w-full overflow-y-scroll max-h-[400px] mt-8  ' >
      {alltodos.length > 0 ? <div className='w-full flex flex-col-reverse ' >
        {
          alltodos.map((todo) => (

            <div className="bg-white gap-2 flex relative flex-col justify-center shadow-md w-full rounded-lg p-4 mb-4">
              <div className='flex justify-between items-center' >
                <p className="text-[10px] text-blue-500 font-semibold ">{todo.name}</p>
                <p className="text-[10px] font-semibold " >{new Date(todo.$createdAt).toLocaleString()}</p>
              </div>

              <p className="text-md max-w-[15rem] break-words font-semibold">{todo.todo}</p>

              {todo.email == email && 
              <div className='flex flex-col gap-2 justify-center ' >
                
                <div className=' text-[10px] flex gap-1 justify-end ' >
                  {
                    newtodo !== '' && edit &&
                    <button className='bg-blue-500 text-[10px] text-white font-semibold py-1 p-2 rounded hover:bg-blue-600 transition-all duration-200' onClick={() => editTodo(todo.$id, todo.email, todo.todo)} >Apply Here</button>
                  }
                  <button className='bg-red-500  bottom-1 text-white font-semibold py-1 p-2 rounded hover:bg-red-600 transition-all text-[10px] duration-200' onClick={() => deleteTodo(todo.$id, todo.email)}>Delete</button>
                </div>
              </div>
              }
  
            </div>
            
          ))
        }
      </div> : 
      <div>
        <p className="text-lg text-center font-semibold">No Posts found</p>
       </div>}

      </div>
      </div>
      </> 

      : 
      
      <div className='flex gap-1 animate-ping'>
        <div className="bg-blue-700 rounded-full animate-bounce w-2 h-2  "/>
        <div className="bg-blue-700 rounded-full animate-bounce w-2 h-2  "/>
        <div className="bg-blue-700 rounded-full animate-bounce w-2 h-2  "/>
      </div>
      }
      </div>
    </div>
  );
}

export default Dashboard