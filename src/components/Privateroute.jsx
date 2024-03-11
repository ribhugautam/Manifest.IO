import React from 'react'
import { Navigate } from 'react-router-dom';

function Privateroute({children, isLoggedin}) {

    return(
        isLoggedin ? children : <Navigate to="/Login" />
    )
}

export default Privateroute;