import React, {useState, useEffect} from 'react';
import alanBtn from '@alan-ai/alan-sdk-web'
import NewsCards from './components/NewsCards/NewsCards';
import wordsToNumbers from 'words-to-numbers';
import useStyles from './styles.js';



//alan API key generated after integrating with alan ai software(alan studio)
const alanKey = '9569866748898e5929ee32de4916668c2e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {
    
    
    //state for all the articles from APTI and activeArticle
    const [newsArticles, setNewsArticles] = useState([]);
    //We are starting from index 0 since this would be the index he would be currently reading
    const [activeArticle, setActiveArticle] = useState(-1);
    const classes = useStyles();
    
    useEffect(()=>{
        alanBtn({
            key: alanKey,
            onCommand: ({command, articles, number})=> {
                if(command ==='newHeadlines'){
                    setNewsArticles(articles);

                    //reset the activeArticle eachtime
                      setActiveArticle(-1);              
                }  
                else if(command==='highlight') {
                    //We will change the state based on previous state
                    //we set it by calling a callback that takes prevstate and gives the new one
                    //React recommends, if you are changing the state based on prev state, you call it as a  callback fx
                    setActiveArticle((prevActiveArticle)=>prevActiveArticle + 1)
                }
                else if({command:'open'}){
                    //fuzzy: true, will help to parse the word closest to that number
                    //for ===> four ==> 4
                    const parsedNumber = number.length > 2 ? wordsToNumbers(number, {fuzzy:true}): number
                    const article = articles[parsedNumber -1];

                    //we can only play 20 articles, make a check if we exceed the limit
                    if (parsedNumber>20){
                        alanBtn().playText('Please try that again')
                    }else if(article){
                        //open a new website based on link
                        window.open(articles[parsedNumber].url,'_blank') 
                        alanBtn().playText('Opening the article')
                    }                   
                }
            }
        })
    }, [])

     return(
         <div>  
           <div className={classes.logoContainer}>
               <img src='https://images.theconversation.com/files/280634/original/file-20190621-149822-pi1zcr.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=675.0&fit=crop' className={classes.alanLogo} alt ="alan logo"/>
           </div>
             <NewsCards articles = {newsArticles} activeArticle={activeArticle}/>
         </div>
     )
}

export default App