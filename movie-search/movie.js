
const searchBtn=document.getElementById("search");
const resultDiv=document.getElementById("result");
const detailDiv=document.getElementById("detail");
const keywordInput=document.getElementById("keyword");
const loadingP=document.getElementById("loading");
const emptyP=document.getElementById("empty");
//getmovie函式
async function getmovie(){
    emptyP.textContent="";
    resultDiv.style.display="grid";
    loadingP.textContent="搜尋中...";
    //先透過keyword抓資料
    let keyword=document.getElementById("keyword").value;
    try{
    const res=await fetch(`https://www.omdbapi.com/?s=${keyword}&apikey=ef58f175`);
    const data=await res.json();
    //已經抓完資料開始處理畫面
    loadingP.textContent=""
    resultDiv.innerHTML="";
    detailDiv.innerHTML="";
    if (data.Response==='False'){
        emptyP.textContent="找不到結果";
        return;
    }
    //將每一筆顯示到畫面上
    data.Search.forEach(movie=>{
        const movieDiv=document.createElement("div");
        movieDiv.innerHTML += `
                <img src="${movie.Poster}">
                <p>${movie.Title}</p>
          ` ;
        //每個電影div上建立監聽事件
        movieDiv.addEventListener('click',function(){
            resultDiv.style.display="none";//先把搜索完的結果隱藏
            getmovieDetail(movie.imdbID);
        });
        resultDiv.appendChild(movieDiv);
    })
    }
    catch(err){
        console.log(err);
    }
}
//getmovieDetail函式
async function getmovieDetail(id){
    try{
        const res=await fetch(`https://www.omdbapi.com/?i=${id}&apikey=ef58f175`);
        const data=await res.json();
        //抓完資料更新到畫面
        detailDiv.innerHTML=`
            <button id="back">返回</button>
            <div id="detail-content">
                <img src="${data.Poster}">
                <div id="detail-info">
                    <p class="detail-title">${data.Title}</p>
                    <p>年份：${data.Year}</p>
                    <p>類型：${data.Genre}</p>
                    <p>導演：${data.Director}</p>
                    <p>演員：${data.Actors}</p>
                    <p>片長：${data.Runtime}</p>
                    <p>語言：${data.Language}</p>
                    <p>國家：${data.Country}</p>
                    <p>評分：${data.imdbRating}</p>
                    <p>獎項：${data.Awards}</p>
                    <p>簡介：${data.Plot}</p>
                </div>
            </div>
        `;
        const backBtn=document.getElementById("back");
        backBtn.addEventListener('click',()=>{
            resultDiv.style.display="grid";
            detailDiv.innerHTML="";
        });
    }
    catch(err){
        console.log(err)
    }
}

searchBtn.addEventListener('click',getmovie);
keywordInput.addEventListener('keydown',(e)=>{
    if (e.key === "Enter"){
        if(keyword.value===""){
            return
        };
    getmovie()                
    }    
})