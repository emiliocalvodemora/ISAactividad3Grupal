import React from 'react'
import './Profile.css'

function Profile({ user }){
    return (
        <div className="profile-container">
            <h1>Perfil</h1>
            <div id="info">
                Datos del perfil de {user}


            </div>
        </div>

    )
}

export default Profile