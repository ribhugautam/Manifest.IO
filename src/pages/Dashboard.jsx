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

  const updateTodo = async(id) => {
    try {
      const data = await database.updateDocument(import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID, id, {
        todo_content: todo
      })
    }
    catch (error) {
      console.log(error);
    }
  }

  const addTodo = async() => {
    try {
      if(todo === '') {
        toast.error('Please enter a todo');
        return;
      }
      const data = await database.createDocument(import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID, 'unique()', {
        todo: todo, 
        email: email
      });
      setTodo('');
      toast.success('Todo added successfully');
    }
    catch (error) {
      toast.error('Error adding todo');
    }
  }

  const isLogin = async() => {
    try {

      const user = await account.get("current");
      setName(user.name);
      setEmail(user.email);
      
    } catch (error) {
      navigate('/Login');
    }
  }

  const getTodos = async() => {
    try {

      const response = await database.listDocuments(import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,[
        Query.equal('email',email)
      ]);
      console.log(response);
      setAlltodos(response.documents);
    } 

    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    isLogin();
    getTodos();
  },[]);

  return (
    <div className="flex flex-col items-center h-full bg-gray-100">
      <div className='flex flex-col items-center justify-center h-full w-11/12 max-w-[1180px] mx-auto ' >
      <div className="text-2xl font-bold mb-4">Dashboard</div>
      { 
      name ? 
      <>
      <div className='flex flex-col justify-between items-center gap-4 ' >

      <div className="text-sm mb-4">Welcome, {name}</div>
      <br/>
      <div className='relative' >
      <input 
      type="text"
      value={todo}
      onChange={(e) => setTodo(e.target.value)} 
      className="w-80 h-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none pr-[4rem] focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder='Add Task' 
      />
      <button onClick={addTodo} className="bg-blue-500 absolute right-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md" >Add</button>
      </div>

      {alltodos.length > 0 ? <div>
        {
          alltodos.map((todo) => (
            <div className="bg-white shadow-md w-full rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold">{todo.todo_content}</p>
            </div>
          ))
        }
      </div> : 
      <div>
        <p className="text-lg font-semibold">No tasks found</p>
       </div>}

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