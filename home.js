let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
let options = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
    level: 3 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
var ps = new kakao.maps.services.Places(); // 장소 검색 객체 생성
var marker = undefined;
var infowindow = undefined;


// 버튼 누르거나 Enter 눌렀을 때 검색이 되도록 만들기
let search_btn = document.querySelector(".search-btn");
let search_bar = document.querySelector("#search-bar");

search_btn.addEventListener("click", () => {
    let keyword = search_bar.value;
    if (keyword) { // 키워드가 존재하면 (검색 값이 존재하면)
        keywordSearch(keyword);
    } else {
        alert("검색어를 입력해주세요.");
    }
});

// keyup 이벤트로 엔터키가 눌렸을 때를 감지
search_bar.addEventListener("keyup", () => {
    // keycode 13 : Enter key
    if (event.keyCode == 13) {
        search_btn.click(); // 버튼을 클릭한 것과 동일한 효과
    }

});

function keywordSearch(keyword) {
    ps.keywordSearch(keyword, keywordSearchCallback);
    if (marker !== undefined) { // 새롭게 검색할 경우 기존 마커와 인포윈도우 삭제
        marker.setMap(null);
        infowindow.close();
    }
}

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function keywordSearchCallback(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        const center = new kakao.maps.LatLng(data[0].y, data[0].x) // 검색된 첫 번째 값을 중심으로 설정
        map.setCenter(center);

        // 마커를 생성합니다
        marker = new kakao.maps.Marker({
            position: center
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);

        var textFromPrompt = prompt('적고 싶은 말:');

        var iwContent = `<div style="padding:5px;">-이곳의 정보-<br>${textFromPrompt}</div>`,
            iwPosition = center;

        // 인포윈도우를 생성합니다
        infowindow = new kakao.maps.InfoWindow({
            position: iwPosition,
            content: iwContent
        });

        // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
        infowindow.open(map, marker);
    }
}