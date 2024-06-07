import React from 'react'

export default function Home() {
  return (
    <div className='px-4 py-12 max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'  >
      Welcome to my Project for Authenctication
      </h1>

    <p className='mb-4 text-slate-900'>
    This is a full-stack web application built with 
    MERN(MongoDB,
    Express,React,Node.js)stack.It includes
    authenctication features that allow users to sign up, log in, and log out, and 
    provides access to 
    protected routes only for authenticated users.
    </p>


    <p className='mb-4 text-slate-900'>
    The front-end of application is built with React and uses React Router for client-side routing.The backend is built with NodeJs
    and Express and uses MongoDB as the database.Authenctication is implemented using JSON Web Tokens(JWT).
    </p>

    <p className='mb-4 text-slate-900'>
    This application is intended as a starting point for building full-stack web applications with Authenctication using MERN stack.
    </p>

    </div>
  )
}
