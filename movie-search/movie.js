
const searchBtn=document.getElementById("search");
const resultDiv=document.getElementById("result");
const detailDiv=document.getElementById("detail");
const keywordInput=document.getElementById("keyword");
const loadingP=document.getElementById("loading");
const emptyP=document.getElementById("empty");
const totalP=document.getElementById("total");
const paginationDiv=document.getElementById("pagination");
const prevBtn=document.getElementById("prev");
const nextBtn=document.getElementById("next");
const pageNum=document.getElementById("pageNum");
let currentPage=1;
let totalPage=1;//用來算出總頁數
//getmovie函式
async function getmovie(){
    emptyP.textContent="";
    totalP.textContent="";
    resultDiv.style.display="grid";
    loadingP.textContent="搜尋中...";
    //先透過keyword抓資料
    let keyword=document.getElementById("keyword").value;
    try{
    const res=await fetch(`https://www.omdbapi.com/?s=${keyword}&page=${currentPage}&apikey=ef58f175`);
    const data=await res.json();
    //已經抓完資料開始處理畫面
    loadingP.textContent=""
    resultDiv.innerHTML="";
    detailDiv.innerHTML="";
    if (data.Response==='False'){
        emptyP.textContent="找不到結果";
        return;
    }
    //總共幾筆資料
    totalP.textContent=`Total:${data.totalResults} 筆`;
    //算出總頁數(給外面用)，然後把分頁按鈕顯示出來
    totalPage=Math.ceil(data.totalResults/10);
    paginationDiv.style.display="flex";
    //將每一筆顯示到畫面上
    data.Search.forEach(movie=>{
        const movieDiv=document.createElement("div");
        movieDiv.innerHTML += `
                <img src="${movie.Poster}" onerror="this.src='https://placehold.co/300x450?text=No+Image'">
                <p>${movie.Title}</p>
          ` ;
        //每個電影div上建立監聽事件
        movieDiv.addEventListener('click',function(){
            resultDiv.style.display="none";//先把搜索完的結果隱藏
            totalP.textContent = "";//把總筆數清空
            paginationDiv.style.display="none";//把分頁按鈕隱藏
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
                <img src="${data.Poster}" onerror="this.src='https://placehold.co/300x450?text=No+Image'">
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
        //返回按鈕監聽事件
        const backBtn=document.getElementById("back");
        backBtn.addEventListener('click',()=>{
            resultDiv.style.display="grid";
            detailDiv.innerHTML="";
            paginationDiv.style.display="flex";
        });
    }
    catch(err){
        console.log(err)
    }
}
//搜尋按鈕監聽事件
searchBtn.addEventListener('click',()=>{
    currentPage=1;
    pageNum.textContent=currentPage;
    getmovie();
});

keywordInput.addEventListener('keydown',(e)=>{
    if (e.key === "Enter"){
        if(keywordInput.value===""){
            return
        };
    currentPage=1;
    pageNum.textContent=currentPage;
    getmovie()                
    }    
})
//分頁按鈕監聽事件
prevBtn.addEventListener('click',()=>{
    if (currentPage>1){
        currentPage-=1;
        getmovie();
        pageNum.textContent=currentPage;
    }
})
nextBtn.addEventListener('click',()=>{
    if (currentPage<totalPage){
        currentPage+=1;
        getmovie();
        pageNum.textContent=currentPage;
    }
})
