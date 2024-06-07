import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {  useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { updateUserFailure,updateUserSuccess,updateUserStart, deleteUserStart,deleteUserFailure,deleteUserSuccess,signOut } from '../redux/user/userSlice'


export default function Profile() 
{
  const {currentUser,loading,error} = useSelector((state) => state.user)
  const [image,setImage] = useState(undefined)
  const [imagePercentage,setImagePercentage] = useState(0);
  const [imageError,setImageError]= useState(false);
  const fileRef = useRef(null)
  const dispatch = useDispatch();
  const [formData,setFormData] = useState({})
  const [updateSuccess,setUpdateSuccess] = useState(false)
  const navigate = useNavigate();

  useEffect(()=>{
    if(image)
    {
      handleFileUpload(image)
    }
  },[image]);

  const handleFileUpload = async(image)=>
  {
    const storage = getStorage(app);
    const fileName = new Date().getTime()+image.name;
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,image);
    uploadTask.on(
      'state_changed',
      (snapshot)=>
      {
        const progress = (snapshot.bytesTransferred/ snapshot.totalBytes)*100;
        setImagePercentage(Math.round(progress));
      },
      (error)=>{
        setImageError(true);
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>
          setFormData({...formData,profilePicture:downloadUrl})
        );
      }
    );
  };

  const handleChange = (event)=>
  {
    setFormData({...formData,[event.target.id]:event.target.value});
  }


  const handleSubmit = async(event) =>
  {
    event.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
       'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success===false)
      {
        dispatch(updateUserFailure(data))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true);
    } 
    catch (error) {
      dispatch(updateUserFailure(data));
    }
  };

  const handleDeleteAccount = async() =>
  {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });

      const data =  await res.json();
      if(data.success===false)
      {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(data));
    }
  }

  const handleSignout = async() =>
  {
    try {
      await fetch(`/api/auth/signout`); 
      dispatch(signOut());
    } catch (error) {
      console.log(error)
    }
  }
 
  return (
    <div className='p-3 max-w-lg mx-auto gap-4 mt-2'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <input type='file' ref={fileRef} hidden accept='image/*' onChange={(event)=>{setImage(event.target.files[0])}}/ >
      <img 
      src={formData.profilePicture || currentUser.profilePicture} 
      alt='profile' 
      className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
      onClick={()=>fileRef.current.click()}
      />
      <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : imagePercentage > 0 && imagePercentage < 100 ? (
            <span className='text-slate-700'>{`Uploading ${imagePercentage}%`}</span>
          ) : imagePercentage === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
      <input type='text' id='username' 
      placeholder='Username' 
      defaultValue={currentUser.username} 
      className='bg-slate-100 rounded-lg p-3'
      onChange={handleChange}/>
      <input type='text' id='email' 
      placeholder='Email' 
      defaultValue={currentUser.email} 
      className='bg-slate-100 rounded-lg p-3'
      onChange={handleChange}/>
      <input type='text' 
      id='password' 
      placeholder='Password'  
      className='bg-slate-100 rounded-lg p-3'
      onChange={handleChange}/>
      <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
      {loading ? 'Loading...' : 'Update'}
    </button>
      </form>
      <div className='flex justify-between m-5'>
      <span className='text-red-700 cursor-pointer' onClick={handleDeleteAccount}>Delete Account</span>
      <span className='text-red-700 cursor-pointer' onClick={handleSignout}>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5' >{error && "something went wrong"}</p>
      <p className='text-green -700 mt-5'>{updateSuccess && "User is updated"}</p>
    </div>

  )
}
