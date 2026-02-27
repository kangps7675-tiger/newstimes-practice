const API_KEY = 'b62c99bab821449d96d2bb258fbb183c';
let newsList = [];
const menus = document.querySelectorAll('.menus button');
menus.forEach(menu=> menu.addEventListener('click', (event) =>getNewsByCategory(event)));
  
let url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
);

let totalResult = 0;
let page = 1;
let pageSize = 10; 
let groupSize = 4;

const getNews = async () => {
    try {
    url.searchParams.set("page", page);  // &page=page
    url.searchParams.set("pageSize", pageSize); 
    const response = await fetch(url);

    const data = await response.json();
    console.log("data", data);
    if(response.status === 200){
      if(data.articles.length === 0){
          throw new Error("검색된 결과가 없습니다.");
    }
    newsList = data.articles;
    totalResult = data.totalResults;
    render();
    paginationRender();
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
    page = 1
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



const paginationRender = () => {
     // totalResult
    // page
    // pageSize
    // groupSize
    // totalPages 
    const totalPages = Math.ceil(totalResult / pageSize);
    // pageGroup
    const pageGroup = Math.ceil(page/groupSize);
    // lastPage

    let lastPage = pageGroup * groupSize;
   // 마지막 페이지그룹이 그룹사이즈보다 작다? lastPage = totalPages
    if (lastPage > totalPages) {
       lastPage = totalPages;
    }
    // firstPage
    const firstPage = 
       lastPage - (groupSize - 1)<=0? 1 : lastPage - (groupSize - 1);
    
   // 1. 화살표 버튼들을 담을 변수 시작
    let paginationHTML = `
        <li class="page-item" onclick="moveToPage(1)"><a class="page-link">&lt;&lt;</a></li>
        <li class="page-item" onclick="moveToPage(${page > 1 ? page - 1 : 1})"><a class="page-link">&lt;</a></li>`;

    // 2. 숫자 버튼들 생성
    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
    }

    // 3. 뒤쪽 화살표 버튼들 추가
    paginationHTML += `
        <li class="page-item" onclick="moveToPage(${page < totalPages ? page + 1 : totalPages})"><a class="page-link">&gt;</a></li>
        <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link">&gt;&gt;</a></li>`;

    document.querySelector(".pagination").innerHTML = paginationHTML;
     
  // <nav aria-label="Page navigation example">
  //  <ul class="pagination">
  //   <li class="page-item"><a class="page-link" href="#">Previous</a></li>
  //   <li class="page-item"><a class="page-link" href="#">1</a></li>
  //   <li class="page-item"><a class="page-link" href="#">2</a></li>
  //   <li class="page-item"><a class="page-link" href="#">3</a></li>
  //   <li class="page-item"><a class="page-link" href="#">Next</a></li>
  //  </ul>
  // </nav>
}

const moveToPage=(pageNum)=>{
    console.log("moveToPage", pageNum);
    page = pageNum;
    getNews();
}
getLatestNews();

//1. 버튼들에 클릭 이벤트를 줘야 한다
//2. 카테고리별 뉴스 가져오기
//3. 그 뉴스를 보여주기