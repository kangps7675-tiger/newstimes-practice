const API_KEY = 'b62c99bab821449d96d2bb258fbb183c';
let newsList = [];
const menus = document.querySelectorAll('.menus button');
menus.forEach(menu=> menu.addEventListener('click', (event) =>getNewsByCategory(event)));
  
let url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
);

const getNews = async () => {
    try {
    const response = await fetch(url);
    
    const data = await response.json();
    if(response.status === 200){
      if(data.articles.length === 0){
          throw new Error("검색된 결과가 없습니다.");
    }
    newsList = data.articles;
    render();
    }else{
        throw new Error(data.message);
    }
    }catch(error){
     errorRender(error.message);
    }
};

const getLatestNews = async () => {
     url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
    );
   getNews();
};

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
    );
   getNews();
}

const getNewsByKeyword= async ()=>{
    const keyword = document.getElementById("search-input").value;
    console.log("keyword", keyword);
    url = new URL
       (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`);
    getNews();
    }

window.getNewsByKeyword = getNewsByKeyword;


document.getElementById("search-input").addEventListener("keydown", (event) => {
    
    if (event.key === "Enter") {

        getNewsByKeyword();
    }
});


const render = () => {
    const newsHTML = newsList.map((news) => {
        // 1. 이미지가 null일 때 사용할 백업 주소
        return `<div class="row news">
            <div class="col-lg-4">
                <img class="news-image-size" 
                     src="${news.urlToImage}"/>
            </div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p>
                ${news.description}
                </p>
                <div>
                    ${news.source.name} ${news.publishedAt}
                </div>
            </div>
        </div>`;
    }).join('');
    
    console.log("html", newsHTML);

    document.getElementById('news-board').innerHTML = newsHTML;
};

// 엔터키 이벤트 리스너 추가
document.getElementById("search-input").addEventListener("keydown", (event) => {
    // 1. 누른 키가 'Enter'인지 확인
    if (event.key === "Enter") {
        // 2. 검색 함수 실행
        getNewsByKeyword();
    }
});

const errorRender = (errorMessage) =>{
    const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;

    document.getElementById("news-board").innerHTML = errorHTML;
}

getLatestNews();

//1. 버튼들에 클릭 이벤트를 줘야 한다
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기