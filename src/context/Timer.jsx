import { useState, useEffect,useContext,useRef, createContext} from "react";



const TimerContext = createContext(); 

export default  function Timer({children}){


const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalIdRef = useRef(null);
    const startTimeRef = useRef(0);

    useEffect(() => {

        if(isRunning){
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        }

        return () => {
            clearInterval(intervalIdRef.current);
        }
    }, [isRunning]);

    function start(){
        setIsRunning(true);
        startTimeRef.current = Date.now() - elapsedTime;
    }

    function stop(){
        setIsRunning(false);
    }

    function reset(){
        setElapsedTime(0);
        setIsRunning(false);
    }

    function formatTime(ms){

        let hours = Math.floor(ms / (1000 * 60 * 60));
        let minutes = Math.floor(ms / (1000 * 60) % 60);
        let seconds = Math.floor(ms / (1000) % 60);
      
        
        

        return `${minutes}m:${seconds}s`;
    }


    

    return (
        <TimerContext.Provider value={{ formatTime, start, stop, reset,elapsedTime }}>
          {children}
        </TimerContext.Provider>
      );

    
}

export function useTimer(){
    return  useContext(TimerContext);
}


