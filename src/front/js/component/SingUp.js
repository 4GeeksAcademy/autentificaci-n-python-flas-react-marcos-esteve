import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const SingUp = () => {
    
    const{store, actions} = useContext(Context);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    
    const sendData=(event)=>{
        event.preventDefault();
        const newCustomer = {
            email: email,
            password: password,
        };
        let allFieldsFilled = true; 
        for (const key in newCustomer) {
            if (!newCustomer[key]) {
                alert(`El campo ${key} no se ha introducido.`);
                allFieldsFilled = false; 
            }
        }
        if (allFieldsFilled) {
            actions.createCustomer(newCustomer);
            alert("Se ha creado el nuevo usuario")
            setLoading(true);
            setEmail("");
            setPassword("");
            setTimeout(() => {
                setLoading(false);
                navigate("/login");
            }, 2000);
        };
    }

	return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="card shadow-lg p-5" style={{ width: "100%", maxWidth: "500px", borderRadius: "15px", backgroundColor: "#ffffff" }}>
                <h2 className="text-center mb-4" style={{ color: "#10757a", fontWeight: "bold" }}>Bienvenido!</h2>
                <form onSubmit={sendData}>

                <div className="mb-3">
                    <label htmlFor="inputEmail4" className="form-label" style={{ fontWeight: "500", fontSize: "14px", color: "#6b6b6b" }}>Email</label>
                    <input 
                        type="email" 
                        className="form-control shadow-sm" 
                        id="inputEmail4" 
                        value={email} 
                        onChange={(event) => setEmail(event.target.value)} 
                        style={{ 
                            borderRadius: "12px", 
                            border: "1px solid #10757a", 
                            padding: "12px", 
                            backgroundColor: "#f4f4f4",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                            transition: "all 0.3s ease",
                            fontSize: "15px"
                        }} 
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="inputPassword4" className="form-label" style={{ fontWeight: "500", fontSize: "14px", color: "#6b6b6b" }}>Contraseña</label>
                    <input 
                        type="password" 
                        className="form-control shadow-sm" 
                        id="inputPassword4" 
                        value={password} 
                        onChange={(event) => setPassword(event.target.value)} 
                        style={{ 
                            borderRadius: "12px", 
                            border: "1px solid #10757a", 
                            padding: "12px", 
                            backgroundColor: "#f4f4f4",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                            transition: "all 0.3s ease",
                            fontSize: "15px"
                        }} 
                    />
                    <div id="passwordHelpBlock" className="form-text">
                        Te aconsejamos que tu contraseña tenga, al menos, 8 caracteres, con letras en mayúscula y minúscula, números y caracteres especiales.
                    </div>
                </div>

                <div className="col-12 d-flex justify-content-between">
                    <button 
                        type="submit" 
                        className="btn px-5 py-2" 
                        style={{ 
                            borderRadius: "12px", 
                            backgroundColor: "#10757a", 
                            border: "none", 
                            padding: "12px 30px", 
                            fontSize: "16px", 
                            fontWeight: "600", 
                            boxShadow: "0px 4px 15px rgba(0, 123, 255, 0.3)",
                            transition: "background-color 0.3s ease",
                            color: "#fff",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
                    >
                        Registrarse
                    </button>
                    <Link to="/">
                        <button 
                            className="btn btn-secondary px-5 py-2" 
                            style={{ 
                                borderRadius: "12px", 
                                backgroundColor: "#6c757d", 
                                border: "none", 
                                padding: "12px 30px", 
                                fontSize: "16px", 
                                fontWeight: "600",
                                boxShadow: "0px 4px 15px rgba(108, 117, 125, 0.3)", 
                                transition: "background-color 0.3s ease" 
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#5a6268"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#6c757d"}
                        >
                            Volver
                        </button>
                    </Link>
                </div>

                {loading && (
                    <div className="d-flex justify-content-center mt-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    </div>
	);
}
