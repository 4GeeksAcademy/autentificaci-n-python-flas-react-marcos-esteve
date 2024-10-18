import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const Dashboard = () => {
	const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    function handleLogout() {
        console.log("Logging out");
        localStorage.clear(); 
        actions.verifyCustomerToken();
        actions.customerLogout(); 
        navigate("/"); 
    }
	useEffect(() => {
		actions.verifyCustomerToken();
	}, []);

	return (
		<div className="text-center mt-5">
			<h1>Hola, te has logeado!</h1>
            <button
						className="dropdown-item"
						onClick={()=>handleLogout()}
						style={{ color: "#ff0000", fontSize: "14px" }}
					>
						LogOut
					</button>
			
		</div>
	);
};
