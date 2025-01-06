import { createContext, useState } from "react";
import run from "../config/gemini";

export const  Context = createContext();

const ContextProvider =(props)=>{

    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] =useState("");
    const [prevPrompts,setPrevPrompts] =useState([]);
    const [showResult,setShowResult] =useState(false);
    const [loading, setLoading] =useState(false);
    const [resultData,setResultData] =useState("");

const delayPara = (index,nextWord)=> {
//typing effect
setTimeout(function () {
    setResultData(prev=>prev+nextWord);
},75*index)//duration*index
}//now adding this function in onset function we will be removing setResultData(newResponse2) with some code marked there also


// for newchat
 const newChat = ()=>{
    setLoading(false)
    setShowResult(false)



 }

  const onSent = async (prompt)=>{

    setResultData("")//so that the result dayta get reset and our state variable got empty
    setLoading(true)//loading animation on web page
    setShowResult(true)
    //if block for recent history in sidebar
    let response;
    if(prompt !== undefined){//if will when we click on recent item on the sidebar
        response = await run(prompt);//bcz prompt is not undefined
        setRecentPrompt(prompt)
        
    }
    else{
        // this will be executed when we run onsent function for input field
        setPrevPrompts(prev=>[...prev,input])
        setRecentPrompt(input)
        response = await run(input)

    }


    //  before if block--
        // setRecentPrompt(input)
        // setPrevPrompts(prev=>[...prev,input])//for history--every time we run on set function the input will be stored in the array
        // const response = await run(input)//our response will be stored in response variable







    // 
     let responseArray = response.split("**");
     let newResponse="";//yha par empty string kra h ek error resolve krne ke liye undefined likha aa rha tha 
     for(let i =0 ; i < responseArray.length; i++)
     {
        if(i === 0||i%2 !== 1){//if not even
            newResponse += responseArray[i];
        }
        else{
           newResponse += "<b>"+responseArray[i]+"</b>";
        }
     }
     let newResponse2 = newResponse.split("*").join("</br>")

    //  setResultData(newResponse2) in place of this to have typing effect from above func
    let newResponseArray = newResponse2.split(" ");//splitting on empty space which means there is another word 
    for(let i=0; i<newResponseArray.length;i++){//adding word one by one in constWord named variable that will be used to create typing effect
        const nextWord = newResponseArray[i];
        delayPara(i,nextWord+" ")//we have used  space to split the string so in our response we will not get space to solve this we concate space with next word
    }
     setLoading(false)
     setInput("")//reset the input field


  }

  //onSent("What is react js?")

    const contextValue={
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        setResultData,
        recentPrompt,
        loading,
        setLoading,
        setInput,
        input,
        resultData,
        showResult,
        setShowResult,
        newChat

    }//if place any variable or function in this variable then we use anywhere in our project

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;