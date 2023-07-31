import { useParams } from "react-router-dom";

function User() {
    const { userId } = useParams()
    return <h1>This is the profile of user with Id {userId}</h1>
}

export default User;