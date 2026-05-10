
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
const searchPage=document.getElementById("search-page");
const favoritePage=document.getElementById("favorite-page");
const favoriteListDiv=document.getElementById("favorite-list");
const navSearch=document.getElementById("nav-search");
const navFavorite=document.getElementById("nav-favorite");
const noFavoriteP=document.getElementById("no-favorite");
let currentPage=1;
let totalPage=1;//用來算出總頁數
let fromPage="";
//建立收藏陣列
let favorites=JSON.parse(localStorage.getItem("favorites"))||[];
//收藏函式
function saveFavorites(){
    localStorage.setItem("favorites",JSON.stringify(favorites));
}
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
        paginationDiv.style.display="none";
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
                <button class="heart-btn">🤍</button>
                <p>${movie.Title}</p>
          ` ;
        //每個電影div上建立監聽事件
        movieDiv.addEventListener('click',function(){
            fromPage = "search";
            searchPage.style.display = "none";//點擊後把搜尋頁面隱藏
            getmovieDetail(movie.imdbID);
        });
        //收藏圖示（愛心）按鈕顯示與監聽事件
        const heartBtn=movieDiv.querySelector(".heart-btn");
        heartBtn.movieId = movie.imdbID;//把imdbID存在愛心按鈕的屬性裡，等一下點擊的時候可以知道是哪一部電影
        if(favorites.some(f => f.id === movie.imdbID)){
            heartBtn.textContent = "❤️"
        } 
        else {
            heartBtn.textContent = "🤍"
        }
        heartBtn.addEventListener('click',(e)=>{
            e.stopPropagation();
            if(favorites.some(f => f.id === movie.imdbID)){
                favorites=favorites.filter(f=>f.id!==movie.imdbID);
                saveFavorites();
                heartBtn.textContent = "🤍"
            }
            else{
                favorites.push({
                id:movie.imdbID,
                title:movie.Title,
                poster:movie.Poster
            })
            saveFavorites();
            heartBtn.textContent = "❤️"
            }
        })
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
            <div id="detail-btns">
                <button id="back">返回</button>
                <button id="addFavorite"></button>
            </div>
            <div id="detail-content">
                <img src="${data.Poster}" onerror="this.src='https://placehold.co/300x450?text=No+Image'">
                <div id="detail-info">
                    <p class="detail-title">${data.Title}<span class="rating">${data.imdbRating}</span></p>
                    <p>年份：${data.Year}</p>
                    <p>類型：${data.Genre}</p>
                    <p>導演：${data.Director}</p>
                    <p>演員：${data.Actors}</p>
                    <p>片長：${data.Runtime}</p>
                    <p>語言：${data.Language}</p>
                    <p>國家：${data.Country}</p>
                    <p>獎項：${data.Awards}</p>
                    <p>簡介：${data.Plot}</p>
                </div>
            </div>
        `;
        //返回按鈕監聽事件
        const backBtn=document.getElementById("back");
        backBtn.addEventListener('click',()=>{
            if(fromPage==="search"){
                detailDiv.innerHTML="";
                searchPage.style.display="block";
            }
            else if(fromPage==="favorite"){
                detailDiv.innerHTML="";
                renderFavoriteList();
                favoritePage.style.display="block";
            }
        updateHeart();
        });
        //收藏按鈕顯示的文字
        const addFavoriteBtn=document.getElementById("addFavorite");
        if(favorites.some(movie=>movie.id===id)){
            addFavoriteBtn.textContent="❤️ 已收藏";
        } else {
            addFavoriteBtn.textContent="🤍 收藏";
        }
        //收藏按鈕監聽事件
        addFavoriteBtn.addEventListener('click',()=>{
            if(favorites.some(movie=>movie.id===id)){
                // 取消收藏
                favorites=favorites.filter(movie=>movie.id!==id);
                saveFavorites();
                addFavoriteBtn.textContent="🤍 收藏";
            }
            else{
            //收藏
            favorites.push({
                id:data.imdbID,
                title:data.Title,
                poster:data.Poster
            })
            saveFavorites();
            addFavoriteBtn.textContent="❤️ 已收藏";
            }
    })
}
    catch(err){
        console.log(err)
    }
}
//render收藏清單函式
function renderFavoriteList(){
        favoriteListDiv.innerHTML = "";
        //如果收藏清單是空的，顯示提示訊息
        if(favorites.length===0){
            noFavoriteP.style.display="block";
            return
        }
        noFavoriteP.style.display="none";
        favorites.forEach(movie=>{
            const movieDiv=document.createElement("div");
            movieDiv.innerHTML += `
                <img src="${movie.poster}" onerror="this.src='https://placehold.co/300x450?text=No+Image'">
                <p>${movie.title}</p>
          ` ;
            favoriteListDiv.appendChild(movieDiv);
        //每個電影div上建立監聽事件
        movieDiv.addEventListener('click',function(){
        favoritePage.style.display="none";
        fromPage = "favorite";
        getmovieDetail(movie.id);
        });
        })
}
//愛心圖示更新函式
function updateHeart(){
    document.querySelectorAll(".heart-btn").forEach(btn=>{
        btn.textContent = favorites.some(f=>f.id === btn.movieId)?"❤️":"🤍  "
    })
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
//nav監聽事件
navSearch.addEventListener('click',()=>{
    navSearch.classList.add("active");
    navFavorite.classList.remove("active");
    searchPage.style.display="block";
    favoritePage.style.display="none";
    detailDiv.innerHTML="";
    updateHeart();
})
navFavorite.addEventListener('click',()=>{
    navSearch.classList.remove("active");
    navFavorite.classList.add("active");
    searchPage.style.display="none";
    favoritePage.style.display="block";
    detailDiv.innerHTML="";
    favoriteListDiv.innerHTML = "";
    //顯示收藏清單
    renderFavoriteList();
})
//nav切換函式
