const API_KEY = 'b62c99bab821449d96d2bb258fbb183c';
let newsList = [];
const menus = document.querySelectorAll('.menus button');
menus.forEach(menu=> menu.addEventListener('click', (event) =>getNewsByCategory(event)));


const getLatestNews = async () => {
    const url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
    );
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log("dddd", newsList);
};

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    console.log("category", category);
    const url = new URL(
        `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
    );
    const response = await fetch(url);
    const data = await response.json();
    console.log("data", data);
    newsList = data.articles;
    render();
}

const getNewsByKeyword= async ()=>{
    const keyword = document.getElementById("search-input").value;
    console.log("keyword", keyword);
    const url = new URL
       (`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`);
    const response = await fetch(url); 
    const data = await response.json();
    console.log("data", data);
    newsList = data.articles;
    render();

    }


document.getElementById("search-input").addEventListener("keydown", (event) => {
    
    if (event.key === "Enter") {

        getNewsByKeyword();
    }
});


const render = () => {
    const newsHTML = newsList.map((news) => {
        // 1. 이미지가 null일 때 사용할 백업 주소
        `<div class="row news">
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
        </div>`
    }).join('');
    
    console.log("html", newsHTML);

    document.getElementById('news-board').innerHTML = newsHTML;
};
getLatestNews();

//1. 버튼들에 클릭 이벤트를 줘야 한다
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기