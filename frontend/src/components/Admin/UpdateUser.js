import React, { Fragment, useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import './NewProduct.css';
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import MetaData from '../layout/MetaData';
import SideBar from "./Sidebar";
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import { getUserDetails,clearError, updateUser } from '../../actions/userAction';
import PersonIcon from '@material-ui/icons/Person';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Loder from "../layout/Loader/Loder";

const UpdateUser = ({history,match}) => {
    
    const dispatch = useDispatch();
    const alert = useAlert();

    const {loading , error ,user} = useSelector((state)=>state.userDetails)
    const {loading:updateLoaing , error:updateError ,isUpdated} = useSelector((state)=>state.profile)
    
    const userId = match.params.id;

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [role,setRole] = useState('');
    
    

    useEffect(()=>{
        if(user && user._id!==userId){
            dispatch(getUserDetails(userId));
        }
        else{
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }
        if(error){
            alert.error(error);
            dispatch(clearError());
        }
        if(isUpdated){
            alert.success("User Updated Successfully");
            history.push("/admin/users");
            dispatch({type:UPDATE_USER_RESET});
        }
        if(updateError){
            alert.error(updateError);
            dispatch(clearError());
        }

    },[alert,userId,user,isUpdated,dispatch,error,history,updateError])

    const updateUserSubmitHandle = (e) =>{
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("name",name);
        myForm.set("email",email);
        myForm.set("role",role);

        dispatch(updateUser(userId,myForm));

    };

  return (
    <Fragment>
        <MetaData title="Update User"/>
        <div className='dashboard'>
            <SideBar/>
            <div className='createProductContainer'>
                {loading?<Loder/>: 
                    <form
                    className='createProductForm'
                    onSubmit={updateUserSubmitHandle}
                    >
                        <h1>Update User</h1> 
                        <div>
                            <PersonIcon/>
                            <input
                            type='text'
                            placeholder='Name'
                            required
                            value={name}
                            onChange={(e)=>setName(e.target.value)}/>

                        </div>
                        <div>
                            <MailOutlineIcon/>
                            <input
                            type='email'
                            placeholder='Email'
                            required
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}/>

                        </div>
                        <div>
                            <VerifiedUserIcon/>
                            <select value={role} onChange={(e)=>setRole(e.target.value)}>
                                <option value=''>Choose Role</option>
                                <option value='admin'>Admin</option>
                                <option value='user'>User</option>
                            </select>
                        </div>
                        <Button 
                            id='createProductBtn'
                            type='submit'
                            disabled={updateLoaing ? true :false || role===''?true:false}
                        >Update</Button>
                    </form>
                }
            </div>
        </div>
    </Fragment>
  )
}

export default UpdateUser