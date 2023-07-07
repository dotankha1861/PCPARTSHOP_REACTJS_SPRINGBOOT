import { useEffect, useState } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart } from './redux/slices/authSlice';
import { request } from './utils/axios_helper';
function App() {

  const [message, setMessage] = useState([]);


  const {isFetching, error, currentUser} = useSelector(state => state.auth.login);
  const dispatch = useDispatch();

  const handleClickButton = async() => {
    try{
      const {data: resBody} = await request("post", "/payment");
      window.location.href = resBody.data;
      console.log(resBody.data);
      // setMessage(resBody.data);
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    dispatch(loginStart({username: "khadt", password: "180601"}));
  },[dispatch]);

  console.log({isFetching, error, currentUser});
  
  return (
      <div style={{overflow: "hidden", backgroundSize: "cover", height: "100vh", width: "100vw", backgroundImage: 'url("https://accgroup.vn/wp-content/uploads/2023/02/Background-la-gi.jpg")',color: "red", fontWeight: "bold", fontSize: "30px", textAlign: "center",textShadow: "1px 1px 3px black", paddingTop: "20px"}}> 
        <img className="icon" style={{width: "100px", height: "100px"}} src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Google-Photos_icon_logo_%28May-September_2015%29.png" alt="sad"></img>
        {isFetching && <div>Loading</div>}
        {error && <div>Error!</div>}
        {!isFetching && !error && <div>
            Hello, {currentUser?.lastName} {currentUser?.firstName} </div>
        }
        <button onClick={handleClickButton}>Get Message</button>
        {message.map((tests, index) => 
          <p key={index}>
            {
              Object.keys(JSON.parse(tests.data)).map(key => 
                <p>{key} == {JSON.parse(tests.data)[key]}</p>
              )
            }
          </p>
        )}
      </div>
  );
}

export default App;
