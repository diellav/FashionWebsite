import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
const TokenCheck=(showWarning=true)=>{
    const navigate=useNavigate();

    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(!token) return;

        try{
            const decoded=jwtDecode(token);
            const expiredTime=decoded.exp*1000;
            const currentTime=Date.now();
            const remainingTime=expiredTime-currentTime;
//dmth ketu kalkulohet sa kohe ka mbetur deri sa te skadoje tokeni prej kohes qe kemi bere login 

            if(remainingTime<=0){  //nese ka skaduar tokeni
                alert('Your session has expired! Please login again.');
                localStorage.removeItem('token');
                navigate('/login', {replace: true});
            }else{ //nese akoma nuk ka skadu tokeni dhe ka mbetur edhe nje min kohe, jep alert
                if(showWarning && remainingTime>60000){
                    setTimeout(()=>{
                        alert('Your session will expire in 1 minute, please refresh or login again!');
                    }, remainingTime-60000);
                }
                setTimeout(()=>{   //kjo e largon tokenin pas perfundimit te kohes 1 min, nese perdoruesi ska bere asgje
                        alert('Your session has expired! Please login again.');
                        localStorage.removeItem('token');
                        navigate('/login', {replace: true})
                    }, remainingTime);
                }

            }catch(err){
                console.error('Failed decoding token:', err);
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
            }
        },[navigate,showWarning]);
};
export default TokenCheck;