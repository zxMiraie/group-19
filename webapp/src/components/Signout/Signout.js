import {logOutAction} from "../../store/actions/authActions";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

export const Signout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(logOutAction());
        navigate("/sign-in");
    };

    useEffect(() => {
        handleSignOut();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};